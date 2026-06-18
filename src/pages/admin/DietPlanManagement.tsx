
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Utensils, Flame, Target, Clock, Copy, Users } from 'lucide-react';

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DietPlan {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyCalories: number;
  duration: string;
  goals: string[];
  restrictions: string[];
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal;
  };
  assignedMembers: number;
  trainer: string;
  isActive: boolean;
}

const DietPlanManagement = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);

  // Sample diet plans data
  const [dietPlans] = useState<DietPlan[]>([
    {
      id: '1',
      name: 'Weight Loss Essentials',
      category: 'Weight Loss',
      description: 'A carefully designed calorie-deficit diet plan focusing on high-protein, low-carb meals to promote fat loss while maintaining muscle mass. Ideal for beginners starting their weight loss journey.',
      dailyCalories: 1800,
      duration: '12 weeks',
      goals: ['Lose 5-10 kg', 'Reduce body fat %', 'Build healthy eating habits'],
      restrictions: ['Low Sugar', 'Reduced Carbs'],
      meals: {
        breakfast: { name: 'Protein Omelette with Vegetables', description: '3 egg whites, spinach, tomatoes, bell peppers with whole grain toast', calories: 350, protein: 28, carbs: 25, fats: 12 },
        lunch: { name: 'Grilled Chicken Salad', description: 'Mixed greens, grilled chicken breast, olive oil dressing, quinoa', calories: 550, protein: 45, carbs: 35, fats: 18 },
        dinner: { name: 'Baked Fish with Steamed Vegetables', description: 'Salmon fillet with broccoli, asparagus, and brown rice', calories: 600, protein: 42, carbs: 40, fats: 22 },
        snacks: { name: 'Greek Yogurt & Almonds', description: 'Low-fat Greek yogurt with raw almonds and berries', calories: 300, protein: 20, carbs: 25, fats: 10 }
      },
      assignedMembers: 45,
      trainer: 'Ahmed Al-Rashid',
      isActive: true
    },
    {
      id: '2',
      name: 'Muscle Building Pro',
      category: 'Muscle Gain',
      description: 'High-calorie, protein-rich diet designed for individuals looking to build lean muscle mass. Includes strategic meal timing for optimal muscle recovery and growth.',
      dailyCalories: 3000,
      duration: '16 weeks',
      goals: ['Gain lean muscle', 'Increase strength', 'Improve recovery'],
      restrictions: ['High Protein'],
      meals: {
        breakfast: { name: 'Power Breakfast Bowl', description: 'Oats, banana, whey protein, peanut butter, eggs', calories: 750, protein: 55, carbs: 80, fats: 25 },
        lunch: { name: 'Chicken & Rice Power Plate', description: 'Double chicken breast, brown rice, avocado, sweet potato', calories: 850, protein: 65, carbs: 90, fats: 22 },
        dinner: { name: 'Steak with Complex Carbs', description: 'Lean beef steak, baked potato, green beans, olive oil', calories: 900, protein: 60, carbs: 70, fats: 35 },
        snacks: { name: 'Protein Shakes & Nuts', description: 'Whey shake, mixed nuts, banana, cottage cheese', calories: 500, protein: 45, carbs: 40, fats: 18 }
      },
      assignedMembers: 32,
      trainer: 'Omar Khalil',
      isActive: true
    },
    {
      id: '3',
      name: 'Balanced Wellness',
      category: 'Maintenance',
      description: 'A sustainable, well-rounded nutrition plan for maintaining current weight while ensuring optimal nutrient intake. Perfect for those who have reached their fitness goals.',
      dailyCalories: 2200,
      duration: 'Ongoing',
      goals: ['Maintain weight', 'Boost energy', 'Improve overall health'],
      restrictions: ['Balanced Macros'],
      meals: {
        breakfast: { name: 'Mediterranean Breakfast', description: 'Whole grain bread, hummus, cucumber, tomatoes, olives, feta cheese', calories: 450, protein: 18, carbs: 50, fats: 20 },
        lunch: { name: 'Buddha Bowl', description: 'Quinoa, chickpeas, roasted vegetables, tahini dressing', calories: 600, protein: 25, carbs: 70, fats: 22 },
        dinner: { name: 'Grilled Fish Mediterranean', description: 'Sea bass, roasted potatoes, Greek salad, olive oil', calories: 650, protein: 40, carbs: 50, fats: 28 },
        snacks: { name: 'Fresh Fruits & Nuts', description: 'Seasonal fruits, raw nuts, dark chocolate', calories: 500, protein: 12, carbs: 60, fats: 25 }
      },
      assignedMembers: 28,
      trainer: 'Sara Al-Mahmoud',
      isActive: true
    },
    {
      id: '4',
      name: 'Vegetarian Vitality',
      category: 'Vegetarian',
      description: 'A comprehensive plant-based nutrition plan that provides all essential nutrients without meat. Rich in plant proteins, fiber, and vital micronutrients.',
      dailyCalories: 2000,
      duration: '8 weeks',
      goals: ['Plant-based nutrition', 'Improve digestion', 'Reduce inflammation'],
      restrictions: ['Vegetarian', 'High Fiber'],
      meals: {
        breakfast: { name: 'Smoothie Bowl', description: 'Acai, banana, berries, granola, chia seeds, almond butter', calories: 450, protein: 15, carbs: 65, fats: 18 },
        lunch: { name: 'Lentil Curry with Rice', description: 'Red lentil dal, basmati rice, naan bread, mixed vegetables', calories: 600, protein: 28, carbs: 85, fats: 14 },
        dinner: { name: 'Tofu Stir-Fry', description: 'Crispy tofu, mixed vegetables, brown rice, soy ginger sauce', calories: 550, protein: 30, carbs: 60, fats: 20 },
        snacks: { name: 'Hummus & Veggie Sticks', description: 'Homemade hummus, carrots, celery, whole grain crackers', calories: 400, protein: 15, carbs: 45, fats: 18 }
      },
      assignedMembers: 18,
      trainer: 'Fatima Hassan',
      isActive: true
    }
  ]);

  const getMacroTotal = (plan: DietPlan) => {
    const { breakfast, lunch, dinner, snacks } = plan.meals;
    return {
      protein: breakfast.protein + lunch.protein + dinner.protein + snacks.protein,
      carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs,
      fats: breakfast.fats + lunch.fats + dinner.fats + snacks.fats
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Diet Plan Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Diet Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Diet Plan</DialogTitle>
                    <DialogDescription>
                      Design a comprehensive nutrition plan for members.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planName">Plan Name</Label>
                        <Input id="planName" placeholder="e.g., Weight Loss Essentials" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" placeholder="Weight Loss, Muscle Gain, etc." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Detailed description of the diet plan..." rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="calories">Daily Calories Target</Label>
                        <Input id="calories" type="number" placeholder="2000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" placeholder="12 weeks" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goals">Goals (comma-separated)</Label>
                      <Input id="goals" placeholder="Lose weight, Build muscle, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restrictions">Dietary Restrictions (comma-separated)</Label>
                      <Input id="restrictions" placeholder="Vegetarian, Gluten-free, etc." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Create Plan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{dietPlans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Members on Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{dietPlans.reduce((sum, p) => sum + p.assignedMembers, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-500 text-white mr-4">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Calories</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(dietPlans.reduce((sum, p) => sum + p.dailyCalories, 0) / dietPlans.length)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{dietPlans.filter(p => p.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diet Plans Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>Create and manage nutrition programs for members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dietPlans.map((plan) => {
                const macros = getMacroTotal(plan);
                return (
                  <Card key={plan.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="mb-2">{plan.category}</Badge>
                          <p className="text-sm text-gray-500">By {plan.trainer}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>

                      {/* Macros Summary */}
                      <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Calories</p>
                          <p className="font-bold text-orange-600">{plan.dailyCalories}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="font-bold text-red-600">{macros.protein}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Carbs</p>
                          <p className="font-bold text-blue-600">{macros.carbs}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Fats</p>
                          <p className="font-bold text-yellow-600">{macros.fats}g</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {plan.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {plan.assignedMembers} members
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Goals:</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.goals.map((goal, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{goal}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Dietary Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.restrictions.map((restriction, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{restriction}</Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        View Full Plan
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plan Detail Dialog */}
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedPlan.name}
                    <Badge>{selectedPlan.category}</Badge>
                  </DialogTitle>
                  <DialogDescription>{selectedPlan.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <h4 className="font-semibold mb-4">Daily Meal Plan</h4>
                  <div className="space-y-4">
                    {Object.entries(selectedPlan.meals).map(([mealType, meal]) => (
                      <Card key={mealType}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium capitalize text-blue-600">{mealType}</h5>
                              <p className="font-semibold">{meal.name}</p>
                              <p className="text-sm text-gray-600">{meal.description}</p>
                            </div>
                            <div className="text-right text-sm">
                              <p className="font-bold text-orange-600">{meal.calories} cal</p>
                              <p className="text-gray-500">P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DietPlanManagement;
