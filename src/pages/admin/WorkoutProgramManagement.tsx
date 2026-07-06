
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
import { ArrowLeft, Plus, Minus, Search, RotateCcw, Dumbbell, Package, Users, Clock, Edit, Trash2, Eye, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { BASE_URL } from '../ApiConfig';
import ReactMultiSelect, { MultiSelectOption } from "@/components/ui/react-multi-select";
import AgGridTable from "@/components/ui/ag-grid-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  sessionsPerWeek: string;
  assignedFaculty: string[];
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
  const [packages, setPackages] = useState<WorkoutPackage[]>(samplePackages);
  const [category, setCategory] = useState<any[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);

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

  const trainerOptions: MultiSelectOption[] = trainers.map(
    (trainer: any) => ({
      value: trainer.TrainerID,
      label: `${trainer.TrainerID} - ${trainer.FullName}`,
    })
  );

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/status`, {
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
        setStatus(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCategory(),
        fetchDifficultyLevel(),
        fetchTrainers(),
        fetchStatus()
      ]);
    };

    loadData();
  }, []);

  // Program Dialog States
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [submittedPrograms, setSubmittedPrograms] = useState(false);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);
  const [programForm, setProgramForm] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    difficultyLevel: '',
    durationPerSession: '',
    sessionsPerWeek: '3',
    assignedFaculty: [] as MultiSelectOption[],
    workingHours: '',
    isActive: true,
    goals: '',
    exercises: [{ name: '', sets: 3, reps: '' }],
  });
  const [companies, setCompanies] = useState([]);
  const [companySearchForm, setCompanySearchForm] = useState({
    company_no: "",
    company_name: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gst_no: "",
    status: "",
  });

  const [programSearchForm, setProgramSearchForm] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    difficultyLevel: '',
    durationPerSession: '',
    sessionsPerWeek: '',
    assignedFaculty: [] as MultiSelectOption[],
    workingHours: '',
    isActive: '',
    goals: '',
    exercisesName: '',
    exercisesCount: '',
    exercisesReps: '',
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
      id: '',
      name: '',
      description: '',
      category: '',
      difficultyLevel: '',
      durationPerSession: '',
      sessionsPerWeek: '3',
      assignedFaculty: [],
      workingHours: '',
      isActive: true,
      goals: '',
      exercises: [{ name: '', sets: 3, reps: '' }],
    });
    setIsProgramDialogOpen(true);
  };

  const handleEditProgram = (program: WorkoutProgram) => {

    setEditingProgram(program);
    const selectedFaculty = trainers
      .filter((trainer: any) =>
        program.assignedFaculty.includes(trainer.TrainerID)
      )
      .map((trainer: any) => ({
        value: trainer.TrainerID,
        label: `${trainer.TrainerID} - ${trainer.FullName}`,
      }));

    setProgramForm({
      id: program.id,
      name: program.name,
      description: program.description,
      category: program.category,
      difficultyLevel: program.difficultyLevel,
      durationPerSession: program.durationPerSession,
      sessionsPerWeek: program.sessionsPerWeek,
      assignedFaculty: selectedFaculty,
      workingHours: program.workingHours,
      isActive: program.isActive,
      goals: program.goals.join(', '),
      exercises: program.exercises.length > 0 ? program.exercises : [{ name: '', sets: 3, reps: '' }],
    });
    setIsProgramDialogOpen(true);
  };

  const validateProgram = () => {

    if (
      !programForm.name.trim() ||
      !programForm.category.trim() ||
      !programForm.difficultyLevel.trim() ||
      !programForm.durationPerSession.trim() ||
      !programForm.workingHours ||
      !programForm.goals.trim() ||
      programForm.assignedFaculty.length === 0 ||
      programForm.exercises.length === 0 ||
      programForm.exercises.some(
        (exercise) =>
          !exercise.name.trim() ||
          !exercise.sets ||
          !exercise.reps
      )
    ) {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });

      setSubmittedPrograms(true);

      return false;
    }

    return true;
  };

  const handleSaveProgram = async () => {
    if (!validateProgram()) return;

    try {
      const facultyIds = programForm.assignedFaculty.map((item) => item.value);

      const programPayload = {
        ProgramID: editingProgram?.id ?? "",
        ProgramName: programForm.name,
        Description: programForm.description,
        Category: programForm.category,
        Difficulty_level: programForm.difficultyLevel,
        Goals: programForm.goals,
        Duration_per_session: programForm.durationPerSession,
        Sessions_per_week: programForm.sessionsPerWeek,
        Working_hours: Number(programForm.workingHours),
        is_active: programForm.isActive ? "Active" : "Close",
        Company_code: "YJK",
        Location_code: "LOC001",
        created_by: "admin",
        modified_by: "admin",
      };

      if (editingProgram) {

        // =====================
        // UPDATE PROGRAM HEADER
        // =====================
        const updateResponse = await fetch(`${BASE_URL}/programUpdateData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(programPayload),
        });

        const updateResult = await updateResponse.json();

        if (!updateResponse.ok) {
          toast({
            title: "Error",
            description: updateResult.message || "Program update failed.",
            variant: "destructive",
          });
          return;
        }

        // =====================
        // DELETE OLD FACULTY
        // =====================
        await fetch(`${BASE_URL}/programFacultyDeleteData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProgramFacultys: [editingProgram.id],
          }),
        });

        // =====================
        // INSERT NEW FACULTY
        // =====================
        for (const faculty of facultyIds) {
          await fetch(`${BASE_URL}/programFacultyInsertData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Assigned_FacultyID: faculty,
              ProgramID: editingProgram.id,
              is_active: programPayload.is_active,
              Company_code: "YJK",
              Location_code: "LOC001",
              created_by: "admin",
            }),
          });
        }

        // =====================
        // DELETE OLD EXERCISES
        // =====================
        await fetch(`${BASE_URL}/programExerciseDeleteData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProgramExercises: [editingProgram.id],
          }),
        });

        // =====================
        // INSERT NEW EXERCISES
        // =====================
        for (let i = 0; i < programForm.exercises.length; i++) {
          const exercise = programForm.exercises[i];

          await fetch(`${BASE_URL}/programExerciseInsertData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ProgramID: editingProgram.id,
              ExercisesID: i + 1,
              Exercises_Name: exercise.name,
              Exercises_Count: exercise.sets,
              Exercises_Repetitions: exercise.reps,
              is_active: programPayload.is_active,
              Company_code: "YJK",
              Location_code: "LOC001",
              created_by: "admin",
            }),
          });
        }

        toast({
          title: "Program Updated",
          description: "Workout Program Updated Successfully",
          variant: "success",
        });

        setSubmittedPrograms(false);

      } else {

        // =====================
        // INSERT PROGRAM HEADER
        // =====================
        const response = await fetch(`${BASE_URL}/programInsertData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(programPayload),
        });

        const result = await response.json();

        if (!response.ok) {
          toast({
            title: "Error",
            description: result.message || "Program insert failed.",
            variant: "destructive",
          });
          return;
        }

        const programId = result.ProgramID;

        setProgramForm((prev) => ({
          ...prev,
          id: programId,
        }));

        // =====================
        // INSERT FACULTIES
        // =====================
        for (const faculty of facultyIds) {
          await fetch(`${BASE_URL}/programFacultyInsertData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Assigned_FacultyID: faculty,
              ProgramID: programId,
              is_active: programPayload.is_active,
              Company_code: "YJK",
              Location_code: "LOC001",
              created_by: "admin",
            }),
          });
        }

        // =====================
        // INSERT EXERCISES
        // =====================
        for (let i = 0; i < programForm.exercises.length; i++) {
          const exercise = programForm.exercises[i];

          await fetch(`${BASE_URL}/programExerciseInsertData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ProgramID: programId,
              ExercisesID: i + 1,
              Exercises_Name: exercise.name,
              Exercises_Count: exercise.sets,
              Exercises_Repetitions: exercise.reps,
              is_active: programPayload.is_active,
              Company_code: "YJK",
              Location_code: "LOC001",
              created_by: "admin",
            }),
          });
        }

        toast({
          title: "Program Added",
          description: "Workout Program Added Successfully",
          variant: "success",
        });

        setSubmittedPrograms(false);
      }

      setIsProgramDialogOpen(false);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
    toast({ title: "Program Deleted", description: "Workout program has been removed.", variant: "destructive" });
  };

  const handleCompanySearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/companysearchcriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_no: companySearchForm.company_no,
          company_name: companySearchForm.company_name,
          city: companySearchForm.city,
          state: companySearchForm.state,
          pincode: companySearchForm.pincode,
          country: companySearchForm.country,
          company_gst_no: companySearchForm.gst_no,
          status: companySearchForm.status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCompanies(data);
      } else if (response.status === 404) {
        setCompanies([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching companies found.",
          variant: "destructive",
        });
      } else {
        setCompanies([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setCompanies([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
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

  const filteredPackages = packages.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeExerciseField = (indexToRemove: number) => {
    // Prevent deleting if it's the only row left, keeping at least 1 row active
    if (programForm.exercises.length <= 1) {
      setProgramForm({
        ...programForm,
        exercises: [{ name: '', sets: 3, reps: '' }]
      });
      return;
    }

    setProgramForm({
      ...programForm,
      exercises: programForm.exercises.filter((_, index) => index !== indexToRemove),
    });
  };

  const renderProgramSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">

      <div className="space-y-2">
        <Label>Program ID</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Program ID"
                value={programSearchForm.id}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, id: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Program ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Program Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Program Name"
                value={programSearchForm.name}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Program Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select value={programSearchForm.category} onValueChange={(value) => setProgramSearchForm({ ...programSearchForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
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
            </TooltipTrigger>

            <TooltipContent>
              <p>Select Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select value={programSearchForm.difficultyLevel} onValueChange={(value) => setProgramSearchForm({ ...programSearchForm, difficultyLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
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
            </TooltipTrigger>

            <TooltipContent>
              <p>Select Difficulty Level</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Goals (comma-separated)</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="goals"
                value={programSearchForm.goals}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, goals: e.target.value })}
                placeholder="Enter Goals (comma-separated)"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Goals (comma-separated)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Description"
                value={programSearchForm.description}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, description: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Description</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="faculty">Assigned Faculty</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ReactMultiSelect
                  options={trainerOptions}
                  value={programSearchForm.assignedFaculty}
                  placeholder="Select Assigned Faculty"
                  onChange={(selected) =>
                    setProgramSearchForm({
                      ...programSearchForm,
                      assignedFaculty: selected,
                    })
                  }
                />
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>Select Assigned Faculty</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={programSearchForm.isActive}
                  onValueChange={(value) => setProgramSearchForm({ ...programSearchForm, isActive: value, })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    {status.map((item: any) => (
                      <SelectItem
                        key={item.attributedetails_name}
                        value={item.attributedetails_name}
                      >
                        {item.attributedetails_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>Select Status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration Per Session</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="duration"
                value={programSearchForm.durationPerSession}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, durationPerSession: e.target.value })}
                placeholder="Enter Duration Per Session"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Duration Per Session</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessions">Sessions Per Week</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="sessions"
                type="text"
                min={1}
                max={7}
                placeholder="Enter Sessions Per Week"
                value={programSearchForm.sessionsPerWeek}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, sessionsPerWeek: e.target.value })}
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Sessions Per Week</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workingHours">Working Hours</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="workingHours"
                value={programSearchForm.workingHours}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, workingHours: e.target.value })}
                placeholder="Enter Working Hours"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Working Hours</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exerciseName">Exercises Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="exerciseName"
                value={programSearchForm.exercisesName}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, exercisesName: e.target.value })}
                placeholder="Enter Exercises Name"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Exercises Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercisesCount">Exercises Count</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="exercisesCount"
                value={programSearchForm.exercisesCount}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, exercisesCount: e.target.value })}
                placeholder="Enter Exercises Count"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Exercises Count</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercisesReps">Exercises Repetitions</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                id="exercisesReps"
                value={programSearchForm.exercisesReps}
                onChange={(e) => setProgramSearchForm({ ...programSearchForm, exercisesReps: e.target.value })}
                placeholder="Enter Exercises Repetitions"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Exercises Repetitions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const handleSearch = () => {
    switch (activeTab) {
      case "programs":
        handleCompanySearch();
        break;

      default:
        break;
    }
  };

  const handleReset = () => {
    switch (activeTab) {
      case "programs":
        setProgramSearchForm({
          id: '',
          name: '',
          description: '',
          category: '',
          difficultyLevel: '',
          durationPerSession: '',
          sessionsPerWeek: '',
          assignedFaculty: [] as MultiSelectOption[],
          workingHours: '',
          isActive: '',
          goals: '',
          exercisesName: '',
          exercisesCount: '',
          exercisesReps: '',
        });
        setPrograms([]);
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
              <Button variant="ghost" onClick={() => navigate('/AdminDashboard')}>
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
        <Card className="mb-6">
          <CardContent className="p-6">

            {activeTab === "programs" && renderProgramSearch()}

            <div className="flex justify-end gap-4 mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={handleSearch}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Reload</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

          </CardContent>
        </Card>

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
          {/* <TabsContent value="programs">
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
          </TabsContent> */}

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
        <Dialog open={isProgramDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedPrograms(false);
          }
          setIsProgramDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProgram ? 'Edit Program' : 'Add New Program'}</DialogTitle>
              <DialogDescription>
                {editingProgram ? 'Update the workout program details' : 'Create a new workout program'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">

              {/* Faculty Assignment */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Program ID</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="name"
                          value={programForm.id}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                          // onChange={(e) => setProgramForm({ ...programForm, id: e.target.value })}
                          placeholder="Auto Generated"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Program ID is Auto Generated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Program Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Program Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedPrograms && !programForm.name ? "text-red-500" : ""}>Program Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={programForm.name}
                            onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                            placeholder="e.g., Weight Loss Transformation"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Program Name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className={submittedPrograms && !programForm.category ? "text-red-500" : ""}>Category*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
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
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select Category</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className={submittedPrograms && !programForm.difficultyLevel ? "text-red-500" : ""}>Difficulty Level*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
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
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select Difficulty Level</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">Goals (comma-separated)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="goals"
                            value={programForm.goals}
                            onChange={(e) => setProgramForm({ ...programForm, goals: e.target.value })}
                            placeholder="e.g., Weight Loss, Endurance"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Goals (comma-separated)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Textarea
                          id="description"
                          value={programForm.description}
                          onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                          placeholder="Describe the program..."
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Description</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Schedule</h4>
                <div className="grid grid-cols-3 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="duration" className={submittedPrograms && !programForm.durationPerSession ? "text-red-500" : ""}>Duration Per Session</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="duration"
                            value={programForm.durationPerSession}
                            onChange={(e) => setProgramForm({ ...programForm, durationPerSession: e.target.value })}
                            placeholder="e.g., 45 minutes"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Duration Per Session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessions" className={submittedPrograms && !programForm.sessionsPerWeek ? "text-red-500" : ""}>Sessions Per Week</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="sessions"
                            type="number"
                            min={1}
                            max={7}
                            value={programForm.sessionsPerWeek}
                            onChange={(e) => setProgramForm({ ...programForm, sessionsPerWeek: e.target.value })}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Sessions Per Week</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workingHours" className={submittedPrograms && !programForm.workingHours ? "text-red-500" : ""}>Working Hours</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="workingHours"
                            value={programForm.workingHours}
                            onChange={(e) => setProgramForm({ ...programForm, workingHours: e.target.value })}
                            placeholder="e.g., 6AM-10AM, 5PM-9PM"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Working Hours</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

              {/* Faculty Assignment */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Faculty Assignment
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="faculty" className={submittedPrograms && programForm.assignedFaculty.length === 0 ? "text-red-500" : ""}>Assigned Faculty*</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <ReactMultiSelect
                            options={trainerOptions}
                            value={programForm.assignedFaculty}
                            placeholder="Select assigned faculty"
                            onChange={(selected) =>
                              setProgramForm({
                                ...programForm,
                                assignedFaculty: selected,
                              })
                            }
                          />
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Select Assigned Faculty</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>

              {/* Exercises Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium text-sm text-gray-700 ${submittedPrograms &&
                    programForm.exercises.some(
                      (e) => !e.name.trim() || !e.sets || !e.reps
                    )
                    ? "text-red-500"
                    : "text-gray-700"
                    }`}>Exercises*</h4>
                </div>

                <div className="space-y-3">
                  {programForm.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-3">

                      <div className="grid grid-cols-3 gap-2 flex-1">

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                placeholder="Exercise name"
                                value={exercise.name}
                                onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                className="bg-white"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Exercise Name</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                type="number"
                                placeholder="Sets"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                                className="bg-white"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Sets</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Input
                                  placeholder="Reps (e.g., 10-12)"
                                  value={exercise.reps}
                                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                  className="bg-white"
                                />
                              </TooltipTrigger>

                              <TooltipContent>
                                <p>Enter Repetitions</p>
                              </TooltipContent>
                            </Tooltip>
                          </Tooltip>
                        </TooltipProvider>

                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={addExerciseField}
                                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-gray-200 rounded-md"
                              >
                                <Plus className="h-4 w-4 font-bold" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Add new row</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExerciseField(index)}
                                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-md"
                              >
                                <Minus className="h-4 w-4 font-bold" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Remove row</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      </div>
                    </div>
                  ))}
                </div>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setIsProgramDialogOpen(false);
                      setSubmittedPrograms(false);
                    }}>Cancel</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Cancel without saving changes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSaveProgram}>{editingProgram ? 'Update' : 'Create'} Program</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingProgram
                        ? "Update program"
                        : "Create a program"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent >
        </Dialog >

        {/* Add/Edit Package Dialog */}
        <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen} >
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
        </Dialog >
      </main >
    </div >
  );
};

export default WorkoutProgramManagement;
