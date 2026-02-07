import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ THIS MODEL WORKS ON BACKEND
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Test route
app.get("/", (req, res) => {
  res.send("Gemini backend running");
});

// Conversation route
app.post("/conversation", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Gemini backend running");
});