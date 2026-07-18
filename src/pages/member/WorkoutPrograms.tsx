
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Dumbbell, Clock, Calendar, Users, CheckCircle, Star, Flame } from 'lucide-react';

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  difficultyLevel: string;
  goals: string[];
  durationPerSession: string;
  sessionsPerWeek: number;
  facultyName: string;
  workingHours: string;
  isActive: boolean;
}

interface WorkoutPackage {
  id: string;
  name: string;
  packageType: 'Monthly' | 'Quarterly' | 'Half-Yearly';
  durationDays: number;
  price: number;
  programId: string;
  programName: string;
  features: string[];
  discountPercentage: number;
  isActive: boolean;
  facultyName: string;
  workingHours: string;
}

const samplePrograms: WorkoutProgram[] = [
  {
    id: 'PRG001',
    name: 'Weight Loss Transformation',
    description: 'Intensive HIIT program designed for maximum fat burning and weight loss. Combines cardio bursts with strength training.',
    category: 'HIIT',
    difficultyLevel: 'Intermediate',
    goals: ['Weight Loss', 'Endurance', 'Cardio Fitness'],
    durationPerSession: '45 minutes',
    sessionsPerWeek: 5,
    facultyName: 'Ahmed Al-Rashid',
    workingHours: '6AM-10AM, 5PM-9PM',
    isActive: true,
  },
  {
    id: 'PRG002',
    name: 'Muscle Building Pro',
    description: 'Advanced strength training program for muscle hypertrophy and power. Perfect for those looking to build lean muscle mass.',
    category: 'Strength',
    difficultyLevel: 'Advanced',
    goals: ['Muscle Gain', 'Strength', 'Power'],
    durationPerSession: '60 minutes',
    sessionsPerWeek: 4,
    facultyName: 'Omar Khalil',
    workingHours: '8AM-12PM, 4PM-8PM',
    isActive: true,
  },
  {
    id: 'PRG003',
    name: 'Cardio Blast',
    description: 'High-energy cardio sessions to improve heart health and burn calories. Great for beginners starting their fitness journey.',
    category: 'Cardio',
    difficultyLevel: 'Beginner',
    goals: ['Cardio Fitness', 'Weight Loss', 'Energy Boost'],
    durationPerSession: '30 minutes',
    sessionsPerWeek: 4,
    facultyName: 'Fatima Hassan',
    workingHours: '7AM-11AM, 5PM-8PM',
    isActive: true,
  },
];

const samplePackages: WorkoutPackage[] = [
  {
    id: 'PKG001',
    name: 'Weight Loss - Monthly',
    packageType: 'Monthly',
    durationDays: 30,
    price: 25,
    programId: 'PRG001',
    programName: 'Weight Loss Transformation',
    features: ['Personalized diet plan', 'Weekly check-ins', 'Full gym access'],
    discountPercentage: 0,
    isActive: true,
    facultyName: 'Ahmed Al-Rashid',
    workingHours: '6AM-10AM, 5PM-9PM',
  },
  {
    id: 'PKG002',
    name: 'Weight Loss - Quarterly',
    packageType: 'Quarterly',
    durationDays: 90,
    price: 65,
    programId: 'PRG001',
    programName: 'Weight Loss Transformation',
    features: ['All Monthly features', 'Body composition analysis', 'Nutrition consultation'],
    discountPercentage: 15,
    isActive: true,
    facultyName: 'Ahmed Al-Rashid',
    workingHours: '6AM-10AM, 5PM-9PM',
  },
  {
    id: 'PKG003',
    name: 'Weight Loss - Half-Yearly',
    packageType: 'Half-Yearly',
    durationDays: 180,
    price: 120,
    programId: 'PRG001',
    programName: 'Weight Loss Transformation',
    features: ['All Quarterly features', 'Priority booking', 'Free supplements starter kit'],
    discountPercentage: 20,
    isActive: true,
    facultyName: 'Ahmed Al-Rashid',
    workingHours: '6AM-10AM, 5PM-9PM',
  },
  {
    id: 'PKG004',
    name: 'Muscle Building - Monthly',
    packageType: 'Monthly',
    durationDays: 30,
    price: 30,
    programId: 'PRG002',
    programName: 'Muscle Building Pro',
    features: ['Advanced equipment access', 'Protein shake included', 'Weekly progress photos'],
    discountPercentage: 0,
    isActive: true,
    facultyName: 'Omar Khalil',
    workingHours: '8AM-12PM, 4PM-8PM',
  },
  {
    id: 'PKG005',
    name: 'Muscle Building - Quarterly',
    packageType: 'Quarterly',
    durationDays: 90,
    price: 80,
    programId: 'PRG002',
    programName: 'Muscle Building Pro',
    features: ['All Monthly features', 'Supplement discount', 'Body fat measurement'],
    discountPercentage: 12,
    isActive: true,
    facultyName: 'Omar Khalil',
    workingHours: '8AM-12PM, 4PM-8PM',
  },
  {
    id: 'PKG006',
    name: 'Cardio - Monthly',
    packageType: 'Monthly',
    durationDays: 30,
    price: 20,
    programId: 'PRG003',
    programName: 'Cardio Blast',
    features: ['Group classes included', 'Heart rate monitor', 'Cardio zone access'],
    discountPercentage: 0,
    isActive: true,
    facultyName: 'Fatima Hassan',
    workingHours: '7AM-11AM, 5PM-8PM',
  },
];

const WorkoutPrograms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const filteredPrograms = samplePrograms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory && p.isActive;
  });

  const getPackagesForProgram = (programId: string) => {
    return samplePackages.filter(p => p.programId === programId && p.isActive);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageTypeStyles = (type: string) => {
    switch (type) {
      case 'Monthly': return { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-500' };
      case 'Quarterly': return { bg: 'bg-green-50 border-green-200', badge: 'bg-green-500' };
      case 'Half-Yearly': return { bg: 'bg-purple-50 border-purple-200', badge: 'bg-purple-500' };
      default: return { bg: 'bg-gray-50', badge: 'bg-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/MemberDashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Workout Programs</h1>
            </div>
            <Badge>Member</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredPrograms.map((program) => (
            <Card 
              key={program.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedProgram === program.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      {program.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{program.description}</CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(program.difficultyLevel)}>
                    {program.difficultyLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Program Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{program.durationPerSession}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{program.sessionsPerWeek}x per week</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{program.facultyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Flame className="h-4 w-4" />
                      <span>{program.category}</span>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="flex flex-wrap gap-2">
                    {program.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>

                  {/* Working Hours */}
                  <div className="text-sm text-gray-500">
                    <strong>Available:</strong> {program.workingHours}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Package Comparison for Selected Program */}
        {selectedProgram && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Available Packages for {samplePrograms.find(p => p.id === selectedProgram)?.name}
              </CardTitle>
              <CardDescription>Choose the plan that works best for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getPackagesForProgram(selectedProgram).map((pkg) => {
                  const styles = getPackageTypeStyles(pkg.packageType);
                  const isPopular = pkg.packageType === 'Quarterly';
                  const isBestValue = pkg.packageType === 'Half-Yearly';

                  return (
                    <div 
                      key={pkg.id} 
                      className={`relative rounded-lg border-2 p-6 ${styles.bg} ${isPopular ? 'ring-2 ring-green-500' : ''}`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-500">Most Popular</Badge>
                        </div>
                      )}
                      {isBestValue && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-500">Best Value</Badge>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <Badge className={styles.badge}>{pkg.durationDays} Days</Badge>
                        <h3 className="text-xl font-bold mt-3">{pkg.packageType}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">BHD {pkg.price}</span>
                          {pkg.discountPercentage > 0 && (
                            <Badge variant="outline" className="ml-2 text-green-600">
                              Save {pkg.discountPercentage}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <p><strong>Trainer:</strong> {pkg.facultyName}</p>
                        <p><strong>Hours:</strong> {pkg.workingHours}</p>
                      </div>

                      <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
                        Subscribe Now
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Programs Message */}
        {filteredPrograms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WorkoutPrograms;
