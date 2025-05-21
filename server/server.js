import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001; // Pick any free port not used by Vite

app.use(cors( { 
  origin: 'https://neogeo-manuals.netlify.app/',
  credentials: true,
} ));
app.use(express.json());

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post('/generate-image', async (req, res) => {
  const { prompt, provider = 'stability' } = req.body;

  try {

    if (provider === 'openai') {

      if (!openai) {
        return res.status(403).json({ error: 'OpenAI not configured' });
      }

      const response = await openai.images.generate({
        model: 'dall-e-2', // or 'dall-e-3' if enabled
        prompt,
        n: 1,
        size: '512x512',
      });

      const url = response.data?.[0]?.url;
      if (!url) return res.status(500).json({ error: 'No image returned from OpenAI' });

      return res.json({ image: url });
    }

    if (provider === 'deepai') {

        const deepaiKey = process.env.DEEPAI_API_KEY;
        if (!deepaiKey) {
          return res.status(403).json({ error: 'DeepAI API key missing' });
        } 
        console.log('selected provider: ', provider)
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: {
              'Api-Key': deepaiKey,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ text: prompt }),
          });
          console.log('result: ', prompt)
          const data = await response.json();
          
          if (!data || !data.output_url) {
            throw new Error('No image URL returned');
          }
          
          return res.json({ image: data.output_url });
    }

    if (provider === 'replicate') {
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        if (!replicateToken) {
          return res.status(403).json({ error: 'Replicate API key missing' });
        }
      
        const replicateModelVersion = "db21e45e10e0e7d49c0a2de2520b6fb10ee246e89194ae0130f356a02a0b8c08"; // cjwbw/stable-diffusion
      
        try {
          // Step 1: Trigger prediction
          const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
              Authorization: `Token ${replicateToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              version: replicateModelVersion,
              input: { prompt }
            })
          });
      
          const prediction = await startResponse.json();
          if (!prediction || !prediction.urls || !prediction.urls.get) {
            throw new Error("Failed to initiate prediction");
          }
      
          const statusUrl = prediction.urls.get;
      
          // Step 2: Poll for result
          let outputUrl = null;
          for (let i = 0; i < 20; i++) { // Max wait ~20 x 2s = 40s
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const pollResponse = await fetch(statusUrl, {
              headers: { Authorization: `Token ${replicateToken}` }
            });
            const statusResult = await pollResponse.json();
      
            if (statusResult.status === "succeeded") {
              outputUrl = statusResult.output?.[0];
              break;
            } else if (statusResult.status === "failed") {
              throw new Error("Replicate image generation failed");
            }
          }
      
          if (!outputUrl) {
            throw new Error("Replicate image generation timed out");
          }
      
          return res.json({ image: outputUrl });
      
        } catch (error) {
          console.error("Replicate error:", error);
          return res.status(500).json({ error: "Replicate image generation failed" });
        }
      }

    if (provider === 'stability') {

        const stabilityKey = process.env.STABILITY_API_KEY;
        if (!stabilityKey) {
          return res.status(403).json({ error: 'Stability API key missing' });
        } 

        const model = "stable-diffusion-xl-1024-v1-0"
    
        const stabilityResponse = await fetch(`https://api.stability.ai/v1/generation/${model}/text-to-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${stabilityKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
          }),
        });
    
        const data = await stabilityResponse.json();
    
        if (stabilityResponse.ok && data.artifacts?.[0]?.base64) {
          return res.json({ image: `data:image/png;base64,${data.artifacts[0].base64}` });
        } else {
          console.error('Stability API error:', data);
          return res.status(500).json({ error: 'Stability image generation failed.' });
        }

    }
    return res.status(500).json({ error: 'No Image Generation Provider found.' });

  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/manuals/:manualId", async (req, res) => {
  const manualId = req.params.manualId;
  try {
    const manual = await getManualWithPages(manualId);
    if (!manual) {
      return res.status(404).json({ error: "Manual not found" });
    }
    res.json(manual);
  } catch (err) {
    console.error("Error fetching manual:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Image generator API running port:${port}`);
});