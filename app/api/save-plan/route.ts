import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const { data: session } = await authClient.getSession({
            fetchOptions: {
                headers: await headers()
            }
        });

        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!data || !data.metrics) {
            return NextResponse.json(
                { error: 'Invalid data' },
                { status: 400 }
            );
        }

        const plan = await prisma.fitnessPlan.create({
            data: {
                userId,

                summary: data.summary,

                bmi: Number(data.metrics.bmi),
                category: data.metrics.category,
                calories: Number(data.metrics.dailyCalories),

                // 🔥 NEW FIELDS
                budget: Number(data.input?.budget) || null,
                estimatedCost: Number(data.budgetPlan?.estimatedSpend) || null,
                mode: data.input?.mode || null,
                location: data.input?.location || null,

                workout: data.workoutPlan,
                diet: data.dietPlan,
                shoppingList: data.shoppingList,

                tips: data.tips,
                warnings: data.warnings,

                input: data.input || {}
            }
        });

        return NextResponse.json(plan);

    } catch (error) {
        console.error('SAVE PLAN ERROR:', error);

        return NextResponse.json(
            { error: 'Failed to save plan' },
            { status: 500 }
        );
    }
}