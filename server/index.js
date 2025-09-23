import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Style mappings to system prompts
const stylePrompts = {
  grammar:
    "Correct grammar and spelling without changing the meaning or tone. Only fix errors, do not rewrite the content.",
  slang:
    "Rewrite this text casually using modern slang while keeping the core message clear and engaging.",
  formal:
    "Rewrite this text in a formal, professional tone suitable for business documents, reports, or official correspondence.",
  persuasive:
    "Rewrite this text to be more persuasive and convincing, using compelling language that motivates the reader to action.",
};

// POST route for text enhancement
app.post("/api/enhance", async (req, res) => {
  try {
    const { text, style } = req.body;

    if (!text || !style) {
      return res.status(400).json({
        error: "Both text and style are required",
      });
    }

    if (!stylePrompts[style]) {
      return res.status(400).json({
        error: "Invalid style. Choose from: grammar, slang, formal, persuasive",
      });
    }

    if (!process.env.AiKey) {
      return res.status(500).json({
        error: "API key not configured",
      });
    }

    //! Call OpenRouter API
    // console.log("Making API call with model: openai/gpt-3.5-turbo");
    // console.log("Text:", text.substring(0, 50) + "...");
    // console.log("Style:", style);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.AiKey,
          "HTTP-Referer": "http://localhost:5173", // Dev URL for rankings
          "X-Title": "AI Grammar & Style Enhancer", // Your site title
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: stylePrompts[style],
            },
            {
              role: "user",
              content: text,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      console.error("Response status:", response.status);
      console.error("Response headers:", response.headers);
      let msg = "Failed to enhance text. Please try again.";
      try {
        const parsed = JSON.parse(errorData);
        if (parsed?.error?.message) msg = parsed.error.message;
      } catch {}
      return res.status(500).json({ error: msg });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        error: "Invalid response from AI service",
      });
    }

    const enhancedText = data.choices[0].message.content;

    res.json({
      success: true,
      originalText: text,
      enhancedText: enhancedText,
      style: style,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Internal server error. Please try again.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// 404 handler to always return JSON
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler to ensure JSON responses
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  if (res.headersSent) return; // Let Express handle if already started
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
