require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const path = require("path");
const app = express();
const port = 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Gemini API Setup
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAGIPnMhy9VFh069KCggV-iT4axekv9ZzU";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.get("/", (req, res) => {
    res.render("index"); // This requires a view engine like EJS, which isn't set up.
});

// Endpoint to fetch predictions
app.post("/get-predictions", async (req, res) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "Invalid topic provided" });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: `Provide statistics and predictions for ${topic}` }],
        },
      ],
    });

    const result = await chatSession.sendMessage("Provide detailed insights.");
    res.json({ predictions: result.response.text() });
  } catch (error) {
    console.error("Error fetching predictions:", error.message);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
