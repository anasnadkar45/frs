'use client'

import { FitnessPlan } from "@/lib/types"
import { PlanCard } from "./plan-card"
import { Empty } from "@/components/ui/empty"

interface MyPlansListProps {
    data: FitnessPlan[] | null
}

export function MyPlansList({ data }: MyPlansListProps) {
    if (!data || data.length === 0) {
        return (
            <Empty
                title="No fitness plans yet"
                className="py-12"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {data.map((plan: FitnessPlan) => (
                <PlanCard key={plan.id} plan={plan} />
            ))}
        </div>
    )
}
