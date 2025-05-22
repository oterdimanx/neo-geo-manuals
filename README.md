# React + Vite + Typescript

This project is a manual editor designed to produce ready to print manuals in pdf or equivalent formats. It's a fan project to complete my own set of Neo Geo SNK game manuals that I could want to print, in case I own a MVS to AES cartridge conversion/bootleg and want a nice manual for it.
It allows the user to request Image Generator AI API's such as stability, or openAI.

## Features

Add a page
Remove a page
Loading Layout
Clear Layout
Canvas Zooming
Draggable / Resizable blocks
Text Prompt to Image Generation
Multi Page System
Layer System
Cloning Page System
And other features...

## Tech Stack 🔧 
Frontend (Client)

    Framework: React + Vite

    Styling: TailwindCSS

    State: useState, useEffect, etc. (React core)

    Animations: CSS-based + Tailwind transitions

    Auth/UI: Supabase Auth, custom login form

    Image Rendering: Uses a 15-frame flipbook animation system for animated PNG sequences

    Hosting: Deployed on Netlify

Backend (Server)

    Runtime: Node.js with Express

    API Features:

        Custom image generation endpoint (/generate-image)

        CORS setup for Netlify frontend

    Environment Config: .env for API keys, Supabase config

    Hosting: Deployed on Render

## 🔐 Authentication

    Users register and log in with Supabase Auth.

    Protected routes redirect unauthenticated users to the login page.

    Token handling is done through Supabase’s session helpers.

## 📚 Core Features
Feature	Description
📖 Manual Editor	Create rich manuals using image blocks and text blocks with page-by-page layout.
👁️ Manual Preview	Simulates a realistic book viewer with interactive page flipping (custom animations).
🎨 Image Generation	Backend integration with Stability API to generate game-themed images dynamically.
🧩 Modular Architecture	Clean separation between client (React app) and backend (Express server).
🌐 Routing	React Router handles both static and dynamic routes like /manuals/:manualId.
💬 Toasts	Optional react-toastify for elegant notifications (login success, errors, etc.).
🧪 Development & Deployment
Local Development

# Client
cd client
npm install
npm run dev

# Server
cd server
npm install
node server.js

Environment Variables

Create .env files in both /client and /server with the required variables:

client/.env

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=http://localhost:3001

server/.env

STABILITY_API_KEY=...

Deployment
Platform	Folder	Notes
Netlify (frontend)	/client	Publish directory: client/dist
Render (backend)	/server	Configure environment vars and CORS

## 📁 Project Structure

root/
├── client/           # Vite + React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx, main.tsx, etc.
│   └── vite.config.ts
├── server/           # Express backend
│   ├── server.js
│   └── generate-image.js
├── .env (optional)
├── README.md

## 🚀 Roadmap Ideas

Allow manual sharing via public URLs

Enhance mobile responsiveness

Export manuals to PDF format

Toastify

@TODO : Templates finalisation

