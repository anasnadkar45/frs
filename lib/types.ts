export interface WorkoutDay {
    exercises: string[];
}

export type WorkoutPlan = {
    [day: string]: string[];
};

export interface DietItem {
    meal: string;
    calories: number;
    cost: number;
}

export interface DietPlan {
    breakfast: DietItem[];
    lunch: DietItem[];
    dinner: DietItem[];
    snacks: DietItem[];
}

export interface ShoppingItem {
    name: string;
    quantity?: string;
}

export type ShoppingList = ShoppingItem[];

export type Tips = string[];
export type Warnings = string[];

export interface FitnessPlan {
    id: string;

    summary: string;

    bmi: number;
    category: string;
    calories: number;

    budget?: number | null;
    estimatedCost?: number | null;
    mode?: 'budget' | 'student' | 'normal' | null;
    location?: string | null;

    workout: WorkoutPlan;
    diet: DietPlan;

    shoppingList?: ShoppingList;

    tips: Tips;
    warnings: Warnings;

    input?: Record<string, any>;

    createdAt: string;

    userId?: string | null;
}