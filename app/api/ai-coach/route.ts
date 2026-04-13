import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Trusted product database
const PRODUCT_DB: Record<string, any> = {
  protein: {
    name: "Optimum Nutrition Whey Protein",
    image: "https://m.media-amazon.com/images/I/71+7i2lG7zL._SL1500_.jpg",
    buyLink: "https://www.amazon.in/dp/B002DYIZEO",
  },
  creatine: {
    name: "MuscleBlaze Creatine Monohydrate",
    image: "https://m.media-amazon.com/images/I/61h+7rK8mOL._SL1500_.jpg",
    buyLink: "https://www.amazon.in/dp/B00N1YPXW2",
  },
  preworkout: {
    name: "BigMuscles Real Pre-Workout",
    image: "https://m.media-amazon.com/images/I/71WkDp--uqL._SL1500_.jpg",
    buyLink: "https://www.amazon.in/dp/B07GZ7XG2S",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], userContext = {} } = await req.json();

    const prompt = `
You are an AI fitness coach.

STRICT RULES:
- Return ONLY valid JSON
- No markdown

USER MESSAGE:
"${message}"

CHAT HISTORY:
${history.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

---

Return JSON:

{
  "reply": "",
  "products": [
    {
      "name": "",
      "reason": "",
      "type": "protein | creatine | preworkout"
    }
  ],
  "videos": [
    {
      "title": "",
      "searchQuery": ""
    }
  ]
}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        reply: "Something went wrong. Try again.",
        products: [],
        videos: [],
      };
    }

    // ✅ Attach real product data
    parsed.products = parsed.products?.map((p: any) => {
      const key = p.type?.toLowerCase();
      if (PRODUCT_DB[key]) {
        return {
          ...p,
          ...PRODUCT_DB[key],
        };
      }
      return p;
    });

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}