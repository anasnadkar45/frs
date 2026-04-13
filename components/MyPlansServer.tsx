import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { MyPlansList } from "@/components/my-plans-list"

async function FetchPlans() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return null
    }

    // Fetch plans from database (adjust query based on your schema)
    const plans = await prisma.fitnessPlan.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return plans
}

export default async function MyPlansServer() {
    const plans = await FetchPlans()

    return (

        <MyPlansList data={plans as any} />
    )
}
