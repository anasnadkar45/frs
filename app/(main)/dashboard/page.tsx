'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Barbell, MapPin, Plus, Calendar, SignOut, BarbellIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingWorkout, setLoadingWorkout] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await fetch("/api/user-stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/streak-data");
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const generateCalendar = () => {
    const today = new Date();

    // Start from 1st day of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // End of month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const days = [];

    // Get first day index (0 = Sun)
    const startDay = startOfMonth.getDay();

    // Fill empty slots before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Fill actual days
    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), d);

      const completed = logs.some(
        (log) => new Date(log.date).toDateString() === date.toDateString()
      );

      days.push({
        date,
        completed,
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const fetchData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* AI Fitness Planner */}
          <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Barbell className="w-5 h-5" weight="fill" />
                AI Fitness Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Create personalized plans based on your goals and budget.
              </p>
              <Link href="/fitness-planner">
                <Button size="sm" className="w-full hover:cursor-pointer">
                  Create Plan
                </Button>
              </Link>
            </CardContent>
          </Card>



          {/* AI Gym Finder */}
          <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-5 h-5" weight="fill" />
                AI Gym Finder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Find the best gyms near you.
              </p>
              <Link href="/find-gym">
                <Button size="sm" variant="outline" className="w-full cursor-pointer">
                  Find Gyms
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarbellIcon className="w-5 h-5" weight="fill" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                View and manage your profile.
              </p>
              <Link href="/profile">
                <Button size="sm" variant="outline" className="w-full cursor-pointer">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔥 Your Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {stats ? (
              <>
                <div className="flex justify-between text-sm">
                  <span>Streak</span>
                  <span className="font-bold">{stats.streak} days</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>XP</span>
                  <span className="font-bold">{stats.xp}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Level</span>
                  <span className="font-bold">{stats.level}</span>
                </div>

                <Button
                  className="w-full"
                  disabled={loadingWorkout}
                  onClick={async () => {
                    setLoadingWorkout(true);

                    try {
                      const res = await fetch("/api/complete-workout", {
                        method: "POST",
                      });

                      const data = await res.json();

                      if (data.success) {
                        fetchStats();
                        fetchLogs();
                      } else {
                        toast.error(data.error);
                      }
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setLoadingWorkout(false);
                    }
                  }}
                >
                  {loadingWorkout ? "Saving..." : "Complete Workout"}
                </Button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </CardContent>
        </Card>

        <p className="text-sm font-medium mb-2">
          {stats?.streak} day streak 🔥
        </p>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📅 Activity </CardTitle>
            <h2 className="text-sm font-semibold mb-2">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
          </CardHeader>

          <CardContent>
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2 text-center">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar */}
            <div className="space-y-2">
              {weeks.map((week, i) => (
                <div key={i} className="grid grid-cols-7 gap-2">
                  {week.map((day: any, j: number) => {
                    if (!day) {
                      return <div key={j} />;
                    }

                    const isToday =
                      new Date().toDateString() === day.date.toDateString();

                    return (
                      <div
                        key={j}
                        title={day.date.toDateString()}
                        className={`w-10 h-10 mx-auto rounded-md flex items-center justify-center text-sm transition-all
                  ${day.completed
                            ? "bg-green-200 "
                            : "bg-muted border"
                          }
                  ${isToday ? "ring-2 ring-green-500" : ""}
                `}
                      >
                        {day.date.getDate()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Don’t break the chain 🔥
            </p>
          </CardContent>
        </Card>

        {/* Recent Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Plans</h2>
            <Button size="sm">
              <Link href="/fitness-planner" className="flex items-center gap-1">
                <Plus className="w-4 h-4" weight="bold" />
                New
              </Link>
            </Button>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </Card>
          ) : plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{plan.summary}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.category} • {plan.bmi.toFixed(1)} BMI
                        </p>
                      </div>
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Calories</span>
                      <span className="font-medium text-foreground">{plan.calories}</span>
                    </div>
                    {plan.budget && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium text-foreground">₹{plan.budget}</span>
                      </div>
                    )}
                    {plan.location && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-foreground">{plan.location}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Link href={`/fitness-planner/my-plans/${plan.id}`}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Barbell className="w-8 h-8 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No plans yet</p>
                <Button size="sm" className="mt-3">
                  <Link href="/fitness-planner">Create Your First Plan</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
