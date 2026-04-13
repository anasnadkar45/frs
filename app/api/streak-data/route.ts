// /app/api/streak-data/route.ts

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json([], { status: 401 });
  }

  const logs = await prisma.workoutLog.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(logs);
}