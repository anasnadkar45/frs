import { completeWorkoutAction } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST() {
  const result = await completeWorkoutAction();
  return NextResponse.json(result);
}