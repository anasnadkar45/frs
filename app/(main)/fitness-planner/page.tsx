'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

export default function CreatePlanPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const [form, setForm] = useState({
    age: '',
    weight: '',
    height: '',
    fitnessLevel: 'beginner',
    goals: '',
    preferences: '',
    activityLevel: 'sedentary',
    dietPreferences: 'veg',
    budget: '',
    location: '',
    mode: 'budget'
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });

      if (!res.ok) throw new Error();
      alert('Plan saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Fitness Planner</h1>
        <Link href="/fitness-planner/my-plans" className={buttonVariants({
          variant: 'default'
        })}>
          My Plans
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">

          <Input placeholder="Age" onChange={(e) => handleChange('age', e.target.value)} />
          <Input placeholder="Weight (kg)" onChange={(e) => handleChange('weight', e.target.value)} />
          <Input placeholder="Height (cm)" onChange={(e) => handleChange('height', e.target.value)} />

          <Select onValueChange={(v) => handleChange('fitnessLevel', v)}>
            <SelectTrigger><SelectValue placeholder="Fitness Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => handleChange('activityLevel', v)}>
            <SelectTrigger><SelectValue placeholder="Activity Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="lightly active">Light</SelectItem>
              <SelectItem value="moderately active">Moderate</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => handleChange('dietPreferences', v)}>
            <SelectTrigger><SelectValue placeholder="Diet" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="veg">Veg</SelectItem>
              <SelectItem value="non-veg">Non-Veg</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Daily Budget ₹" onChange={(e) => handleChange('budget', e.target.value)} />
          <Input placeholder="City (Mumbai, Pune...)" onChange={(e) => handleChange('location', e.target.value)} />

          <Select onValueChange={(v) => handleChange('mode', v)}>
            <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget Mode</SelectItem>
              <SelectItem value="student">Student Mode</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Input className="col-span-2" placeholder="Goal (fat loss, muscle gain)" onChange={(e) => handleChange('goals', e.target.value)} />
          <Input className="col-span-2" placeholder="Food Preferences (eggs, paneer...)" onChange={(e) => handleChange('preferences', e.target.value)} />

          <Button className="col-span-2" onClick={generatePlan}>
            {loading ? 'Generating...' : 'Generate Plan'}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <Card>
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <p>{plan.summary}</p>

            <div className="flex gap-4 text-sm">
              <span>BMI: {plan.metrics?.bmi}</span>
              <span>Calories: {plan.metrics?.dailyCalories}</span>
              <span>Budget: ₹{plan.budgetPlan?.dailyBudget}</span>
            </div>

            <div>
              <h3 className="font-semibold">Diet</h3>
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
                <div key={meal} className="mb-2">
                  <strong className="capitalize">{meal}</strong>
                  {plan.dietPlan?.[meal]?.map((item: any, i: number) => (
                    <div key={i} className="text-sm">
                      {item.meal} - {item.calories} kcal - ₹{item.cost}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold">Workout</h3>
              {Object.entries(plan.workoutPlan || {}).map(([day, exercises]: any) => (
                <div key={day}>
                  <strong>{day}</strong>
                  <ul className="list-disc ml-5">
                    {exercises.map((ex: string, i: number) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Button onClick={savePlan}>
              {saving ? 'Saving...' : 'Save Plan'}
            </Button>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
