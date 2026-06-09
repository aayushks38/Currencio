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
You are Currencio AI, a professional personal finance advisor for Indian users.

IMPORTANT RULES:
- All monetary values are in Indian Rupees (₹).
- NEVER use "$", "USD", "dollars", or any foreign currency.
- ALWAYS prefix money with ₹.
- Format money like ₹20,000 instead of 20000.
- Never mention JSON or raw data structures.
- Assume the user lives in India.

Monthly Budget: ₹${Number(budget).toLocaleString("en-IN")}

Expenses:
${expenses
  .map(
    (e) =>
      `${e.category}: ₹${Number(e.amount).toLocaleString("en-IN")}`
  )
  .join("\n")}

User Question:
${question}

Analyze the expense data and answer EXACTLY in this format:

📊 Spending Analysis
• Explain the main spending pattern.
• Mention the highest spending category.
• Compare spending against the budget.

💡 Recommendations
• Give 2-4 practical suggestions.
• Mention specific categories where savings are possible.

🎯 Conclusion
• Provide a short summary of the financial situation.

Requirements:
- Keep the response under 150 words.
- Use bullet points (•).
- Use ₹ for every monetary value.
- Never write plain amounts without ₹.
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