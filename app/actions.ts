"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import dayjs from "dayjs";


export async function deletePlanAction(planId: string) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized - Please log in to delete a plan",
      }
    }

    // Check if plan exists and belongs to user
    const plan = await prisma.fitnessPlan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
      }
    }

    if (plan.userId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized - This plan does not belong to you",
      }
    }

    // Delete the plan
    await prisma.fitnessPlan.delete({
      where: { id: planId },
    })

    return {
      success: true,
      message: "Plan deleted successfully",
    }
  } catch (error) {
    console.error("[v0] Error deleting plan:", error)
    return {
      success: false,
      error: "Failed to delete plan. Please try again.",
    }
  }
}


export async function completeWorkoutAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const today = dayjs().startOf("day");
    const last = user.lastActive
      ? dayjs(user.lastActive).startOf("day")
      : null;

    let newStreak = 1;

    if (last) {
      const diff = today.diff(last, "day");

      if (diff === 0) {
        return {
          success: false,
          error: "Workout already completed today",
        };
      }

      if (diff === 1) {
        newStreak = user.streak + 1;
      }

      if (diff > 1) {
        newStreak = 1;
      }
    }

    // XP SYSTEM
    const xpGain = 10;
    const newXP = user.xp + xpGain;
    const newLevel = Math.floor(newXP / 100) + 1;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: newStreak,
        lastActive: new Date(),
        xp: newXP,
        level: newLevel,
      },
    });

    await prisma.workoutLog.create({
      data: {
        userId: user.id,
        date: new Date(),
      },
    });

    return {
      success: true,
      streak: newStreak,
      xp: newXP,
      level: newLevel,
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong" };
  }
}