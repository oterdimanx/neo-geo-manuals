import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001; // Pick any free port not used by Vite

app.use(cors());
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

    // STABILITY AI FALLBACK
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
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Image generator API running on http://localhost:${port}`);
});