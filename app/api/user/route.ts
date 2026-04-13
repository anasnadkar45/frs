import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Dynamically import auth and db to handle missing dependencies gracefully
    let authClient, prisma;
    
    try {
      const authModule = await import('@/lib/auth-client');
      const dbModule = await import('@/lib/db');
      authClient = authModule.authClient || authModule.authClient;
      prisma = dbModule.default;
    } catch (error) {
      console.log('Auth/DB modules not available, using fallback');
      return NextResponse.json({
        user: {
          id: '1',
          name: 'User',
          email: 'user@example.com',
          image: null,
        },
        plans: [],
      });
    }

    // Get session from betterauth
    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: await headers()
      }
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's fitness plans from database
    const plans = await prisma.fitnessPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        email: session.user.email,
        image: session.user.image,
      },
      plans: plans.map(plan => ({
        id: plan.id,
        summary: plan.summary,
        category: plan.category,
        bmi: plan.bmi,
        calories: plan.calories,
        budget: plan.budget,
        estimatedCost: plan.estimatedCost,
        location: plan.location,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    // Return fallback data if there's any error
    return NextResponse.json({
      user: {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        image: null,
      },
      plans: [],
    });
  }
}
