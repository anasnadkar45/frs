import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import MyPlansServer from "@/components/MyPlansServer"


function PlansSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
    )
}

export default function MyPlansPage() {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">My Fitness Plans</h1>
                        <p className="text-muted-foreground mt-2">View and manage your personalized fitness plans</p>
                    </div>
                    <Link href="/fitness-planner">
                        <Button size="lg" className="bg-primary text-primary-foreground">
                            + Create New Plan
                        </Button>
                    </Link>
                </div>

                {/* Plans Grid */}
                <Suspense fallback={<PlansSkeleton />}>
                    <MyPlansServer />
                </Suspense>
            </div>
        </div>
    )
}
