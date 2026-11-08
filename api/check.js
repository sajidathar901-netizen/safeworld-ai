export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST method" });
  }

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Please provide text to check." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: "You are SafeWorldAI, a safety assistant. Analyse the supplied message or link for scam warning signs. Explain suspicious signs, safe next steps, and uncertainty. Never claim certainty without evidence.",
        input: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    return res.status(200).json({
      result: data.output_text || "No analysis returned."
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
