'use client'

import { FitnessPlan } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlanCardProps {
    plan: FitnessPlan
}

export function PlanCard({ plan }: PlanCardProps) {
    return (
        <Card className="hover:shadow-lg transition-all hover:border-primary">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{plan.summary}</CardTitle>
                        <CardDescription className="mt-1">
                            Created {new Date(plan.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="whitespace-nowrap bg-chart-1">
                        {plan.category}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">BMI</p>
                        <p className="text-lg font-bold text-foreground">{plan.bmi.toFixed(1)}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">Daily Calories</p>
                        <p className="text-lg font-bold text-foreground">{plan.calories}</p>
                    </div>
                </div>

                {/* Action Button */}
                <Link href={`/fitness-planner/my-plans/${plan.id}`} className="w-full">
                    <Button className="w-full mt-2" variant="default">
                        View Full Plan
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
