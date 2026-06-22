
import React, { useState } from 'react';
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
import ImageUpload from "../ImageUpload";

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

// Sample Companies Data
const sampleCompanies: WorkoutProgram[] = [
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
const sampleCompanyMapping: WorkoutProgram[] = [
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

const WorkoutProgramManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<WorkoutProgram[]>(sampleCompanies);
  const [companyMapping, setCompanyMapping] = useState<WorkoutProgram[]>(sampleCompanyMapping);

  // Company Dialog States
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isCompanyMappingDialogOpen, setIsCompanyMappingDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isRoleMappingDialogOpen, setIsRoleMappingDialogOpen] = useState(false);
  const [isRoleRightsDialogOpen, setIsRoleRightsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  const [editingCompany, setEditingCompany] = useState<WorkoutProgram | null>(null);
  const [companyForm, setCompanyForm] = useState({
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

  // Company Mapping Dialog States
  const [editingCompanyMapping, setEditingCompanyMapping] = useState<WorkoutPackage | null>(null);
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

  // Program CRUD Functions
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyForm({
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
    setIsCompanyDialogOpen(true);
  };

  const handleEditCompany = (program: WorkoutProgram) => {
    setEditingCompany(program);
    setCompanyForm({
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
    setIsCompanyDialogOpen(true);
  };

  const handleSaveProgram = () => {
    const faculty = sampleFaculty.find(f => f.id === companyForm.assignedFaculty);

    if (editingCompany) {
      setCompanies(companies.map(p =>
        p.id === editingCompany.id
          ? {
            ...p,
            ...companyForm,
            goals: companyForm.goals.split(',').map(g => g.trim()).filter(Boolean),
            facultyName: faculty?.name || '',
          }
          : p
      ));
      toast({ title: "Program Updated", description: "Workout program has been updated successfully." });
    } else {
      const newCompany: WorkoutProgram = {
        id: `PRG${String(companies.length + 1).padStart(3, '0')}`,
        name: companyForm.name,
        description: companyForm.description,
        category: companyForm.category,
        difficultyLevel: companyForm.difficultyLevel,
        goals: companyForm.goals.split(',').map(g => g.trim()).filter(Boolean),
        exercises: companyForm.exercises.filter(e => e.name),
        durationPerSession: companyForm.durationPerSession,
        sessionsPerWeek: companyForm.sessionsPerWeek,
        assignedFaculty: companyForm.assignedFaculty,
        facultyName: faculty?.name || '',
        workingHours: companyForm.workingHours,
        isActive: companyForm.isActive,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setCompanies([...companies, newCompany]);
      toast({ title: "Program Added", description: "New workout program has been created successfully." });
    }
    setIsCompanyDialogOpen(false);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter(p => p.id !== id));
    toast({ title: "Program Deleted", description: "Workout program has been removed.", variant: "destructive" });
  };

  //company Mapping CRUD Functions
  const handleAddCompanyMapping = () => {
    setEditingCompanyMapping(null);
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
    setIsCompanyMappingDialogOpen(true);
  };

  const handleAddLocation = () => {
    setEditingCompanyMapping(null);
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
    setIsLocationDialogOpen(true);
  };

  const handleAddRole = () => {
    setEditingCompanyMapping(null);
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
    setIsRoleDialogOpen(true);
  };

  const handleAddRoleMapping = () => {
    setEditingCompanyMapping(null);
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
    setIsRoleMappingDialogOpen(true);
  };

  const handleAddRoleRights = () => {
    setEditingCompanyMapping(null);
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
    setIsRoleRightsDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingCompanyMapping(null);
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
    setIsUserDialogOpen(true);
  };

  const handleAddAttribute = () => {
    setEditingCompanyMapping(null);
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
    setIsAttributeDialogOpen(true);
  };

  const addExerciseField = () => {
    setCompanyForm({
      ...companyForm,
      exercises: [...companyForm.exercises, { name: '', sets: 3, reps: '' }],
    });
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newExercises = [...companyForm.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setCompanyForm({ ...companyForm, exercises: newExercises });
  };

  const filteredCompanies = companies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addLabels = {
    company: "Company",
    companyMapping: "Company Mapping",
    location: "Location",
    role: "Role",
    roleMapping: "Role Mapping",
    roleRights: "Role Rights",
    user: "User",
    attribute: "Attribute",
  };

  const handleAdd = () => {
    switch (activeTab) {
      case "company":
        handleAddCompany();
        break;
      case "companyMapping":
        handleAddCompanyMapping();
        break;
      case "location":
        handleAddLocation();
        break;
      case "role":
        handleAddRole();
        break;
      case "roleMapping":
        handleAddRoleMapping();
        break;
      case "roleRights":
        handleAddRoleRights();
        break;
      case "user":
        handleAddUser();
        break;
      case "attribute":
        handleAddAttribute();
        break;
      default:
        break;
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Management</h1>
            </div>
            <Badge variant="secondary">Admin</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Add */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies, packages, or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for companies and Packages */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="companyMapping" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Company Mapping
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Location
              </TabsTrigger>
              <TabsTrigger value="role" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Role
              </TabsTrigger>
              <TabsTrigger value="roleMapping" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Role Mapping
              </TabsTrigger>
              <TabsTrigger value="roleRights" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Role Rights
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                User
              </TabsTrigger>
              <TabsTrigger value="attribute" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Attribute
              </TabsTrigger>
            </TabsList>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add {addLabels[activeTab]}
            </Button>
          </div>

          {/* Company Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
                <CardDescription>Manage all companies and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Short Name</TableHead>
                      <TableHead>Address 1</TableHead>
                      <TableHead>Address 2</TableHead>
                      <TableHead>Address 3</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Pin Code</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Founded Date</TableHead>
                      <TableHead>Website URL</TableHead>
                      <TableHead>Contact No</TableHead>
                      <TableHead>Annual Report URL</TableHead>
                      <TableHead>Location No</TableHead>
                      <TableHead>GST No</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
                        <TableCell>{program.sessionsPerWeek}x/week</TableCell>
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Company Mapping Tab */}
          <TabsContent value="companyMapping">
            <Card>
              <CardHeader>
                <CardTitle>Company Mapping</CardTitle>
                <CardDescription>Manage all mapping companies and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Code</TableHead>
                      <TableHead>Company Code</TableHead>
                      <TableHead>Location No</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order No</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Manage all mapping companies and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location No</TableHead>
                      <TableHead>Location Name</TableHead>
                      <TableHead>Short Name</TableHead>
                      <TableHead>Address 1</TableHead>
                      <TableHead>Address 2</TableHead>
                      <TableHead>Address 3</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Pin Code</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact No</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Role Tab */}
          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle>Role</CardTitle>
                <CardDescription>Manage all mapping companies and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role ID</TableHead>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Keyfield</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Role Mapping Tab */}
          <TabsContent value="roleMapping">
            <Card>
              <CardHeader>
                <CardTitle>Role Mapping</CardTitle>
                <CardDescription>Manage all mapping roles and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Code</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Role ID</TableHead>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Keyfield</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Role Rights Tab */}
          <TabsContent value="roleRights">
            <Card>
              <CardHeader>
                <CardTitle>Role Rights</CardTitle>
                <CardDescription>Manage all mapping companies and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role ID</TableHead>
                      <TableHead>Screen Type</TableHead>
                      <TableHead>Permission Type</TableHead>
                      <TableHead>Keyfield</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* User Tab */}
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User</CardTitle>
                <CardDescription>Manage all User and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Code</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>User Status</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Attribute Tab */}
          <TabsContent value="attribute">
            <Card>
              <CardHeader>
                <CardTitle>Attribute</CardTitle>
                <CardDescription>Manage all Attribute and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Sub Code</TableHead>
                      <TableHead>Details Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((program) => (
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
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

        {/* Add/Edit Company Dialog Or Popup*/}
        <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the company details' : 'Create a new company'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Company Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name">Company Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 1*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 2*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">City*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">State*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Pin Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Country*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Email*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Founded Date</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Website URL</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Contact No*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Annual Report URL</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">GST No</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Location No*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                </div>
              </div>

              <ImageUpload
                label="Company Images"
                images={images}
                onImagesChange={setImages}
                maxImages={2}
              />

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCompanyDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Company Mapping Dialog Or Popup*/}
        <Dialog open={isCompanyMappingDialogOpen} onOpenChange={setIsCompanyMappingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompanyMapping ? 'Edit Company Mapping' : 'Add New Company Mapping'}</DialogTitle>
              <DialogDescription>
                {editingCompanyMapping ? 'Update the company mapping details' : 'Create a new company mapping'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Mapping Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name">User Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Company Code*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Location No*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Order No</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCompanyMappingDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompanyMapping ? 'Update' : 'Create'} Company Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Location Dialog Or Popup*/}
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Location' : 'Add New Location'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the location details' : 'Create a new location'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Location Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name">Location No*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 1*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 2*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">City*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">State*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Pin Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Country*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Email*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Contact No*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Dialog Or Popup*/}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Role' : 'Add New Role'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the role details' : 'Create a new role'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Role Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name">Role ID*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Description</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Mapping Dialog Or Popup*/}
        <Dialog open={isRoleMappingDialogOpen} onOpenChange={setIsRoleMappingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Role Mapping' : 'Add New Role Mapping'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the role mapping details' : 'Create a new role mapping'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="category">User Code*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Role ID*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleMappingDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Role Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Rights Dialog Or Popup*/}
        <Dialog open={isRoleRightsDialogOpen} onOpenChange={setIsRoleRightsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Role Right' : 'Add New Role Right'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the role right details' : 'Create a new role right'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="category">Role ID*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Screen Type*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Permission Type*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleRightsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Role Right</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit User Dialog Or Popup*/}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the User details' : 'Create a new User'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">User Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="UserCode">User Code</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select User Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">User Name</Label>
                    <Input
                      id="UserName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., User Name"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="FirstName">First Name</Label>
                    <Input
                      id="FirstName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., First Name"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="LastName">Last Name</Label>
                    <Input
                      id="LastName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., LastName"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="name">Password</Label>
                    <Input
                      id="Password"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Password"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="UserCode">Status</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>   

                  <div className="space-y-2">
                    <Label htmlFor="Log">Log in/out</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Log in Or out" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>   

                  <div className="space-y-2">
                    <Label htmlFor="RoleID">Role ID</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>   
              
                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Email"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="DOB">DOB</Label>
                    <Input
                      id="DOB"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., DOB"
                    />
                  </div>                
                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="SelectGender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>                 
              
                  </div>
              </div>

              {/* Super Admin */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={companyForm.isActive}
                  onCheckedChange={(checked) => setCompanyForm({ ...companyForm, isActive: checked })}
                />
                <Label htmlFor="isActive">Super Admin</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Attribute Dialog Or Popup*/}
        <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the Attribute details' : 'Create a new Attribute'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Attribute Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="Code">Code</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="SubCode">Sub Code</Label>
                    <Input
                      id="SubCode"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., SubCode"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DetailsName">Details Name</Label>
                    <Input
                      id="DetailsName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Details Name"
                    />
                  </div>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    placeholder="Description..."
                  />
                </div>

              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default WorkoutProgramManagement;
