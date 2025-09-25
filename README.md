AI Grammar & Style Enhancer

A full-stack web application that uses AI to enhance text with grammar correction and style transformation.

🚀 Features

Grammar Fix – Correct grammar and spelling errors

Slang – Transform text into casual, modern slang

Formal – Convert text to professional, formal language

Persuasive – Rewrite text to be more convincing and compelling

🛠 Tech Stack

Frontend: React + Vite + TailwindCSS

Backend: Node.js + Express

AI API: OpenRouter (gpt-oss-turbo model)

Utilities: Concurrently for running frontend & backend together

⚙️ Setup Instructions
1. Environment Setup

Create a .env file in the root directory with your OpenRouter API key:

AI_KEY=your_openrouter_api_key_here
PORT=5000

2. Install Dependencies
npm install

3. Run the Application

Run frontend and backend together:

npm start


Or run them separately:

# Backend only
npm run server  

# Frontend only
npm run dev  

4. Access the Application

Frontend: http://localhost:5173

Backend API: http://localhost:5000

📡 API Endpoints
POST /api/enhance

Enhance text with the specified style.

Request Body:

{
  "text": "Your text to enhance",
  "style": "grammar" // or "slang", "formal", "persuasive"
}


Response:

{
  "success": true,
  "originalText": "Original text",
  "enhancedText": "Enhanced text",
  "style": "grammar"
}

GET /api/health

Health check endpoint to verify server status.

🖥 Development

Vite for fast frontend development

Express for backend API

TailwindCSS for styling

Concurrently to run both services

📦 Deployment

The app is ready to deploy on Vercel.

Frontend is served from Vite’s build output (dist/)

Backend routes are handled as API functions

📜 License

MIT License