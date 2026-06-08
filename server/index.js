import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/ask-ai", async (req, res) => {
  try {
    const { expenses, budget, question } = req.body;

    console.log("AI request received");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

const prompt = `
You are Currencio AI.

Budget: ${budget}

Expenses:
${JSON.stringify(expenses)}

Question:
${question}

Answer as a personal finance advisor.
Keep answers under 4 bullet points.
Be concise.
Use simple language.
Maximum 100 words.
`;

console.log("EXPENSES:", expenses);
console.log("PROMPT:", prompt);

    const result = await model.generateContent(prompt);

    res.json({
      answer: result.response.text(),
    });
  } catch (error) {
  console.error("FULL ERROR:", error);

  res.status(500).json({
    error: error.message,
  });
}
});

app.listen(5000, () => {
  console.log("AI server running on port 5000");
});