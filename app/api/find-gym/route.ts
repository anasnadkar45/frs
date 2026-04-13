import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { city, budget, goal } = await req.json();

    const prompt = `
You are a fitness assistant.

TASK:
Suggest best gyms in the given city.

USER:
- City: ${city}
- Budget: ₹${budget}
- Goal: ${goal}

INSTRUCTIONS:
- Suggest 5 REALISTIC gyms (popular/local)
- Include:
  - name
  - location
  - price range
  - best time
  - reason
  - mapsQuery

- ALSO include:
  - 1 image URLs (realistic gym image from Unsplash or similar)
  - 2 user reviews per gym

RULES:
- reviews should feel real (short, human-like)
- rating should be between 3.5 - 5

RETURN JSON:

{
  "gyms": [
    {
      "name": "",
      "location": "",
      "price": "",
      "bestTime": "",
      "reason": "",
      "mapsQuery": "",
      "image": "",
      "reviews": [
        {
          "user": "",
          "rating": 0,
          "comment": ""
        }
      ]
    }
  ]
}
`;
    const response = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || '';

    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;

    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("RAW:", text);
      return NextResponse.json({ gyms: [] });
    }

    return NextResponse.json(parsed);

  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}