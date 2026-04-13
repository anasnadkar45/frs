"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function LoginCard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { data: session } = authClient.useSession()

  if (session?.user) {
    router.push("/dashboard")
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
      })
      toast.success("Successfully signed in!")
      router.refresh()
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "Sign in failed"

      toast.error("Sign in failed", {
        description: errorMessage,
      })
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="squircle squircle-secondary squircle-4xl w-full max-w-md overflow-hidden squircle-border squircle-border-border p-2">
          <div className="p-8 squircle squircle-card squircle-4xl squircle-border squircle-border-border">
            <div className="mb-8 text-center">
              <h1 className={cn("mb-2 text-3xl font-bold")}>
                Welcome to Stufff
              </h1>
              <p className="text-muted-foreground">
                Create your space and share your links
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="h-12 w-full text-base"
              size="lg"
            >
              
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <div className="hidden h-full items-center justify-center lg:flex">
        <div
          className="squircle squircle-4xl h-full w-full"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
              radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
              radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
              radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
              linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
            `,
          }}
        />
      </div>
    </div>
  )
}