import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const {
            age,
            weight,
            height,
            fitnessLevel,
            goals,
            preferences,
            activityLevel,
            dietPreferences,

            // 🔥 NEW FIELDS
            budget,
            location,
            mode // "budget" | "student" | "normal"
        } = await request.json();

        const weightNum = Number(weight);
        const heightNum = Number(height);

        const bmi = weightNum / ((heightNum / 100) ** 2);

        let category = 'Normal';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 25) category = 'Overweight';

        const bmr = 10 * weightNum + 6.25 * heightNum - 5 * Number(age) + 5;

        const activityMultiplierMap: Record<string, number> = {
            sedentary: 1.2,
            'lightly active': 1.375,
            'moderately active': 1.55,
            'very active': 1.725
        };

        const multiplier = activityMultiplierMap[activityLevel] || 1.2;
        const dailyCalories = Math.round(bmr * multiplier);

        // 🧠 IMPROVED PROMPT
        const prompt = `
You are an expert Indian fitness coach + nutritionist.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation

USER DETAILS:
Age: ${age}
Weight: ${weight} kg
Height: ${height} cm
Fitness Level: ${fitnessLevel}
Goal: ${goals}
Activity: ${activityLevel}
Diet Preference: ${dietPreferences}
Food Preference: ${preferences}

SPECIAL CONDITIONS:
- Budget per day: ₹${budget}
- Location: ${location}
- Mode: ${mode}

PRE-CALCULATED:
BMI: ${bmi.toFixed(1)}
Category: ${category}
Calories: ${dailyCalories}

IMPORTANT INSTRUCTIONS:
- Meals MUST fit within ₹${budget}/day
- Use LOCAL Indian foods (cheap & available)
- If mode = "student", prioritize:
  - simple cooking
  - hostel/PG friendly food
- Include approx cost per meal
- Include calories per meal

RETURN THIS JSON:

{
  "summary": "",
  "metrics": {
    "bmi": ${bmi.toFixed(1)},
    "category": "${category}",
    "dailyCalories": ${dailyCalories}
  },
  "budgetPlan": {
    "dailyBudget": ${budget},
    "estimatedSpend": 0
  },
  "workoutPlan": {
    "monday": [],
    "tuesday": [],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": [],
    "sunday": []
  },
  "dietPlan": {
    "breakfast": [
      {
        "meal": "",
        "calories": 0,
        "cost": 0
      }
    ],
    "lunch": [],
    "dinner": [],
    "snacks": []
  },
  "shoppingList": [],
  "tips": [],
  "warnings": []
}
`;

        const response = await genAI.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const text = response.text || '';

        const cleanText = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        let parsed;

        try {
            parsed = JSON.parse(cleanText);
        } catch (err) {
            console.error('❌ RAW AI RESPONSE:', text);

            parsed = {
                summary: "AI failed. Try again.",
                metrics: {
                    bmi: bmi.toFixed(1),
                    category,
                    dailyCalories
                },
                budgetPlan: {
                    dailyBudget: budget,
                    estimatedSpend: 0
                },
                workoutPlan: {},
                dietPlan: {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: []
                },
                shoppingList: [],
                tips: [],
                warnings: ["Formatting error"]
            };
        }

        return NextResponse.json({
            ...parsed,
            input: {
                age,
                weight,
                height,
                goals,
                budget,
                location,
                mode
            }
        });

    } catch (error) {
        console.error('Error:', error);

        return NextResponse.json(
            { error: 'Failed to generate plan' },
            { status: 500 }
        );
    }
}