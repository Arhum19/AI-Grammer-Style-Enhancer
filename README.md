# AI Grammar & Style Enhancer

A full-stack web application that uses AI to enhance text with grammar correction and style transformation.

## Features

- **Grammar Fix**: Correct grammar and spelling errors
- **Slang**: Transform text into casual, modern slang
- **Formal**: Convert text to professional, formal language
- **Persuasive**: Rewrite text to be more convincing and compelling

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **AI API**: OpenRouter (gpt-oss-turbo model)

## Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory with your OpenRouter API key:

```env
AiKey=your_openrouter_api_key_here
PORT=5000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

To start both frontend and backend simultaneously:

```bash
npm start
```

Or run them separately:

```bash
# Backend only
npm run server

# Frontend only (in another terminal)
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### POST /api/enhance

Enhance text with the specified style.

**Request Body:**

```json
{
  "text": "Your text to enhance",
  "style": "grammar" // or "slang", "formal", "persuasive"
}
```

**Response:**

```json
{
  "success": true,
  "originalText": "Original text",
  "enhancedText": "Enhanced text",
  "style": "grammar"
}
```

### GET /api/health

Health check endpoint to verify server status.

## Usage

1. Enter or paste your text in the textarea
2. Select the enhancement style (Grammar Fix, Slang, Formal, or Persuasive)
3. Click "Enhance Text"
4. View the results and copy the enhanced text if needed

## Development

The application uses:

- Vite for fast frontend development
- Express for the backend API
- TailwindCSS for styling
- Concurrently to run both services

## License

MIT License+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
