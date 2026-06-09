import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  message: {
    error: "Too many AI requests. Please try again in 15 minutes.",
  },
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ask-ai", aiLimiter, async (req, res) => {
  try {
    const {
      expenses,
      budget = 0,
      question,
    } = req.body;

    console.log("AI request received");

const prompt = `
You are Currencio AI, an expert personal finance advisor for users in India.

Currency: Indian Rupees (₹ / INR)

Budget: ₹${budget}

Expenses:
${JSON.stringify(expenses)}

Question:
${question}

Analyze the user's expenses and provide personalized advice.

Requirements:
- Use ONLY Indian Rupees (₹).
- Never use dollars ($).
- Mention total spending.
- Mention largest spending category.
- Explain if the user is overspending.
- Give actionable saving tips.
- If a budget exists, compare spending against the budget.
- Use numbers from the expense data.
- Format using bullet points.
- Maximum 250 words.
`;

let answer = "";

for (let i = 0; i < 3; i++) {
  try {
    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

    answer =
      completion.choices[0].message.content;

    break;
  } catch (err) {
    if (err.status === 503 && i < 2) {
      console.log("Groq busy, retrying...");
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
      continue;
    }
    throw err;
  }
}

res.json({
  answer,
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