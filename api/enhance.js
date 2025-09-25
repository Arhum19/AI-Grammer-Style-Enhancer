import fetch from "node-fetch";


const stylePrompts = {
  grammar: "Correct grammar and spelling without changing the meaning or tone. Only fix errors, do not rewrite the content.",
  slang: "Rewrite this text casually using modern slang while keeping the core message clear and engaging.",
  formal: "Rewrite this text in a formal, professional tone suitable for business documents, reports, or official correspondence.",
  persuasive: "Rewrite this text to be more persuasive and convincing, using compelling language that motivates the reader to action.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, style } = req.body;

  if (!text || !style) {
    return res.status(400).json({ error: "Both text and style are required" });
  }

  if (!stylePrompts[style]) {
    return res.status(400).json({
      error: "Invalid style. Choose from: grammar, slang, formal, persuasive",
    });
  }

  if (!process.env.AiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.AiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: stylePrompts[style] },
          { role: "user", content: text },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Failed to enhance text" });
    }

    res.status(200).json({
      success: true,
      originalText: text,
      enhancedText: data.choices[0].message.content,
      style,
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}