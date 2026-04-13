import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { headers } from "next/headers"
import prisma from "@/lib/db"
import DeletePlanButton from "@/components/DeletePlanButton"

interface PlanDetailPageProps {
    params: Promise<{
        id: string
    }>
}

async function getPlan(planId: string) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return null
    }

    // Fetch plan from database
    const plan = await prisma.fitnessPlan.findUnique({
        where: {
            id: planId,
            userId: session.user.id // Ensure user owns this plan
        }
    })

    return plan
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
    const plan = await getPlan((await params).id)

    if (!plan) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/fitness-planner/my-plans">
                    <Button variant="ghost" className="mb-6">
                        ← Back to Plans
                    </Button>
                </Link>

                {/* Plan Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground">{plan.summary}</h1>
                            <p className="text-muted-foreground mt-2">
                                Created {new Date(plan.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <div className="mt-4 flex gap-3">
                                <Button  className="bg-primary hover:bg-primary/90">
                                    <a href={`/api/export-plan?id=${plan.id}`} download={`fitness-plan-${plan.id}.pdf`}>
                                        📥 Export PDF
                                    </a>
                                </Button>
                                {/* <Button variant="outline">Share Plan</Button> */}
                            </div>
                        </div>
                        <Badge variant="secondary" className="text-lg py-6 px-4 rounded-md h-fit">{plan.category}</Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{plan.bmi.toFixed(1)}</p>
                                <p className="text-sm text-muted-foreground mt-1">BMI</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200 dark:border-green-800">
                            <CardContent className="pt-6 text-center">
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{plan.calories}</p>
                                <p className="text-sm text-muted-foreground mt-1">Daily Calories</p>
                            </CardContent>
                        </Card>
                        {plan.budget && (
                            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-800">
                                <CardContent className="pt-6 text-center">
                                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹{plan.budget}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Budget</p>
                                </CardContent>
                            </Card>
                        )}
                        {plan.estimatedCost && (
                            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200 dark:border-orange-800">
                                <CardContent className="pt-6 text-center">
                                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">₹{plan.estimatedCost}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Est. Cost</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Workout Plan */}
                    <Card className="border-l-4 border-l-blue-500 ">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent">
                            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <span className="text-2xl">💪</span> Workout Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {Object.entries(plan.workout || {}).map(([day, exercises]) => (
                                <div key={day} className="border-b pb-4 last:border-0">
                                    <h3 className="font-semibold text-foreground capitalize mb-2 text-blue-600 dark:text-blue-400">{day}</h3>
                                    <ul className="space-y-1">
                                        {Array.isArray(exercises) && exercises.map((exercise: string, idx: number) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2 hover:text-foreground transition-colors">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>{exercise}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Diet Plan */}
                    <Card className="border-l-4 border-l-green-500 ">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950 dark:to-transparent">
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <span className="text-2xl">🥗</span> Diet Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                                plan.diet?.[mealType as keyof typeof plan.diet] && (
                                    <div key={mealType} className="border-b pb-4 last:border-0">
                                        <h3 className="font-semibold text-foreground capitalize mb-2 text-green-600 dark:text-green-400">{mealType}</h3>
                                        <ul className="space-y-2">
                                            {plan.diet[mealType as keyof typeof plan.diet]?.map((item: any, idx: number) => (
                                                <li key={idx} className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-muted/50">
                                                    <p className="font-medium text-foreground">{item.meal}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.calories} cal
                                                        {item.cost && ` • ₹${item.cost}`}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Tips & Warnings */}
                <div className="grid md:grid-cols-2 gap-6">
                    {plan.tips?.length > 0 && (
                        <Card className="border-l-4 border-l-amber-500 ">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950 dark:to-transparent">
                                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                    <span className="text-2xl">💡</span> Tips & Advice
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {plan.tips.map((tip: string, idx: number) => (
                                    <div key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                        <span className="text-amber-500 font-bold text-lg">✓</span>
                                        <span className="pt-0.5">{tip}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {plan.warnings?.length > 0 && (
                        <Card className="border-l-4 border-l-red-500  bg-red-50/30 dark:bg-red-950/20">
                            <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950 dark:to-transparent">
                                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                    <span className="text-2xl">⚠️</span> Warnings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {plan.warnings.map((warning: string, idx: number) => (
                                    <div key={idx} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-3 p-2 rounded bg-red-50/50 dark:bg-red-950/30">
                                        <span className="font-bold text-lg">!</span>
                                        <span className="pt-0.5">{warning}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Shopping List */}
                {plan.shoppingList && plan.shoppingList.length > 0 && (
                    <Card className="mt-6 border-l-4 border-l-teal-500 ">
                        <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950 dark:to-transparent">
                            <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                                <span className="text-2xl">🛒</span> Shopping List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {plan.shoppingList.map((item: any, idx: number) => (
                                    <label key={idx} className="flex items-center gap-3 p-3 bg-teal-50/30 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg cursor-pointer hover:bg-teal-50/60 dark:hover:bg-teal-950/60 transition-colors group">
                                        <input type="checkbox" className="rounded border-teal-300 text-teal-600 cursor-pointer" />
                                        <span className="text-sm text-foreground group-hover:font-medium transition-all">
                                            {item}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <DeletePlanButton planId={plan.id} />
                {/* Action Buttons */}
            </div>
        </div>
    )
}
