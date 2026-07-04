
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Search, Dumbbell, Package, Users, Clock, Edit, Trash2, Eye, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { BASE_URL } from '../ApiConfig';
import AgGridTable from "@/components/ui/ag-grid-table";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  difficultyLevel: string;
  goals: string[];
  exercises: Exercise[];
  durationPerSession: string;
  sessionsPerWeek: number;
  assignedFaculty: string;
  facultyName: string;
  workingHours: string;
  isActive: boolean;
  createdDate: string;
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
  facultyId: string;
  facultyName: string;
  workingHours: string;
}

// Sample Faculty Data
const sampleFaculty = [
  { id: 'FAC001', name: 'Ahmed Al-Rashid' },
  { id: 'FAC002', name: 'Omar Khalil' },
  { id: 'FAC003', name: 'Fatima Hassan' },
  { id: 'FAC004', name: 'Mohammed Ali' },
];

// Sample Programs Data
const samplePrograms: WorkoutProgram[] = [
  {
    id: 'PRG001',
    name: 'Weight Loss Transformation',
    description: 'Intensive HIIT program designed for maximum fat burning and weight loss',
    category: 'HIIT',
    difficultyLevel: 'Intermediate',
    goals: ['Weight Loss', 'Endurance', 'Cardio Fitness'],
    exercises: [
      { name: 'Burpees', sets: 4, reps: '15' },
      { name: 'Mountain Climbers', sets: 4, reps: '30 sec' },
      { name: 'Jump Squats', sets: 4, reps: '20' },
    ],
    durationPerSession: '45 minutes',
    sessionsPerWeek: 5,
    assignedFaculty: 'FAC001',
    facultyName: 'Ahmed Al-Rashid',
    workingHours: '6AM-10AM, 5PM-9PM',
    isActive: true,
    createdDate: '2024-01-15',
  },
  {
    id: 'PRG002',
    name: 'Muscle Building Pro',
    description: 'Advanced strength training program for muscle hypertrophy and power',
    category: 'Strength',
    difficultyLevel: 'Advanced',
    goals: ['Muscle Gain', 'Strength', 'Power'],
    exercises: [
      { name: 'Bench Press', sets: 5, reps: '8-10' },
      { name: 'Deadlift', sets: 5, reps: '6-8' },
      { name: 'Squats', sets: 5, reps: '8-10' },
    ],
    durationPerSession: '60 minutes',
    sessionsPerWeek: 4,
    assignedFaculty: 'FAC002',
    facultyName: 'Omar Khalil',
    workingHours: '8AM-12PM, 4PM-8PM',
    isActive: true,
    createdDate: '2024-02-01',
  },
  {
    id: 'PRG003',
    name: 'Yoga & Flexibility',
    description: 'Relaxing yoga sessions for flexibility, balance, and mental wellness',
    category: 'Yoga',
    difficultyLevel: 'Beginner',
    goals: ['Flexibility', 'Balance', 'Stress Relief'],
    exercises: [
      { name: 'Sun Salutation', sets: 1, reps: '10 rounds' },
      { name: 'Warrior Poses', sets: 1, reps: '5 min each' },
      { name: 'Stretching Flow', sets: 1, reps: '15 min' },
    ],
    durationPerSession: '60 minutes',
    sessionsPerWeek: 3,
    assignedFaculty: 'FAC003',
    facultyName: 'Fatima Hassan',
    workingHours: '7AM-9AM, 6PM-8PM',
    isActive: false,
    createdDate: '2024-01-20',
  },
];

// Sample Packages Data
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
    facultyId: 'FAC001',
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
    facultyId: 'FAC001',
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
    facultyId: 'FAC001',
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
    facultyId: 'FAC002',
    facultyName: 'Omar Khalil',
    workingHours: '8AM-12PM, 4PM-8PM',
  },
];

const WorkoutProgramManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState<WorkoutProgram[]>(samplePrograms);
  const [packages, setPackages] = useState<WorkoutPackage[]>(samplePackages);
  const [category, setCategory] = useState<any[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCategory(data);
      } else {
        console.error("Failed to fetch categories");
      }

    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDifficultyLevel = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDifficultyLevel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDifficultyLevel(data);
      } else {
        console.error("Failed to fetch difficulty levels");
      }

    } catch (error) {
      console.error("Error fetching difficulty levels:", error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getTrainers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
          Location_Code: "LOC001",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTrainers(data);
      } else {
        console.error("Failed to fetch trainers");
      }

    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCategory(),
        fetchDifficultyLevel(),
        fetchTrainers()
      ]);
    };

    loadData();
  }, []);

  // Program Dialog States
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    category: '',
    difficultyLevel: '',
    durationPerSession: '',
    sessionsPerWeek: 3,
    assignedFaculty: '',
    workingHours: '',
    isActive: true,
    goals: '',
    exercises: [{ name: '', sets: 3, reps: '' }],
  });

  // Package Dialog States
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<WorkoutPackage | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    packageType: 'Monthly' as 'Monthly' | 'Quarterly' | 'Half-Yearly',
    price: 0,
    programId: '',
    facultyId: '',
    workingHours: '',
    discountPercentage: 0,
    isActive: true,
    features: '',
  });

  // const stats = [
  //   { title: 'Total Programs', value: programs.length.toString(), icon: Dumbbell, color: 'bg-purple-500' },
  //   { title: 'Active Programs', value: programs.filter(p => p.isActive).length.toString(), icon: CheckCircle, color: 'bg-green-500' },
  //   { title: 'Total Packages', value: packages.length.toString(), icon: Package, color: 'bg-purple-500' },
  //   { title: 'Active Packages', value: packages.filter(p => p.isActive).length.toString(), icon: Calendar, color: 'bg-orange-500' },
  // ];

  const getDurationDays = (type: string): number => {
    switch (type) {
      case 'Monthly': return 30;
      case 'Quarterly': return 90;
      case 'Half-Yearly': return 180;
      default: return 30;
    }
  };

  const getPackageTypeBadge = (type: string, discount: number) => {
    switch (type) {
      case 'Monthly':
        return <Badge className="bg-purple-500">30 Days</Badge>;
      case 'Quarterly':
        return (
          <div className="flex gap-1">
            <Badge className="bg-green-500">90 Days</Badge>
            {discount > 0 && <Badge variant="outline" className="text-green-600">Save {discount}%</Badge>}
          </div>
        );
      case 'Half-Yearly':
        return (
          <div className="flex gap-1">
            <Badge className="bg-purple-500">180 Days</Badge>
            {discount > 0 && <Badge variant="outline" className="text-purple-600">Best Value - Save {discount}%</Badge>}
          </div>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Program CRUD Functions
  const handleAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      name: '',
      description: '',
      category: '',
      difficultyLevel: '',
      durationPerSession: '',
      sessionsPerWeek: 3,
      assignedFaculty: '',
      workingHours: '',
      isActive: true,
      goals: '',
      exercises: [{ name: '', sets: 3, reps: '' }],
    });
    setIsProgramDialogOpen(true);
  };

  const handleEditProgram = (program: WorkoutProgram) => {
    setEditingProgram(program);
    setProgramForm({
      name: program.name,
      description: program.description,
      category: program.category,
      difficultyLevel: program.difficultyLevel,
      durationPerSession: program.durationPerSession,
      sessionsPerWeek: program.sessionsPerWeek,
      assignedFaculty: program.assignedFaculty,
      workingHours: program.workingHours,
      isActive: program.isActive,
      goals: program.goals.join(', '),
      exercises: program.exercises.length > 0 ? program.exercises : [{ name: '', sets: 3, reps: '' }],
    });
    setIsProgramDialogOpen(true);
  };

  const handleSaveProgram = () => {
    const faculty = sampleFaculty.find(f => f.id === programForm.assignedFaculty);

    if (editingProgram) {
      setPrograms(programs.map(p =>
        p.id === editingProgram.id
          ? {
            ...p,
            ...programForm,
            goals: programForm.goals.split(',').map(g => g.trim()).filter(Boolean),
            facultyName: faculty?.name || '',
          }
          : p
      ));
      toast({ title: "Program Updated", description: "Workout program has been updated successfully." });
    } else {
      const newProgram: WorkoutProgram = {
        id: `PRG${String(programs.length + 1).padStart(3, '0')}`,
        name: programForm.name,
        description: programForm.description,
        category: programForm.category,
        difficultyLevel: programForm.difficultyLevel,
        goals: programForm.goals.split(',').map(g => g.trim()).filter(Boolean),
        exercises: programForm.exercises.filter(e => e.name),
        durationPerSession: programForm.durationPerSession,
        sessionsPerWeek: programForm.sessionsPerWeek,
        assignedFaculty: programForm.assignedFaculty,
        facultyName: faculty?.name || '',
        workingHours: programForm.workingHours,
        isActive: programForm.isActive,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setPrograms([...programs, newProgram]);
      toast({ title: "Program Added", description: "New workout program has been created successfully." });
    }
    setIsProgramDialogOpen(false);
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
    toast({ title: "Program Deleted", description: "Workout program has been removed.", variant: "destructive" });
  };

  // Package CRUD Functions
  const handleAddPackage = () => {
    setEditingPackage(null);
    setPackageForm({
      name: '',
      packageType: 'Monthly',
      price: 0,
      programId: '',
      facultyId: '',
      workingHours: '',
      discountPercentage: 0,
      isActive: true,
      features: '',
    });
    setIsPackageDialogOpen(true);
  };

  const handleEditPackage = (pkg: WorkoutPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      packageType: pkg.packageType,
      price: pkg.price,
      programId: pkg.programId,
      facultyId: pkg.facultyId,
      workingHours: pkg.workingHours,
      discountPercentage: pkg.discountPercentage,
      isActive: pkg.isActive,
      features: pkg.features.join(', '),
    });
    setIsPackageDialogOpen(true);
  };

  const handleSavePackage = () => {
    const program = programs.find(p => p.id === packageForm.programId);
    const faculty = sampleFaculty.find(f => f.id === packageForm.facultyId);

    if (editingPackage) {
      setPackages(packages.map(p =>
        p.id === editingPackage.id
          ? {
            ...p,
            ...packageForm,
            durationDays: getDurationDays(packageForm.packageType),
            programName: program?.name || '',
            facultyName: faculty?.name || '',
            features: packageForm.features.split(',').map(f => f.trim()).filter(Boolean),
          }
          : p
      ));
      toast({ title: "Package Updated", description: "Workout package has been updated successfully." });
    } else {
      const newPackage: WorkoutPackage = {
        id: `PKG${String(packages.length + 1).padStart(3, '0')}`,
        name: packageForm.name,
        packageType: packageForm.packageType,
        durationDays: getDurationDays(packageForm.packageType),
        price: packageForm.price,
        programId: packageForm.programId,
        programName: program?.name || '',
        features: packageForm.features.split(',').map(f => f.trim()).filter(Boolean),
        discountPercentage: packageForm.discountPercentage,
        isActive: packageForm.isActive,
        facultyId: packageForm.facultyId,
        facultyName: faculty?.name || '',
        workingHours: packageForm.workingHours,
      };
      setPackages([...packages, newPackage]);
      toast({ title: "Package Added", description: "New workout package has been created successfully." });
    }
    setIsPackageDialogOpen(false);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    toast({ title: "Package Deleted", description: "Workout package has been removed.", variant: "destructive" });
  };

  const addExerciseField = () => {
    setProgramForm({
      ...programForm,
      exercises: [...programForm.exercises, { name: '', sets: 3, reps: '' }],
    });
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newExercises = [...programForm.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setProgramForm({ ...programForm, exercises: newExercises });
  };

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPackages = packages.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Workout Programs Management</h1>
            </div>
            <Badge variant="secondary">Admin</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color} text-white mr-4`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Search and Add */}
        {/* <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs, packages, or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Tabs for Programs and Packages */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="programs" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Programs
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Packages
              </TabsTrigger>
            </TabsList>
            <Button onClick={activeTab === 'programs' ? handleAddProgram : handleAddPackage}>
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'programs' ? 'Program' : 'Package'}
            </Button>
          </div>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Workout Programs</CardTitle>
                <CardDescription>Manage all workout programs and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Sessions/Week</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Working Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{program.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            program.difficultyLevel === 'Beginner' ? 'secondary' :
                              program.difficultyLevel === 'Intermediate' ? 'default' : 'destructive'
                          }>
                            {program.difficultyLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.facultyName}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProgram(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Workout Packages</CardTitle>
                <CardDescription>Manage pricing packages (Monthly, Quarterly, Half-Yearly)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price (BHD)</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>{getPackageTypeBadge(pkg.packageType, pkg.discountPercentage)}</TableCell>
                        <TableCell>{pkg.durationDays} days</TableCell>
                        <TableCell className="font-semibold">BHD {pkg.price}</TableCell>
                        <TableCell>{pkg.programName}</TableCell>
                        <TableCell>{pkg.facultyName}</TableCell>
                        <TableCell>
                          {pkg.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPackage(pkg)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Program Dialog */}
        <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProgram ? 'Edit Program' : 'Add New Program'}</DialogTitle>
              <DialogDescription>
                {editingProgram ? 'Update the workout program details' : 'Create a new workout program'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Program Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Program Name</Label>
                    <Input
                      id="name"
                      value={programForm.name}
                      onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={programForm.category} onValueChange={(value) => setProgramForm({ ...programForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.map((category: any) => (
                          <SelectItem
                            key={category.attributedetails_name}
                            value={category.attributedetails_name}
                          >
                            {category.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={programForm.difficultyLevel} onValueChange={(value) => setProgramForm({ ...programForm, difficultyLevel: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevel.map((difficultyLevel: any) => (
                          <SelectItem
                            key={difficultyLevel.attributedetails_name}
                            value={difficultyLevel.attributedetails_name}
                          >
                            {difficultyLevel.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goals">Goals (comma-separated)</Label>
                    <Input
                      id="goals"
                      value={programForm.goals}
                      onChange={(e) => setProgramForm({ ...programForm, goals: e.target.value })}
                      placeholder="e.g., Weight Loss, Endurance"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={programForm.description}
                    onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                    placeholder="Describe the program..."
                  />
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Schedule</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration Per Session</Label>
                    <Input
                      id="duration"
                      value={programForm.durationPerSession}
                      onChange={(e) => setProgramForm({ ...programForm, durationPerSession: e.target.value })}
                      placeholder="e.g., 45 minutes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessions">Sessions Per Week</Label>
                    <Input
                      id="sessions"
                      type="number"
                      min={1}
                      max={7}
                      value={programForm.sessionsPerWeek}
                      onChange={(e) => setProgramForm({ ...programForm, sessionsPerWeek: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      value={programForm.workingHours}
                      onChange={(e) => setProgramForm({ ...programForm, workingHours: e.target.value })}
                      placeholder="e.g., 6AM-10AM, 5PM-9PM"
                    />
                  </div>
                </div>
              </div>

              {/* Faculty Assignment */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Faculty Assignment</h4>
                <div className="space-y-2">
                  <Label htmlFor="faculty">Assigned Faculty</Label>
                  <Select value={programForm.assignedFaculty} onValueChange={(value) => setProgramForm({ ...programForm, assignedFaculty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainers: any) => (
                        <SelectItem
                          key={trainers.TrainerID}
                          value={trainers.TrainerID}
                        >
                          {trainers.TrainerID} - {trainers.FullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm text-gray-700">Exercises</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addExerciseField}>
                    <Plus className="h-4 w-4 mr-1" /> Add Exercise
                  </Button>
                </div>
                {programForm.exercises.map((exercise, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      placeholder="Reps (e.g., 10-12)"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={programForm.isActive}
                  onCheckedChange={(checked) => setProgramForm({ ...programForm, isActive: checked })}
                />
                <Label htmlFor="isActive">Active Program</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProgramDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingProgram ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Package Dialog */}
        <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
              <DialogDescription>
                {editingPackage ? 'Update the package details' : 'Create a new workout package'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pkgName">Package Name</Label>
                <Input
                  id="pkgName"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  placeholder="e.g., Weight Loss - Monthly"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pkgType">Package Type</Label>
                  <Select value={packageForm.packageType} onValueChange={(value: 'Monthly' | 'Quarterly' | 'Half-Yearly') => setPackageForm({ ...packageForm, packageType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly (30 days)</SelectItem>
                      <SelectItem value="Quarterly">Quarterly (90 days)</SelectItem>
                      <SelectItem value="Half-Yearly">Half-Yearly (180 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (BHD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program">Associated Program</Label>
                  <Select value={packageForm.programId} onValueChange={(value) => setPackageForm({ ...packageForm, programId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pkgFaculty">Assigned Faculty</Label>
                  <Select value={packageForm.facultyId} onValueChange={(value) => setPackageForm({ ...packageForm, facultyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleFaculty.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pkgHours">Working Hours</Label>
                  <Input
                    id="pkgHours"
                    value={packageForm.workingHours}
                    onChange={(e) => setPackageForm({ ...packageForm, workingHours: e.target.value })}
                    placeholder="e.g., 6AM-10AM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount %</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    max={100}
                    value={packageForm.discountPercentage}
                    onChange={(e) => setPackageForm({ ...packageForm, discountPercentage: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={packageForm.features}
                  onChange={(e) => setPackageForm({ ...packageForm, features: e.target.value })}
                  placeholder="e.g., Personalized diet plan, Weekly check-ins, Full gym access"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pkgActive"
                  checked={packageForm.isActive}
                  onCheckedChange={(checked) => setPackageForm({ ...packageForm, isActive: checked })}
                />
                <Label htmlFor="pkgActive">Active Package</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSavePackage}>{editingPackage ? 'Update' : 'Create'} Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default WorkoutProgramManagement;
