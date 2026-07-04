
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, Flame, Clock, Target, CheckCircle2, Apple, Coffee, Sun, Moon } from 'lucide-react';

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface DietPlan {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyCalories: number;
  duration: string;
  weeksCompleted: number;
  totalWeeks: number;
  goals: string[];
  restrictions: string[];
  trainer: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal;
  };
}

const DietPlans = () => {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<{ type: string; meal: Meal } | null>(null);

  // Member's assigned diet plan
  const assignedPlan: DietPlan = {
    id: '1',
    name: 'Weight Loss Essentials',
    category: 'Weight Loss',
    description: 'A carefully designed calorie-deficit diet plan focusing on high-protein, low-carb meals to promote fat loss while maintaining muscle mass. This plan includes balanced macronutrients and nutrient-dense foods to keep you energized throughout the day.',
    dailyCalories: 1800,
    duration: '12 weeks',
    weeksCompleted: 4,
    totalWeeks: 12,
    goals: ['Lose 5-10 kg', 'Reduce body fat %', 'Build healthy eating habits', 'Improve energy levels'],
    restrictions: ['Low Sugar', 'Reduced Carbs', 'High Protein'],
    trainer: 'Ahmed Al-Rashid',
    meals: {
      breakfast: {
        name: 'Protein Omelette with Vegetables',
        description: '3 egg whites with 1 whole egg, sautéed spinach, cherry tomatoes, and bell peppers. Served with one slice of whole grain toast and a side of fresh avocado.',
        calories: 350,
        protein: 28,
        carbs: 25,
        fats: 12,
        time: '7:00 AM'
      },
      lunch: {
        name: 'Grilled Chicken Salad',
        description: 'Fresh mixed greens with grilled chicken breast (150g), cherry tomatoes, cucumber, red onion, and quinoa. Dressed with extra virgin olive oil and lemon vinaigrette.',
        calories: 550,
        protein: 45,
        carbs: 35,
        fats: 18,
        time: '12:30 PM'
      },
      dinner: {
        name: 'Baked Salmon with Steamed Vegetables',
        description: 'Herb-crusted baked salmon fillet (180g) with steamed broccoli, asparagus, and a portion of brown rice. Garnished with fresh lemon and dill.',
        calories: 600,
        protein: 42,
        carbs: 40,
        fats: 22,
        time: '7:00 PM'
      },
      snacks: {
        name: 'Greek Yogurt & Almonds',
        description: 'Low-fat Greek yogurt (200g) topped with raw almonds (15-20 pieces) and fresh mixed berries (blueberries, strawberries). A perfect protein-rich snack for mid-morning or afternoon.',
        calories: 300,
        protein: 20,
        carbs: 25,
        fats: 10,
        time: '3:30 PM'
      }
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'dinner': return Moon;
      case 'snacks': return Apple;
      default: return Utensils;
    }
  };

  const getMacroTotal = () => {
    const { breakfast, lunch, dinner, snacks } = assignedPlan.meals;
    return {
      protein: breakfast.protein + lunch.protein + dinner.protein + snacks.protein,
      carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs,
      fats: breakfast.fats + lunch.fats + dinner.fats + snacks.fats
    };
  };

  const macros = getMacroTotal();
  const progressPercentage = (assignedPlan.weeksCompleted / assignedPlan.totalWeeks) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/Member')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">My Diet Plan</h1>
            </div>
            <Badge variant="secondary">Member</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Overview Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Badge className="bg-white/20 text-white mb-2">{assignedPlan.category}</Badge>
                <h2 className="text-2xl font-bold mb-2">{assignedPlan.name}</h2>
                <p className="text-green-100 mb-2">Assigned by: {assignedPlan.trainer}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold">{assignedPlan.dailyCalories}</div>
                <div className="text-green-200">calories/day</div>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-6">{assignedPlan.description}</p>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Plan Progress</span>
                <span className="text-sm text-gray-500">
                  Week {assignedPlan.weeksCompleted} of {assignedPlan.totalWeeks}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Goals */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Goals:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {assignedPlan.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Dietary Focus:</h3>
              <div className="flex flex-wrap gap-2">
                {assignedPlan.restrictions.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Macros Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Daily Nutrition Summary
            </CardTitle>
            <CardDescription>Your daily macro breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{assignedPlan.dailyCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{macros.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{macros.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{macros.fats}g</div>
                <div className="text-sm text-gray-600">Fats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Meal Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-purple-600" />
              Today's Meal Plan
            </CardTitle>
            <CardDescription>Your complete daily meal schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(assignedPlan.meals).map(([mealType, meal]) => {
                const MealIcon = getMealIcon(mealType);
                return (
                  <Card 
                    key={mealType} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedMeal({ type: mealType, meal })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <MealIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-purple-600 capitalize">{mealType}</span>
                              <Badge variant="outline" className="text-xs">{meal.time}</Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{meal.description}</p>
                          </div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="font-bold text-orange-600">{meal.calories} cal</div>
                          <div className="text-xs text-gray-500">
                            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Meal Detail Dialog */}
        <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
          <DialogContent className="max-w-lg">
            {selectedMeal && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">{selectedMeal.type}</Badge>
                    <Badge variant="secondary">{selectedMeal.meal.time}</Badge>
                  </div>
                  <DialogTitle>{selectedMeal.meal.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-600 mb-6">{selectedMeal.meal.description}</p>
                  
                  <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{selectedMeal.meal.calories}</div>
                      <div className="text-xs text-gray-500">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{selectedMeal.meal.protein}g</div>
                      <div className="text-xs text-gray-500">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{selectedMeal.meal.carbs}g</div>
                      <div className="text-xs text-gray-500">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{selectedMeal.meal.fats}g</div>
                      <div className="text-xs text-gray-500">Fats</div>
                    </div>
                  </div>

                  <Button className="w-full mt-6">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DietPlans;
