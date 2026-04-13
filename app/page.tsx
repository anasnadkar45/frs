'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Page() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        }
      }
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">🏋️ FitAI</h1>

        <div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-chart-1/70 border border-secondary/30 rounded-full">
            <p className="text-sm font-semibold">✨ Powered by Advanced AI</p>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
            Your <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">AI Fitness</span> Companion
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Get personalized workout plans, budget-friendly diet suggestions, and discover the best gyms near you — all powered by cutting-edge AI technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything You Need to Succeed
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your fitness journey with intelligent recommendations tailored just for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🧠
                </div>
                <h4 className="font-bold text-xl mb-3 text-foreground">
                  AI Workout Plans
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Personalized daily workouts based on your unique goals, fitness level, and available equipment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🥗
                </div>
                <h4 className="font-bold text-xl mb-3 text-foreground">
                  Budget Diet Planner
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Affordable meal plans tailored to your budget, dietary preferences, and nutritional needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  📍
                </div>
                <h4 className="font-bold text-xl mb-3 text-foreground">
                  AI Gym Finder
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Discover the best gyms nearby with smart recommendations based on your preferences and location.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-b border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Transform Your Fitness Journey?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are already achieving their fitness goals with AI-powered guidance.
          </p>
          {!session?.user && (
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                Start Your Journey Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-muted-foreground py-8 px-6 border-t border-border/30">
        <p>Built with ❤️ by your AI fitness team</p>
      </footer>

    </div>
  );
}
