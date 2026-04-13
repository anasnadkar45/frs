"use client"
import { deletePlanAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from './ui/button'

const DeletePlanButton = ({ planId }: { planId: string }) => {

    const router = useRouter()
    const handleDelete = async () => {
        try {
            const res = await deletePlanAction(planId)
            if (res.success) {
                toast.success("Link deleted")
                router.push("/fitness-planner/my-plans")
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("An error occurred while deleting the plan")
        }
    }
    return (
        <div>
            <Button onClick={handleDelete} variant="destructive" className="w-full mt-4">
                Delete Plan
            </Button>
        </div>
    )
}

export default DeletePlanButton