const axios = require("axios");

const getTripSuggestions = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // Fast & free LLaMA model
        messages: [
          {
            role: "system",
            content: "You are a helpful travel assistant. Suggest fun, practical, and budget-friendly trip ideas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const suggestions = response.data.choices[0].message.content;
    res.json({ suggestions });
  } catch (err) {
    console.error("Groq LLaMA API Error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to get suggestions", error: err.message });
  }
};

module.exports = { getTripSuggestions };
