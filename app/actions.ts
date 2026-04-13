"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

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
