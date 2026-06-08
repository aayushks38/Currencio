import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/ask-ai", async (req, res) => {
  try {
    const {
      expenses,
      budget = 0,
      question,
    } = req.body;

    console.log("AI request received");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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

      let result;

    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        if (err.status === 503 && i < 2) {
          console.log("Gemini busy, retrying...");
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
          continue;
        }
        throw err;
      }
    }

    res.json({
      answer: result.response.text(),
    });
  } catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
  console.error(error.message);
  console.error(error.stack);

  res.status(500).json({
    error: "AI is temporarily unavailable. Please try again later.",
  });
}
});

app.listen(5000, () => {
  console.log("AI server running on port 5000");
});