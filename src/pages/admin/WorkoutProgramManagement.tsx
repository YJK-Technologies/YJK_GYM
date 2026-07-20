import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Minus, Search, Phone, Mail, TrendingUp, RotateCcw, Dumbbell, Package, Users, Clock, Edit, Trash2, Eye, Calendar, DollarSign, CheckCircle, XCircle, IndianRupee, BadgePercent,
} from "lucide-react";
import { BASE_URL } from "../ApiConfig";
import ReactMultiSelect, {  MultiSelectOption,} from "@/components/ui/react-multi-select";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip";
import { showConfirmToast } from "../../components/ui/show-confirm-toast";
import { useCompany } from "../CompanyContext";
import { hasActionPermission } from "@/utils/permission";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface AssociatedProgram {
  programId: string;
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
  Keyfield: string;
  createdDate: string;
}

interface WorkoutPackage {
  id: string;
  name: string;
  packageType: string;
  durationDays: number;
  price: number;
  programId: string;
  // associatedPrograms: AssociatedProgram[];
  programName: string;
  features: string[];
  discountPercentage: number;
  isActive: boolean;
  // facultyId: string;
  // facultyName: string;
  duration_days: number;
  KeyField: string;
}

// For MemberShip
interface WorkoutMemberShip {
  MemberShipType_id: string;
  MemberShipType_Name: string;
  Status: boolean;
  Sno: number;
  package_ID: string;
  Keyfield: string;
}

// Sample Faculty Data
const sampleFaculty = [
  { id: "FAC001", name: "Ahmed Al-Rashid" },
  { id: "FAC002", name: "Omar Khalil" },
  { id: "FAC003", name: "Fatima Hassan" },
  { id: "FAC004", name: "Mohammed Ali" },
];

interface Stats {
  TotalPrograms: number;
  ActivePrograms: number;
  TotalPackages: number;
  ActivePackages: number;
}

const WorkoutProgramManagement = () => {
  const { companyCode, locationCode, userCode } = useCompany();

  const navigate = useNavigate();
  const { toast } = useToast();

  const tabs = [
    {
      value: "programs",
      label: "Programs",
      screenType: "Programs",
      icon: Dumbbell,
    },
    {
      value: "packages",
      label: "Packages",
      screenType: "Packages",
      icon: Package,
    },
    {
      value: "memberships",
      label: "Memberships",
      screenType: "Memberships",
      icon: Package,
    },
  ];

  const [activeTab, setActiveTab] = useState("");

  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  const allowedScreens = permissions.map((p: any) => p.screen_type);

  const allowedTabs = tabs.filter((tab) =>
    allowedScreens.includes(tab.screenType),
  );

  useEffect(() => {
    if (allowedTabs.length > 0) {
      setActiveTab(allowedTabs[0].value);
    }
  }, []);

  const tabPermissions = ["Programs", "Packages", "Memberships"];

  const hasAnyTabPermission = tabPermissions.some((tab) =>
    allowedScreens.includes(tab),
  );

  if (!hasAnyTabPermission) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-gray-300">404</h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            No Permission Available
          </h2>

          <p className="mt-2 text-gray-500">
            You don't have permission to access any module in Workout Programs Management.
          </p>

          <Button className="mt-6" onClick={() => navigate("/AdminDashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState<WorkoutPackage[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [PackageTypes, setPackageTypes] = useState<any[]>([]);//Package
  const [ProgramsID, setProgramsID] = useState<any[]>([]);//Package drop
  const [difficultyLevel, setDifficultyLevel] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<Stats>({
    TotalPrograms: 0,
    ActivePrograms: 0,
    TotalPackages: 0,
    ActivePackages: 0,
  });
  const [GetPackages, setGetPackages] = useState<any[]>([]);
  // Start packages useEffect
  const fetchPackageTypes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getPackageTypes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPackageTypes(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getPrograms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
          Location_Code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProgramsID(data);
      } else {
        console.error("Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const programOptions: MultiSelectOption[] = ProgramsID.map((program: any) => ({
    value: program.ProgramID,
    label: `${program.ProgramID} - ${program.ProgramName}`,
  }));
  //End packages useeffect

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
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
          company_code: companyCode,
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
          company_code: companyCode,
          Location_Code: locationCode,
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

  const trainerOptions: MultiSelectOption[] = trainers.map((trainer: any) => ({
    value: trainer.TrainerID,
    label: `${trainer.TrainerID} - ${trainer.FullName}`,
  }));

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
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

  const fetchWorkoutData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/programCardData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatsData(data);

        console.log(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // For membership
  const fetchPackages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMeberShipPackages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGetPackages(data);

        console.log(data);
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
        fetchStatus(),
        fetchWorkoutData(),
        fetchPackageTypes(), //packges
        fetchPrograms(), //packges
        fetchPackages(), //membership
      ]);
    };

    loadData();
  }, []);

  // Program Dialog States
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [submittedPrograms, setSubmittedPrograms] = useState(false);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(
    null,
  );
  const [programForm, setProgramForm] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    difficultyLevel: "",
    durationPerSession: "",
    sessionsPerWeek: "3",
    assignedFaculty: [] as MultiSelectOption[],
    workingHours: "",
    isActive: true,
    goals: "",
    exercises: [{ name: "", sets: 3, reps: 10 }],
    Keyfield: "",
  });

  const [programSearchForm, setProgramSearchForm] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    difficultyLevel: "",
    durationPerSession: "",
    sessionsPerWeek: "",
    assignedFaculty: "",
    workingHours: "",
    isActive: "",
    goals: "",
    exercisesName: "",
    exercisesCount: "",
    exercisesReps: "",
  });

  // Package Dialog States
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [submittedPackage, setSubmittedPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<WorkoutPackage | null>(
    null,
  );
  const [packageForm, setPackageForm] = useState({
    id: "",
    name: "",
    packageType: "",
    price: 0,
    // programId: [] as MultiSelectOption[],
    // programId: "",
    associatedPrograms: [
      {
        programId: "",
      },
    ],
    // facultyId: "",
    duration_days: 0,
    discountPercentage: 0,
    isActive: true,
    features: "",
  });

  const [packageSearchForm, setPackageSearchForm] = useState({
  id: "",
  name: "",
  packageType: "",
  durationDays: "",
  price: 0,
  features: "",
  discountPercentage: 0,
  associatedProgram: "",
  isActive: "",
});

  // MemberShip Dialog States
  const [MemberShips, setMemberShips] = useState<WorkoutMemberShip[]>([]);
  const [submittedMemberShips, setSubmittedMemberShips] = useState(false);
  const [isMemberShipDialogOpen, setIsMemberShipDialogOpen] = useState(false);
  const [editingMemberShip, setEditingMemberShip] = useState<WorkoutMemberShip | null>(
    null,
  );
  const [MemberShipForm, setMemberShipForm] = useState({
    MemberShipType_id: "",
    MemberShipType_Name: "",
    Status: true,
    Sno: "",
    PackageIDName: [
      {
        package_ID: "",
      },
    ],
    Keyfield: "",
    });

  const [MemberShipSearchForm, setMemberShipSearchForm] = useState({
    MemberShipType_id: "",
    MemberShipType_Name: "",
    Status: "",
    Sno: "",
    package_ID: "",
    Keyfield: "",
  });

  const stats = [
    {
      title: "Total Programs",
      value: statsData[0]?.TotalPrograms ?? 0,
      icon: Dumbbell,
      color: "bg-purple-500",
    },
    {
      title: "Active Programs",
      value: statsData[0]?.ActivePrograms ?? 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Total Packages",
      value: packages.length.toString(),
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Active Packages",
      value: packages.filter((p) => p.isActive).length.toString(),
      icon: Calendar,
      color: "bg-orange-500",
    },
  ];

  const getDurationDays = (type: string): number => {
    switch (type) {
      case "Monthly":
        return 30;
      case "Quarterly":
        return 90;
      case "Half-Yearly":
        return 180;
      default:
        return 30;
    }
  };

  const getPackageTypeBadge = (type: string, discount: number) => {
    switch (type) {
      case "Monthly":
        return <Badge className="bg-purple-500">30 Days</Badge>;
      case "Quarterly":
        return (
          <div className="flex gap-1">
            <Badge className="bg-green-500">90 Days</Badge>
            {discount > 0 && (
              <Badge variant="outline" className="text-green-600">
                Save {discount}%
              </Badge>
            )}
          </div>
        );
      case "Half-Yearly":
        return (
          <div className="flex gap-1">
            <Badge className="bg-purple-500">180 Days</Badge>
            {discount > 0 && (
              <Badge variant="outline" className="text-purple-600">
                Best Value - Save {discount}%
              </Badge>
            )}
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
      id: "",
      name: "",
      description: "",
      category: "",
      difficultyLevel: "",
      durationPerSession: "",
      sessionsPerWeek: "3",
      assignedFaculty: [],
      workingHours: "",
      isActive: true,
      goals: "",
      exercises: [{ name: "", sets: 3, reps: 10 }],
      Keyfield: "",
    });
    setIsProgramDialogOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);

    // Faculty MultiSelect
    const selectedFaculty = trainers
      .filter((trainer: any) => program.Faculty.includes(trainer.TrainerID))
      .map((trainer: any) => ({
        value: trainer.TrainerID,
        label: `${trainer.TrainerID} - ${trainer.FullName}`,
      }));

    // Exercise Mapping
    const selectedExercises =
      program.Exercises.length > 0
        ? program.Exercises.map((exercise: any) => ({
          name: exercise.Exercises_Name,
          sets: exercise.Exercises_Count,
          reps: exercise.Exercises_Repetitions,
        }))
        : [{ name: "", sets: 3, reps: "" }];

    setProgramForm({
      id: program.ProgramID,
      name: program.ProgramName,
      description: program.Description,
      category: program.Category,
      difficultyLevel: program.Difficulty_level,
      durationPerSession: program.Duration_per_session,
      sessionsPerWeek: program.Sessions_per_week,
      workingHours: program.Working_hours,
      isActive: program.is_active === "Active",
      goals: program.Goals,
      assignedFaculty: selectedFaculty,
      exercises: selectedExercises,
      Keyfield: program.Keyfield,
    });

    setIsProgramDialogOpen(true);
  };

  const validateProgram = () => {
    if (
      !programForm.name.trim() ||
      !programForm.category.trim() ||
      !programForm.difficultyLevel.trim() ||
      !programForm.durationPerSession.trim() ||
      !programForm.sessionsPerWeek.trim() ||
      !programForm.workingHours ||
      !programForm.goals.trim() ||
      programForm.assignedFaculty.length === 0 ||
      programForm.exercises.length === 0 ||
      programForm.exercises.some(
        (exercise) => !exercise.name.trim() || !exercise.sets || !exercise.reps,
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

    // Duplicate Exercise validation
    const exerciseNames = programForm.exercises
      .map((exercise) => exercise.name.trim().toLowerCase())
      .filter((name) => name !== "");

    const duplicateExercise = exerciseNames.some(
      (name, index) => exerciseNames.indexOf(name) !== index,
    );

    if (duplicateExercise) {
      toast({
        title: "Duplicate Exercise",
        description: "Duplicate Exercise Name is not allowed.",
        variant: "destructive",
      });

      setSubmittedPrograms(true);
      return false;
    }

    // Exercise Count Validation
    const invalidSets = programForm.exercises.find(
      (ex) => Number(ex.sets) <= 0,
    );

    if (invalidSets) {
      toast({
        title: "Invalid Exercise Count",
        description: "Exercise Count must be greater than zero.",
        variant: "destructive",
      });

      return false;
    }

    // Exercise Repetitions Validation
    const invalidReps = programForm.exercises.find(
      (ex) => Number(ex.reps) <= 0,
    );

    if (invalidReps) {
      toast({
        title: "Invalid Exercise Repetitions",
        description: "Exercise Repetitions must be greater than zero.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const handleSaveProgram = async () => {
    if (editingProgram) {
      await handleUpdateProgram();
    } else {
      await handleCreateProgram();
    }
  };

  const handleCreateProgram = async () => {
    if (!validateProgram()) return;

    try {
      const facultyIds = programForm.assignedFaculty.map((item) => item.value);

      const programPayload = {
        ProgramID: programForm.id,
        ProgramName: programForm.name,
        Description: programForm.description,
        Category: programForm.category,
        Difficulty_level: programForm.difficultyLevel,
        Goals: programForm.goals,
        Duration_per_session: programForm.durationPerSession,
        Sessions_per_week: programForm.sessionsPerWeek,
        Working_hours: programForm.workingHours,
        is_active: programForm.isActive ? "Active" : "Close",
        Company_code: companyCode,
        Location_code: locationCode,
        created_by: userCode,
      };

      // Insert Program Header
      const response = await fetch(`${BASE_URL}/programInsertData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programPayload),
      });

      const result = await response.json();

      setProgramForm((prev) => ({
        ...prev,
        id: programId,
      }));

      if (!response.ok) {
        throw new Error(result.message || "Program insert failed.");
      }

      const programId = result.ProgramID;

      // Insert Faculties
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
            Company_code: companyCode,
            Location_code: locationCode,
            created_by: userCode,
          }),
        });
      }

      // Insert Exercises
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
            Company_code: companyCode,
            Location_code: locationCode,
            created_by: userCode,
          }),
        });
      }

      toast({
        title: "Program Added",
        description: "Workout Program Added Successfully",
        variant: "success",
      });

      handleProgramSearch();
      fetchWorkoutData();
      setSubmittedPrograms(false);
      setIsProgramDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgram = () => {
    showConfirmToast({
      title: "Update Program",
      description: `Are you sure you want to update "${programForm.name}"?`,
      onConfirm: updateProgram,
    });
  };

  const updateProgram = async () => {
    if (!editingProgram) return;

    if (!validateProgram()) return;

    try {
      const facultyIds = programForm.assignedFaculty.map((item) => item.value);

      const programPayload = {
        Keyfield: editingProgram.Keyfield,
        ProgramID: programForm.id,
        ProgramName: programForm.name,
        Description: programForm.description,
        Category: programForm.category,
        Difficulty_level: programForm.difficultyLevel,
        Goals: programForm.goals,
        Duration_per_session: programForm.durationPerSession,
        Sessions_per_week: programForm.sessionsPerWeek,
        Working_hours: programForm.workingHours,
        is_active: programForm.isActive ? "Active" : "Close",
        Company_code: companyCode,
        Location_code: locationCode,
        created_by: userCode,
        modified_by: userCode,
      };

      // Update Header
      const response = await fetch(`${BASE_URL}/programUpdateData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Program update failed.");
      }

      // Delete Faculty
      await fetch(`${BASE_URL}/programFacultyDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          modified_by: userCode,
          programid: programForm.id,
          updatemode: "UD"
        },
        body: JSON.stringify({
          ProgramFacultys: [editingProgram.Keyfield],
        }),
      });

      // Insert Faculty
      for (const faculty of facultyIds) {
        await fetch(`${BASE_URL}/programFacultyInsertData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Assigned_FacultyID: faculty,
            ProgramID: programForm.id,
            is_active: programPayload.is_active,
            Company_code: companyCode,
            Location_code: locationCode,
            created_by: userCode,
            UpdateMode: "UI"
          }),
        });
      }

      // Delete Exercises
      await fetch(`${BASE_URL}/programExerciseDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          modified_by: userCode,
          programid: programForm.id,
          updatemode: "UD"
        },
        body: JSON.stringify({
          ProgramExercises: [editingProgram.Keyfield],
        }),
      });

      // Insert Exercises
      for (let i = 0; i < programForm.exercises.length; i++) {
        const exercise = programForm.exercises[i];

        await fetch(`${BASE_URL}/programExerciseInsertData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProgramID: programForm.id,
            ExercisesID: i + 1,
            Exercises_Name: exercise.name,
            Exercises_Count: exercise.sets,
            Exercises_Repetitions: exercise.reps,
            is_active: programPayload.is_active,
            Company_code: companyCode,
            Location_code: locationCode,
            created_by: userCode,
            UpdateMode: "UI"
          }),
        });
      }

      toast({
        title: "Program Updated",
        description: "Workout Program Updated Successfully",
        variant: "success",
      });

      handleProgramSearch();
      fetchWorkoutData();
      setSubmittedPrograms(false);
      setIsProgramDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProgram = (program: any) => {
    showConfirmToast({
      title: "Delete Program",
      description: `Are you sure you want to delete "${program.ProgramName}"?`,
      onConfirm: () => deleteProgram(program),
    });
  };

  const deleteProgram = async (program: any) => {
    try {
      // -----------------------------
      // Delete Program Exercises
      // -----------------------------
      await fetch(`${BASE_URL}/programExerciseDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          modified_by: userCode,
          programid: program.ProgramID,
        },
        body: JSON.stringify({
          ProgramExercises: [program.Keyfield],
        }),
      });

      // -----------------------------
      // Delete Program Faculty
      // -----------------------------
      await fetch(`${BASE_URL}/programFacultyDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          modified_by: userCode,
          programid: program.ProgramID,
        },
        body: JSON.stringify({
          ProgramFacultys: [program.Keyfield],
        }),
      });

      // -----------------------------
      // Delete Program Header
      // -----------------------------
      const response = await fetch(`${BASE_URL}/programDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          modified_by: userCode,
          programid: program.ProgramID,
        },
        body: JSON.stringify({
          ProgramIDs: [program.Keyfield],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      // Remove from UI
      setPrograms((prev) =>
        prev.filter((item) => item.Keyfield !== program.Keyfield),
      );

      handleProgramSearch();
      fetchWorkoutData();

      toast({
        title: "Program Deleted",
        description: "Workout Program deleted successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Delete Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleProgramSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/programSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProgramID: programSearchForm.id,
          ProgramName: programSearchForm.name,
          Description: programSearchForm.description,
          Category: programSearchForm.category,
          Difficulty_level: programSearchForm.difficultyLevel,
          Goals: programSearchForm.goals,
          Duration_per_session: programSearchForm.durationPerSession,
          Sessions_per_week: programSearchForm.sessionsPerWeek,
          Working_hours: programSearchForm.workingHours,
          is_active: programSearchForm.isActive,
          Assigned_Faculty: programSearchForm.assignedFaculty,
          Exercises_Name: programSearchForm.exercisesName,
          Exercises_Count: programSearchForm.exercisesCount,
          Exercises_Repetitions: programSearchForm.exercisesReps,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const formattedPrograms = data.map((program: any) => ({
          ...program,
          Exercises: program.Exercises ? JSON.parse(program.Exercises) : [],
          Faculty: program.Faculty ? program.Faculty.split(",") : [],
        }));

        setPrograms(formattedPrograms);
      } else if (response.status === 404) {
        setPrograms([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching programs found.",
          variant: "destructive",
        });
      } else {
        setPrograms([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setPrograms([]);

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
    fetchPrograms();
    setPackageForm({
      id: "",
      name: "",
      packageType: "",
      price: 0,
      // programId: [],
      // programId: "",
      // facultyId: "",
      associatedPrograms: [
        {
          programId: "",
        },
      ],
      duration_days: 0,
      discountPercentage: 0,
      isActive: true,
      features: "",
    });
    setIsPackageDialogOpen(true);
  };

  const addProgramField = () => {
    setPackageForm({
      ...packageForm,
      associatedPrograms: [
        ...packageForm.associatedPrograms,
        {
          programId: "",
        },
      ],
    });
  };

  const updatePrograms = (index: number, value: string) => {
    const updatedPrograms = [...packageForm.associatedPrograms];

    updatedPrograms[index].programId = value;

    setPackageForm({
      ...packageForm,
      associatedPrograms: updatedPrograms,
    });
  };

  const removeProgramField = (index: number) => {
    if (packageForm.associatedPrograms.length === 1) {
      setPackageForm({
        ...packageForm,
        associatedPrograms: [
          {
            programId: "",
          },
        ],
      });
      return;
    }

    const updatedPrograms = packageForm.associatedPrograms.filter(
      (_, i) => i !== index
    );

    setPackageForm({
      ...packageForm,
      associatedPrograms: updatedPrograms,
    });
  };

  // const handleEditPackage = (pkg: WorkoutPackage) => {
  //   setEditingPackage(pkg);

  //   const associatedPrograms =
  //     pkg.programId && pkg.programId.trim() !== ""
  //       ? pkg.programId.split(",").map((id) => ({
  //         programId: id.trim(),
  //       }))
  //       : [
  //         {
  //           programId: "",
  //         },
  //       ];

  //   setPackageForm({
  //     id: pkg.id,
  //     name: pkg.name,
  //     packageType: pkg.packageType,
  //     price: pkg.price,
  //     associatedPrograms,
  //     duration_days: pkg.duration_days,
  //     discountPercentage: pkg.discountPercentage,
  //     isActive: pkg.isActive,
  //     features: pkg.features.join(", "),
  //   });

  //   setIsPackageDialogOpen(true);
  // };


  const handleEditPackage = (pkg: any) => {
  setEditingPackage(pkg);

  const associatedPrograms =
    pkg.Programs && pkg.Programs.length > 0
      ? pkg.Programs.map((id: string) => ({
          programId: id.trim(),
        }))
      : [
          {
            programId: "",
          },
        ];

  setPackageForm({
    id: pkg.package_ID,
    name: pkg.package_Name,
    packageType: pkg.package_type,
    price: pkg.price,
    associatedPrograms,
    duration_days: pkg.duration_days,
    discountPercentage: pkg.discount_percentage,
    isActive: pkg.is_active === "Active",
    features: pkg.features ?? "",
  });

  setIsPackageDialogOpen(true);
};
  const handleSavePackage = async () => {
    if (editingPackage) {
       await handleUpdatePackage();
    } else {
      await handleCreatePackage();
    }
  };

  const handleUpdatePackage = () => {
  showConfirmToast({
    title: "Update Package",
    description: `Are you sure you want to update "${packageForm.name}"?`,
    onConfirm: updatePackage,
  });
};

const updatePackage = async () => {
  if (!editingPackage) return;

  // if (!validatePackage()) return;

  try {

    const packagePayload = {
      package_ID: packageForm.id,
      package_Name: packageForm.name,
      package_type: packageForm.packageType,
      duration_days: packageForm.duration_days,
      price: packageForm.price,
      features: packageForm.features,
      discount_percentage: packageForm.discountPercentage,
      is_active: packageForm.isActive ? "Active" : "Close",
      Company_Code: companyCode,
      Location_Code: locationCode,
      modified_by: userCode,
    };

    // ----------------------------
    // Update Package Header
    // ----------------------------

    const response = await fetch(`${BASE_URL}/PackageUpdateData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packagePayload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Package update failed.");
    }

        // ---------------------------------------
    // Delete Existing Package Details
    // ---------------------------------------

    await fetch(`${BASE_URL}/PackageDetailsDeleteData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        company_code: companyCode,
        location_code: locationCode,
        modified_by: userCode,
        updatemode: "UD",
      },
      body: JSON.stringify({
        KeyFieldHeaders: [editingPackage.KeyField],
        
      }),
    });

    // ---------------------------------------
    // Insert Updated Programs
    // ---------------------------------------

    for (let i = 0; i < packageForm.associatedPrograms.length; i++) {

      const program = packageForm.associatedPrograms[i];

      if (!program.programId) continue;

      await fetch(`${BASE_URL}/PackageDetailsInsertData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sno: i + 1,
          package_ID: packageForm.id,
          Program_ID: program.programId,
          Company_Code: companyCode,
          Location_Code: locationCode,
          created_by: userCode,
        }),
      });
    }

        toast({
      title: "Package Updated",
      description: "Workout Package Updated Successfully",
      variant: "success",
    });

    // Refresh Package List
    handlePackageSearch();

    // Refresh Dashboard Counts / Cards
    fetchWorkoutData();

    // Reset Dialog State
    setSubmittedPackage(false);
    setEditingPackage(null);

    // Close Dialog
    setIsPackageDialogOpen(false);

  } catch (err: any) {

    toast({
      title: "Error",
      description: err.message || "Package Update Failed",
      variant: "destructive",
    });

    console.error("Package Update Error :", err);

  }
};


  // const handleCreatePackage = async () => {
  //   // if (!validatePackage()) return;

  //   try {
  //     const packagePayload = {
  //       package_Name: packageForm.name,
  //       package_type: packageForm.packageType,
  //       duration_days: packageForm.duration_days,
  //       price: packageForm.price,
  //       features: packageForm.features,
  //       discount_percentage: packageForm.discountPercentage,
  //       is_active: packageForm.isActive ? "Active" : "Close",
  //       Company_code: companyCode,
  //       Location_code: locationCode,
  //       created_by: userCode,
  //     };

  //     // ===========================
  //     // INSERT HEADER
  //     // ===========================
  //     const response = await fetch(`${BASE_URL}/PackageInsertData`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(packagePayload),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || "Package insert failed.");
  //     }

  //     // Header Keyfield
  //     const keyFieldHeader = result.KeyField;

  //     // ===========================
  //     // INSERT DETAILS
  //     // ===========================
  //     for (const item of packageForm.associatedPrograms) {

  //       if (!item.programId) continue;

  //       const detailResponse = await fetch(
  //         `${BASE_URL}/PackageDetailsInsertData`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             KeyFieldHeader: keyFieldHeader,
  //             Program_ID: item.programId,
  //             Company_Code: companyCode,
  //             Location_Code: locationCode,
  //             created_by: userCode,
  //           }),
  //         }
  //       );

  //       const detailResult = await detailResponse.json();

  //       if (!detailResponse.ok) {
  //         throw new Error(
  //           detailResult.message || "Package Details insert failed."
  //         );
  //       }
  //     }

  //     toast({
  //       title: "Package Added",
  //       description: "Workout Package Added Successfully",
  //       variant: "success",
  //     });

  //     // handlePackageSearch();
  //     // fetchWorkoutData();

  //     setSubmittedPackage(false);
  //     setIsPackageDialogOpen(false);

  //   } catch (err: any) {
  //     toast({
  //       title: "Error",
  //       description: err.message,
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleCreatePackage = async () => {
    // if (!validatePackage()) return;

    let packageID = "";
    let keyFieldHeader = "";

    try {
      const packagePayload = {
        package_Name: packageForm.name,
        package_type: packageForm.packageType,
        duration_days: packageForm.duration_days,
        price: packageForm.price,
        features: packageForm.features,
        discount_percentage: packageForm.discountPercentage,
        is_active: packageForm.isActive ? "Active" : "Close",
        Company_code: companyCode,
        Location_code: locationCode,
        created_by: userCode,
      };

      // ============================================
      // INSERT PACKAGE HEADER
      // ============================================
      const response = await fetch(`${BASE_URL}/PackageInsertData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packagePayload),
      });

      const result = await response.json();


      // Save values for rollback
      const packageID = result.PackageID;

      setPackageForm((prev) => ({
        ...prev,
        id: packageID,
      }));

      if (!response.ok) {
        throw new Error(result.message || "Package insert failed.");
      }


      // ============================================
      // INSERT PACKAGE DETAILS
      // ============================================
      for (let i = 0; i < packageForm.associatedPrograms.length; i++) {
        const item = packageForm.associatedPrograms[i];
        if (!item.programId) continue;

        const detailResponse = await fetch(
          `${BASE_URL}/PackageDetailsInsertData`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Sno: i + 1,
              package_ID: packageID,
              Program_ID: item.programId,
              Company_Code: companyCode,
              Location_Code: locationCode,
              created_by: userCode,
            }),
          }
        );

        const detailResult = await detailResponse.json();

        if (!detailResponse.ok) {
          throw new Error(
            detailResult.message || "Package Details insert failed."
          );
        }
      }

      // ============================================
      // SUCCESS
      // ============================================
      toast({
        title: "Package Added",
        description: "Workout Package Added Successfully",
        variant: "success",
      });

      // handlePackageSearch();
      // fetchWorkoutData();

      setSubmittedPackage(false);
      setIsPackageDialogOpen(false);
    } catch (err: any) {
      // ============================================
      // ROLLBACK
      // ============================================
      if (packageID) {
        try {
          await fetch(`${BASE_URL}/PackageDeleteData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package_ID: packageID,
              Company_code: companyCode,
              Location_code: locationCode,
              modified_by: userCode,
            }),
          });
        } catch (rollbackError) {
          console.error("Rollback Failed:", rollbackError);
        }
      }

      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handlePackageSearch = async () => {
  try {
    const response = await fetch(`${BASE_URL}/PackageSearchData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_ID: packageSearchForm.id,
        package_Name: packageSearchForm.name,
        package_type: packageSearchForm.packageType,
        duration_days: packageSearchForm.durationDays,
        price: packageSearchForm.price,
        features: packageSearchForm.features,
        discount_percentage: packageSearchForm.discountPercentage,
        is_active: packageSearchForm.isActive,
        program_id: packageSearchForm.associatedProgram,
        Company_Code: companyCode,
        Location_Code: locationCode,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const formattedPackages = data.map((pkg: any) => ({
  ...pkg,
  Programs: pkg.Programs
    ? pkg.Programs.split(",")
    : [],
}));

      setPackages(formattedPackages);
    } else if (response.status === 404) {
      setPackages([]);

      toast({
        title: "Data Not Found",
        description: data?.message || "No matching packages found.",
        variant: "destructive",
      });
    } else {
      setPackages([]);

      toast({
        title: "Search Failed",
        description: data?.message || "Something went wrong while searching.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Search Error:", error);

    setPackages([]);

    toast({
      title: "Server Error",
      description:
        error?.message ||
        "Unable to connect to the server. Please try again later.",
      variant: "destructive",
    });
  }
};

  const handleDeletePackage = (pkg: any) => {

  showConfirmToast({
    title: "Delete Package",
    description: `Are you sure you want to delete "${pkg.package_Name}"?`,
    onConfirm: () => deletePackage(pkg),
  });

};

  const deletePackage = async (pkg: any) => {

  try {

    // ----------------------------------
    // Delete Package Details
    // ----------------------------------

    await fetch(`${BASE_URL}/PackageDetailsDeleteData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        company_code: companyCode,
        location_code: locationCode,
        modified_by: userCode,
        updatemode: "D",
      },
      body: JSON.stringify({
        KeyFieldHeaders: [pkg.KeyField],
      }),
    });

    // ----------------------------------
    // Delete Package Header
    // ----------------------------------

    const response = await fetch(`${BASE_URL}/PackageDeleteData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_ID: pkg.package_ID,
        Company_Code: companyCode,
        Location_Code: locationCode,
        KeyField: pkg.KeyField,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Delete failed");
    }

    // ----------------------------------
    // Remove from UI
    // ----------------------------------

    setPackages((prev: any) =>
      prev.filter((item: any) => item.KeyField !== pkg.KeyField)
    );

    // ----------------------------------
    // Refresh Data
    // ----------------------------------

    handlePackageSearch();
    fetchWorkoutData();

    toast({
      title: "Package Deleted",
      description: "Workout Package deleted successfully.",
      variant: "success",
    });

  } catch (error: any) {

    console.error(error);

    toast({
      title: "Delete Failed",
      description: error.message || "Something went wrong.",
      variant: "destructive",
    });

  }

};

  const addExerciseField = () => {
    setProgramForm({
      ...programForm,
      exercises: [...programForm.exercises, { name: "", sets: 3, reps: 10 }],
    });
  };

  const updateExercise = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newExercises = [...programForm.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setProgramForm({ ...programForm, exercises: newExercises });
  };

  const filteredPackages = packages.filter((p: any) => {
  const search = searchTerm.toLowerCase();

  return (
    (p.package_ID ?? "").toLowerCase().includes(search) ||
    (p.package_Name ?? "").toLowerCase().includes(search) ||
    (p.package_type ?? "").toLowerCase().includes(search) ||
    (p.features ?? "").toLowerCase().includes(search) ||
    (p.Programs ?? []).join(", ").toLowerCase().includes(search)
  );
});

  // const filteredPackages = packages.filter(
  //   (p) =>
  //     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     p.programName.toLowerCase().includes(searchTerm.toLowerCase())
  //   //  || p.facultyName.toLowerCase().includes(searchTerm.toLowerCase()),
  // );

  const removeExerciseField = (indexToRemove: number) => {
    // Prevent deleting if it's the only row left, keeping at least 1 row active
    if (programForm.exercises.length <= 1) {
      setProgramForm({
        ...programForm,
        exercises: [{ name: "", sets: 3, reps: 10 }],
      });
      return;
    }

    setProgramForm({
      ...programForm,
      exercises: programForm.exercises.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  // MemberShip CRUD Functions
  const handleAddMemberShip = () => {
    setEditingMemberShip(null);
    fetchPackages();
    setMemberShipForm({
      MemberShipType_id: "",
      MemberShipType_Name: "",
      Status: true,
      Sno: "",
      PackageIDName: [
      {
        package_ID: "",
      },
      ],
      Keyfield: "",
    });
    setIsMemberShipDialogOpen(true);
  };

  const handleEditMemberShip = (MemberShip: any) => {
    setEditingMemberShip(MemberShip);
    // console.log(Trainer);

    setMemberShipForm({
      MemberShipType_id: MemberShip.MemberShipType_id,
      MemberShipType_Name: MemberShip.MemberShipType_Name,
      Status: MemberShip.Status,
      Sno: MemberShip.Sno,
      PackageIDName: MemberShip.package_ID,
      Keyfield: MemberShip.Keyfield,
    });

    setIsMemberShipDialogOpen(true);
  };

  const validateMemberShip = () => {
    if (
      !MemberShipForm.MemberShipType_Name ||
      // !MemberShipForm.Sno ||
      !MemberShipForm.PackageIDName
    ) {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveMemberShip = async () => {
    if (editingMemberShip) {
      // await handleUpdateMemberShip();
    } else {
      await handleCreateMemberShip();
    }
  };

  const handleCreateMemberShip = async () => {
  // setSubmittedMemberShips(true);
  if (!validateMemberShip()) return;

  try {
    // ======================================
    // 1. SAVE HEADER
    // ======================================

    const hdrResponse = await fetch(
      `${BASE_URL}/MemberShipTypeHdrInsert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MemberShipType_id: "",
          MemberShipType_Name: MemberShipForm.MemberShipType_Name,
          Status: MemberShipForm.Status ? "Active" : "Close",
          Company_code: companyCode,
          Location_code: locationCode,
          Keyfield: "",
          created_by: userCode,
          modified_by: "",
        }),
      }
    );

    const hdrData = await hdrResponse.json();

    if (!hdrResponse.ok || !hdrData.success) {
      throw new Error(
        hdrData.message || "Unable to save Membership Type."
      );
    }

    // Generated Membership Type ID
    const generatedMemberShipTypeID =
      hdrData.MemberShipType_id;

    // ======================================
    // 2. SAVE DETAILS
    // ======================================

    for (const item of MemberShipForm.PackageIDName) {
      await fetch(
        `${BASE_URL}/MemberShipTypeDetailsInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_ID: item.package_ID,
            Company_code: companyCode,
            Location_code: locationCode,
            MemberShipType_id: generatedMemberShipTypeID,
            Keyfield_header: "",
            Keyfield: "",
            created_by: userCode,
            UpdateMode: "UI",
          }),
        }
      );
    }

    // ======================================
    // SUCCESS
    // ======================================

    setSubmittedMemberShips(false);
    setIsMemberShipDialogOpen(false);

    // Reset Form
    setMemberShipForm({
      MemberShipType_id: "",
      MemberShipType_Name: "",
      Status: true,
      Sno: "",
      PackageIDName: [
        {
          package_ID: "",
        },
      ],
      Keyfield: "",
    });

    toast({
      title: "Membership Type Added",
      description: "Membership Type Added Successfully",
      variant: "success",
    });

    // Refresh Grid / Cards
    // handleMemberShipSearch();
    // getMemberShipCardData();

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

const addPackageField = () => {
    setMemberShipForm({
      ...MemberShipForm,
      PackageIDName: [
        ...MemberShipForm.PackageIDName,
        {
          package_ID: "",
        },
      ],
    });
  };

  const updatePackages = (index: number, value: string) => {
    const updatedPackages = [...MemberShipForm.PackageIDName];

    updatedPackages[index].package_ID = value;

    setMemberShipForm({
      ...MemberShipForm,
      PackageIDName: updatedPackages,
    });
  };

  const removePackageField = (index: number) => {
    if (MemberShipForm.PackageIDName.length === 1) {
      setMemberShipForm({
        ...MemberShipForm,
        PackageIDName: [
          {
            package_ID: "",
          },
        ],
      });
      return;
    }

    const updatedPackages = MemberShipForm.PackageIDName.filter(
      (_, i) => i !== index
    );

    setMemberShipForm({
      ...MemberShipForm,
      PackageIDName: updatedPackages,
    });
  };

  const handleMemberShipSearch = async () => {
  try {
    const response = await fetch(`${BASE_URL}/membershipSearchData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MemberShipType_id: MemberShipSearchForm.MemberShipType_id,
        MemberShipType_Name: MemberShipSearchForm.MemberShipType_Name,
        Status: MemberShipSearchForm.Status,
        package_ID: MemberShipSearchForm.package_ID,
        Company_code: companyCode,
        Location_code: locationCode,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const formattedPackages = data.map((pkg: any) => ({
  ...pkg,
  Programs: pkg.Programs
    ? pkg.Programs.split(",")
    : [],
}));

      setMemberShips(formattedPackages);
    } else if (response.status === 404) {
      setMemberShips([]);

      toast({
        title: "Data Not Found",
        description: data?.message || "No matching packages found.",
        variant: "destructive",
      });
    } else {
      setMemberShips([]);

      toast({
        title: "Search Failed",
        description: data?.message || "Something went wrong while searching.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Search Error:", error);

    setPackages([]);

    toast({
      title: "Server Error",
      description:
        error?.message ||
        "Unable to connect to the server. Please try again later.",
      variant: "destructive",
    });
  }
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
                maxLength={30}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    id: e.target.value,
                  })
                }
              />
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
                maxLength={100}
                value={programSearchForm.name}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setProgramSearchForm({ ...programSearchForm, name: value });
                }}
              />
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
                <Select
                  value={programSearchForm.category}
                  onValueChange={(value) =>
                    setProgramSearchForm({
                      ...programSearchForm,
                      category: value,
                    })
                  }
                >
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
                <Select
                  value={programSearchForm.difficultyLevel}
                  onValueChange={(value) =>
                    setProgramSearchForm({
                      ...programSearchForm,
                      difficultyLevel: value,
                    })
                  }
                >
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
                maxLength={250}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    goals: e.target.value,
                  })
                }
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
                maxLength={250}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    description: e.target.value,
                  })
                }
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Description</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* <div className="space-y-2">
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
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="faculty">Assigned Faculty</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={programSearchForm.assignedFaculty}
                  onValueChange={(value) =>
                    setProgramSearchForm({
                      ...programSearchForm,
                      assignedFaculty: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assigned Faculty" />
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
                  onValueChange={(value) =>
                    setProgramSearchForm({
                      ...programSearchForm,
                      isActive: value,
                    })
                  }
                >
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
                maxLength={20}
                value={programSearchForm.durationPerSession}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    durationPerSession: e.target.value,
                  })
                }
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
                inputMode="numeric"
                maxLength={1}
                placeholder="Enter Sessions Per Week"
                value={programSearchForm.sessionsPerWeek}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (
                    value === "" ||
                    (Number(value) >= 1 && Number(value) <= 7)
                  ) {
                    setProgramSearchForm({
                      ...programSearchForm,
                      sessionsPerWeek: value,
                    });
                  }
                }}
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
                maxLength={50}
                value={programSearchForm.workingHours}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    workingHours: e.target.value,
                  })
                }
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
                maxLength={100}
                value={programSearchForm.exercisesName}
                onChange={(e) =>
                  setProgramSearchForm({
                    ...programSearchForm,
                    exercisesName: e.target.value,
                  })
                }
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
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={programSearchForm.exercisesCount}
                // onChange={(e) => setProgramSearchForm({ ...programSearchForm, exercisesCount: e.target.value })}
                placeholder="Enter Exercises Count"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (value === "" || Number(value) >= 1) {
                    setProgramSearchForm({
                      ...programSearchForm,
                      exercisesCount: value,
                    });
                  }
                }}
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
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={programSearchForm.exercisesReps}
                // onChange={(e) => setProgramSearchForm({ ...programSearchForm, exercisesReps: e.target.value })}
                placeholder="Enter Exercises Repetitions"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (value === "" || Number(value) >= 1) {
                    setProgramSearchForm({
                      ...programSearchForm,
                      exercisesReps: value,
                    });
                  }
                }}
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

  const renderPackageSearch = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">

    {/* Package ID */}
    <div className="space-y-2">
      <Label>Package ID</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              placeholder="Enter Package ID"
              value={packageSearchForm.id}
              maxLength={30}
              onChange={(e) =>
                setPackageSearchForm({
                  ...packageSearchForm,
                  id: e.target.value,
                })
              }
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Package ID</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Package Name */}
    <div className="space-y-2">
      <Label>Package Name</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              placeholder="Enter Package Name"
              value={packageSearchForm.name}
              maxLength={100}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-Z0-9 ]/g,
                  ""
                );

                setPackageSearchForm({
                  ...packageSearchForm,
                  name: value,
                });
              }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Package Name</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Package Type */}
    <div className="space-y-2">
      <Label>Package Type</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value={packageSearchForm.packageType}
                onValueChange={(value) =>
                  setPackageSearchForm({
                    ...packageSearchForm,
                    packageType: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Package Type" />
                </SelectTrigger>

                <SelectContent>
                  {PackageTypes.map((item: any) => (
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
            <p>Select Package Type</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Price */}
    <div className="space-y-2">
      <Label>Price</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Enter Price"
              value={packageSearchForm.price}
              onChange={(e) =>
              setPackageSearchForm({
                ...packageSearchForm,
                price: parseFloat(e.target.value) || 0,
              })
              }
              // onChange={(e) => {
              //   const value = e.target.value.replace(/[^\d.]/g, "");

              //   setPackageSearchForm({
              //     ...packageSearchForm,
              //     price: value,
              //   });
              // }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Package Price</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Discount Percentage */}
    <div className="space-y-2">
      <Label>Discount %</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder="Enter Discount %"
              value={packageSearchForm.discountPercentage}
              onChange={(e) =>
  setPackageSearchForm({
    ...packageSearchForm,
    discountPercentage: parseInt(e.target.value) || 0,
  })
}
              // onChange={(e) => {
              //   const value = e.target.value.replace(/\D/g, "");

              //   if (
              //     value === "" ||
              //     (Number(value) >= 0 && Number(value) <= 100)
              //   ) {
              //     setPackageSearchForm({
              //       ...packageSearchForm,
              //       discountPercentage: value,
              //     });
              //   }
              // }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Discount Percentage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Duration Days */}
    <div className="space-y-2">
      <Label>Duration Days</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder="Enter Duration Days"
              value={packageSearchForm.durationDays}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setPackageSearchForm({
                  ...packageSearchForm,
                  durationDays: value,
                });
              }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Duration Days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

        {/* Associated Program */}
    {/* <div className="space-y-2">
      <Label>Associated Program</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value={packageSearchForm.id}
                onValueChange={(value) =>
                  setPackageSearchForm({
                    ...packageSearchForm,
                    id: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Associated Program" />
                </SelectTrigger>

                <SelectContent>
                  {ProgramsID.map((item: any) => (
                    <SelectItem
                      key={item.ProgramID}
                      value={item.ProgramID}
                    >
                      {item.ProgramID} - {item.ProgramName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>

          <TooltipContent>
            <p>Select Associated Program</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div> */}

    {/* Features */}
    <div className="space-y-2">
      <Label>Features</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              placeholder="Enter Features"
              maxLength={250}
              value={packageSearchForm.features}
              onChange={(e) =>
                setPackageSearchForm({
                  ...packageSearchForm,
                  features: e.target.value,
                })
              }
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Status */}
    <div className="space-y-2">
      <Label>Status</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value={packageSearchForm.isActive}
                onValueChange={(value) =>
                  setPackageSearchForm({
                    ...packageSearchForm,
                    isActive: value,
                  })
                }
              >
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

  </div>
);

const renderMemberShipSearch = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">

    {/* Package ID */}
    <div className="space-y-2">
      <Label>Membership Type Name</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              placeholder="Enter Membership Type Name"
              value={MemberShipSearchForm.MemberShipType_id}
              maxLength={30}
              onChange={(e) =>
                setMemberShipSearchForm({
                  ...MemberShipSearchForm,
                  MemberShipType_id: e.target.value,
                })
              }
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Membership Type Name</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Package Name */}
    <div className="space-y-2">
      <Label>Membership Type Name</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              placeholder="Enter Membership Type Name"
              value={MemberShipSearchForm.MemberShipType_Name}
              maxLength={100}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-Z0-9 ]/g,
                  ""
                );

                setMemberShipSearchForm({
                  ...MemberShipSearchForm,
                  MemberShipType_Name: value,
                });
              }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enter Membership Type Name</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    {/* Package Type */}
    <div className="space-y-2">
      <Label>Package ID - Name</Label>

      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={MemberShipSearchForm.package_ID}
                  onValueChange={(value) =>
                    setMemberShipSearchForm({
                      ...MemberShipSearchForm,
                      package_ID: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Package ID - Name" />
                  </SelectTrigger>

                  <SelectContent>
                    {GetPackages.map((item: any) => (
                      <SelectItem
                        key={item.package_ID}
                        value={item.package_ID}
                      >
                        {item.package_ID} - {item.package_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>Select Package ID - Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>

    {/* Status */}
    <div className="space-y-2">
      <Label>Status</Label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select
                value={MemberShipSearchForm.Status}
                onValueChange={(value) =>
                  setMemberShipSearchForm({
                    ...MemberShipSearchForm,
                    Status: value,
                  })
                }
              >
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

  </div>
);

  const handleSearch = () => {
    switch (activeTab) {
      case "programs":
        handleProgramSearch();
        break;

        case "packages":
      handlePackageSearch();
      break;

        case "memberships":
      handleMemberShipSearch();
      break;

      default:
        break;
    }
  };

const handleReset = () => {
  switch (activeTab) {
    case "programs":
      setProgramSearchForm({
        id: "",
        name: "",
        description: "",
        category: "",
        difficultyLevel: "",
        durationPerSession: "",
        sessionsPerWeek: "",
        assignedFaculty: "",
        workingHours: "",
        isActive: "",
        goals: "",
        exercisesName: "",
        exercisesCount: "",
        exercisesReps: "",
      });

      setPrograms([]);
      break;

    case "packages":
      setPackageSearchForm({
        id: "",
        name: "",
        packageType: "",
        durationDays: "",
        price: 0,
        features: "",
        discountPercentage: 0,
        associatedProgram: "",
        isActive: "",
      });

      setPackages([]);
      break;

    case "memberships":
      setMemberShipSearchForm({
        MemberShipType_id: "",
        MemberShipType_Name: "",
        Status: "",
        Sno: "",
        package_ID: "",
        Keyfield: "",
      });

      setMemberShips([]);
      break;

    default:
      break;
  }
};

  const addLabels = {
    programs: "Programs",
    packages: "Packages",
    memberships: "Memberships",
  };

  //Tab Screen Mapping
  const tabScreenMap = {
    programs: "Programs",
    packages: "Packages",
    memberships: "Memberships",
  };

  const currentScreen = tabScreenMap[activeTab as keyof typeof tabScreenMap];

  const handleAdd = () => {
    switch (activeTab) {
      case "programs":
        handleAddProgram();
        break;
      case "packages":
        handleAddPackage();
        break;
      case "memberships":
        handleAddMemberShip();
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
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                onClick={() => navigate("/AdminDashboard")}
                className="flex items-center px-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline ml-2">Back to Dashboard</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Workout Programs Management
              </h1>
            </div>
            <Badge variant="secondary" className="shrink-0">
              Admin
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${stat.color} text-white mr-4`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Add */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {activeTab === "programs" && renderProgramSearch()}
            {activeTab === "packages" && renderPackageSearch()}
            {activeTab === "memberships" && renderMemberShipSearch()}

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
          <div className="flex flex-wrap items-center gap-4 mb-4 w-full">
            <div className="overflow-x-auto min-w-0 max-w-full custom-scrollbar pb-2">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max">
                {allowedTabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="ml-auto flex-shrink-0">
              {currentScreen && hasActionPermission(currentScreen, "add") && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add {addLabels[activeTab]}
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      Add {addLabels[activeTab]}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Workout Programs</CardTitle>
                <CardDescription>
                  Manage all workout programs and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {programs.map((program: any) => {
                    const isActive = program.is_active === "Active";
                    const statusBadgeColor = isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-200";

                    return (
                      <Card
                        key={program.Keyfield}
                        className="overflow-hidden border-t-4 border-t-violet-600 hover:shadow-xl transition-all duration-300 bg-white"
                      >
                        <CardContent className="p-6 space-y-5">
                          <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {program.ProgramName}
                              </h3>
                              <p className="text-xs font-mono text-gray-500 flex items-center gap-1">
                                <span className="font-semibold text-slate-700">
                                  Program ID:
                                </span>{" "}
                                {program.ProgramID || "N/A"}
                              </p>
                            </div>

                            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-gray-100">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {hasActionPermission("Programs", "edit") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                                        onClick={() => handleEditProgram(program)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TooltipTrigger>

                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {hasActionPermission("Programs", "delete") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() =>
                                          handleDeleteProgram(program)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TooltipTrigger>

                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-violet-50/40 px-4 py-2.5 rounded-lg border border-violet-50">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-violet-600" />
                              <span className="text-xs text-gray-500 font-medium">
                                Goal:
                              </span>
                              <span className="text-sm font-semibold text-slate-800">
                                {program.Goals}
                              </span>
                            </div>

                            <Badge
                              variant="outline"
                              className={`font-medium text-xs ${statusBadgeColor}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-green-500" : "bg-gray-400"}`}
                              ></span>
                              {program.is_active || "Close"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                            <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                                Category
                              </p>
                              <p
                                className="text-xs font-bold text-slate-800 truncate"
                                title={program.Category}
                              >
                                {program.Category}
                              </p>
                            </div>
                            <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                                <Dumbbell className="w-3 h-3 text-slate-400" />{" "}
                                Difficulty
                              </p>
                              <p className="text-xs font-bold text-violet-600">
                                {program.Difficulty_level}
                              </p>
                            </div>
                            <div className="space-y-0.5 px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />{" "}
                                Session / Wk
                              </p>
                              <p className="text-xs font-bold text-slate-800">
                                {program.Sessions_per_week} Sessions
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1 px-2">
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />{" "}
                              Working Hours
                            </p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                              {program.Working_hours ? (
                                (typeof program.Working_hours === "string"
                                  ? program.Working_hours.split(",")
                                  : Array.isArray(program.Working_hours)
                                    ? program.Working_hours
                                    : []
                                ).map(
                                  (timeSlot: string, idx: number) =>
                                    timeSlot.trim() && (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0 text-[10px] font-medium rounded shadow-sm"
                                      >
                                        {timeSlot.trim()}
                                      </Badge>
                                    ),
                                )
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">
                                  No Slots
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                              <Users className="w-3.5 h-3.5 mr-1.5 text-slate-500" />{" "}
                              Faculty Details
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {program.Faculty && program.Faculty.length > 0 ? (
                                program.Faculty.map(
                                  (faculty: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-xs rounded-md"
                                    >
                                      {faculty}
                                    </Badge>
                                  ),
                                )
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  No faculty assigned
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center border-b border-slate-100 pb-1.5">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />{" "}
                              Exercises Details
                            </p>

                            <div className="grid grid-cols-12 gap-2 px-3 py-1 bg-slate-100 rounded text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              <div className="col-span-6">Name</div>
                              <div className="col-span-3 text-center">
                                Count / Sets
                              </div>
                              <div className="col-span-3 text-center">Reps</div>
                            </div>

                            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                              {program.Exercises &&
                                program.Exercises.map(
                                  (exercise: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="grid grid-cols-12 gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm items-center hover:bg-slate-50 transition-colors"
                                    >
                                      <div className="col-span-6 text-xs font-medium text-slate-700 truncate">
                                        {exercise.Exercises_Name}
                                      </div>
                                      <div className="col-span-3 text-center text-xs text-slate-600 bg-slate-50 py-0.5 rounded border border-slate-100">
                                        <b className="text-slate-900">
                                          {exercise.Exercises_Count}
                                        </b>
                                      </div>
                                      <div className="col-span-3 text-center text-xs text-slate-600 bg-slate-50 py-0.5 rounded border border-slate-100">
                                        <b className="text-slate-900">
                                          {exercise.Exercises_Repetitions}
                                        </b>
                                      </div>
                                    </div>
                                  ),
                                )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Description
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100/50">
                              {program.Description ||
                                "No custom description available for this workout program."}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          {/* <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Workout Packages</CardTitle>
                <CardDescription>
                  Manage pricing packages (Monthly, Quarterly, Half-Yearly)
                </CardDescription>
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
                        <TableCell className="font-medium">
                          {pkg.name}
                        </TableCell>
                        <TableCell>
                          {getPackageTypeBadge(
                            pkg.packageType,
                            pkg.discountPercentage,
                          )}
                        </TableCell>
                        <TableCell>{pkg.durationDays} days</TableCell>
                        <TableCell className="font-semibold">
                          BHD {pkg.price}
                        </TableCell>
                        <TableCell>{pkg.programName}</TableCell>
                        
                        <TableCell>
                          {pkg.isActive ? (
                            <Badge className="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPackage(pkg)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
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
                <CardDescription>
                  Manage all workout packages and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {packages.map((pkg: any) => {
                    const isActive = pkg.is_active === "Active";

                    const statusBadgeColor = isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-200";

                    return (
                      <Card
                        key={pkg.KeyField}
                        className="overflow-hidden border-t-4 border-t-violet-600 hover:shadow-xl transition-all duration-300 bg-white"
                      >
                        <CardContent className="p-6 space-y-5">

                          {/* ================= HEADER ================= */}

                          <div className="flex justify-between items-start pb-3 border-b border-gray-100">

                            <div className="space-y-1">
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {pkg.package_Name}
                              </h3>

                              <p className="text-xs font-mono text-gray-500 flex items-center gap-1">
                                <span className="font-semibold text-slate-700">
                                  Package ID:
                                </span>

                                {pkg.package_ID || "N/A"}
                              </p>
                            </div>

                            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-gray-100">

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>

                                    {hasActionPermission("Packages", "edit") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                                        onClick={() => handleEditPackage(pkg)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    )}

                                  </TooltipTrigger>

                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>

                                    {hasActionPermission("Packages", "delete") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeletePackage(pkg)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}

                                  </TooltipTrigger>

                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                            </div>
                          </div>

                          {/* ================= PRICE + STATUS ================= */}

                          <div className="flex items-center justify-between bg-violet-50/40 px-4 py-2.5 rounded-lg border border-violet-50">

                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-violet-600" />

                              <span className="text-xs text-gray-500 font-medium">
                                Price :
                              </span>

                              <span className="text-sm font-semibold text-slate-800">
                                ₹ {pkg.price}
                              </span>
                            </div>

                            <Badge
                              variant="outline"
                              className={`font-medium text-xs ${statusBadgeColor}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-green-500" : "bg-gray-400"
                                  }`}
                              ></span>

                              {pkg.is_active || "Close"}

                            </Badge>

                          </div>
                          {/* ================= PACKAGE INFORMATION ================= */}

                          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">

                            {/* Package Type */}
                            <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                                Package Type
                              </p>

                              <p
                                className="text-xs font-bold text-slate-800 truncate"
                                title={pkg.package_type}
                              >
                                {pkg.package_type}
                              </p>
                            </div>

                            {/* Duration */}
                            <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                Duration
                              </p>

                              <p className="text-xs font-bold text-violet-600">
                                {pkg.duration_days} Days
                              </p>
                            </div>

                            {/* Discount */}
                            <div className="space-y-0.5 px-2">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                                <BadgePercent className="w-3 h-3 text-slate-400" />
                                Discount
                              </p>

                              <p className="text-xs font-bold text-green-600">
                                {pkg.discount_percentage}%
                              </p>
                            </div>

                          </div>

                          {/* ================= ASSOCIATED PROGRAMS ================= */}

                          <div className="space-y-2">

                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                              <Dumbbell className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                              Associated Programs
                            </p>

                            <div className="flex flex-wrap gap-1.5">

                              {pkg.Programs && pkg.Programs.length > 0 ? (
                                pkg.Programs.map((program: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 text-xs rounded-md"
                                  >
                                    {program}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  No Programs Assigned
                                </span>
                              )}
                            </div>

                          </div>
                          {/* ================= FEATURES ================= */}

                          <div className="space-y-2">

                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center border-b border-slate-100 pb-1.5">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                              Package Features
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {pkg.features ? (

                                pkg.features
                                  .split(",")
                                  .map((feature: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md shadow-sm"
                                    >
                                      {feature.trim()}
                                    </Badge>
                                  ))

                              ) : (

                                <span className="text-xs text-gray-400 italic">
                                  No Features Available
                                </span>

                              )}

                            </div>

                          </div>

                          {/* ================= PACKAGE SUMMARY ================= */}

                          <div className="pt-3 border-t border-gray-100">

                            <div className="grid grid-cols-2 gap-3">

                              <div className="bg-slate-50 rounded-lg border p-3">

                                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                  Created By
                                </p>

                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                  {pkg.created_by || "-"}
                                </p>

                              </div>

                              <div className="bg-slate-50 rounded-lg border p-3">

                                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                  Created Date
                                </p>

                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                  {pkg.created_date
                                    ? new Date(pkg.created_date).toLocaleDateString()
                                    : "-"}
                                </p>

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
          </TabsContent>

          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <CardTitle>Workout Memberships</CardTitle>
                <CardDescription>
                  Manage all workout Memberships and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {MemberShips.map((membership: any) => {
                    const isActive = membership.Status === "Active";
                  
                    const statusBadgeColor = isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-200";
                  
                    return (
                      <Card
                        key={membership.Keyfield}
                        className="overflow-hidden border-t-4 border-t-violet-600 hover:shadow-xl transition-all duration-300 bg-white"
                      >
                        <CardContent className="p-6 space-y-5">
                    
                          {/* ================= HEADER ================= */}
                          <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {membership.MemberShipType_Name}
                              </h3>
                              <p className="text-xs font-mono text-gray-500 flex items-center gap-1">
                                <span className="font-semibold text-slate-700">
                                  Membership ID:
                                </span>
                                {membership.MemberShipType_id || "N/A"}
                              </p>
                            </div>
                    
                            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-gray-100">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {hasActionPermission("Memberships", "edit") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                                        // onClick={() => handleEditMembership(membership)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                                  
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {hasActionPermission("Memberships", "delete") && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        // onClick={() => handleDeleteMembership(membership)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                                  
                          {/* ================= STATUS BAR ================= */}
                          <div className="flex items-center justify-between bg-violet-50/40 px-4 py-2.5 rounded-lg border border-violet-50">
                            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                              Membership Status
                            </span>
                            <Badge
                              variant="outline"
                              className={`font-medium text-xs ${statusBadgeColor}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  isActive ? "bg-green-500" : "bg-gray-400"
                                }`}
                              ></span>
                              {membership.Status || "Inactive"}
                            </Badge>
                          </div>
                              
                          {/* ================= ASSOCIATED PACKAGES (MULTIPLE DATA) ================= */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center border-b border-slate-100 pb-1.5">
                              <Dumbbell className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                              Linked Packages
                            </p>
                              
                            <div className="flex flex-wrap gap-2">
                              {membership.Packages && membership.Packages.length > 0 ? (
                                membership.Packages.map((pkg: any, index: number) => (
                                  <TooltipProvider key={pkg.package_ID || index}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="secondary"
                                          className="bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 text-xs rounded-md font-medium shadow-sm cursor-help transition-colors hover:bg-violet-100"
                                        >
                                          {pkg.package_Name}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="font-mono text-xs">ID: {pkg.package_ID}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  No Packages Linked
                                </span>
                              )}
                            </div>
                          </div>
                            
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Program Dialog */}
        <Dialog
          open={isProgramDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSubmittedPrograms(false);
            }
            setIsProgramDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Edit Program" : "Add New Program"}
              </DialogTitle>
              <DialogDescription>
                {editingProgram
                  ? "Update the workout program details"
                  : "Create a new workout program"}
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
                <h4 className="font-medium text-sm text-gray-700">
                  Program Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={
                        submittedPrograms && !programForm.name
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Program Name*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={programForm.name}
                            maxLength={100}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9 ]/g,
                                "",
                              );
                              setProgramForm({ ...programForm, name: value });
                            }}
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
                    <Label
                      htmlFor="category"
                      className={
                        submittedPrograms && !programForm.category
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Category*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={programForm.category}
                              onValueChange={(value) =>
                                setProgramForm({
                                  ...programForm,
                                  category: value,
                                })
                              }
                            >
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
                    <Label
                      htmlFor="difficulty"
                      className={
                        submittedPrograms && !programForm.difficultyLevel
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Difficulty Level*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={programForm.difficultyLevel}
                              onValueChange={(value) =>
                                setProgramForm({
                                  ...programForm,
                                  difficultyLevel: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                {difficultyLevel.map((difficultyLevel: any) => (
                                  <SelectItem
                                    key={difficultyLevel.attributedetails_name}
                                    value={
                                      difficultyLevel.attributedetails_name
                                    }
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
                            maxLength={250}
                            onChange={(e) =>
                              setProgramForm({
                                ...programForm,
                                goals: e.target.value,
                              })
                            }
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
                          maxLength={250}
                          onChange={(e) =>
                            setProgramForm({
                              ...programForm,
                              description: e.target.value,
                            })
                          }
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
                    <Label
                      htmlFor="duration"
                      className={
                        submittedPrograms && !programForm.durationPerSession
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Duration Per Session*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="duration"
                            maxLength={20}
                            value={programForm.durationPerSession}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                              setProgramForm({
                                ...programForm,
                                durationPerSession: value,
                              });
                            }}
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
                    <Label
                      htmlFor="sessions"
                      className={
                        submittedPrograms && !programForm.sessionsPerWeek
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Sessions Per Week*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="sessions"
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={programForm.sessionsPerWeek}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");

                              if (
                                value === "" ||
                                (Number(value) >= 1 && Number(value) <= 7)
                              ) {
                                setProgramForm({
                                  ...programForm,
                                  sessionsPerWeek: value,
                                });
                              }
                            }}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Sessions Per Week</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="workingHours"
                      className={
                        submittedPrograms && !programForm.workingHours
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Working Hours*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="workingHours"
                            maxLength={50}
                            value={programForm.workingHours}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^a-zA-Z0-9\s,:-]/g, "");
                              setProgramForm({
                                ...programForm,
                                workingHours: value,
                              });
                            }}
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
                  <Label
                    htmlFor="faculty"
                    className={
                      submittedPrograms &&
                        programForm.assignedFaculty.length === 0
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Assigned Faculty*
                  </Label>
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
                  <h4
                    className={`font-medium text-sm text-gray-700 ${submittedPrograms &&
                      programForm.exercises.some(
                        (e) => !e.name.trim() || !e.sets || !e.reps,
                      )
                      ? "text-red-500"
                      : "text-gray-700"
                      }`}
                  >
                    Exercises*
                  </h4>
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
                                maxLength={100}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                                  updateExercise(index, "name", value);
                                }}
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
                                type="text"
                                placeholder="Sets"
                                maxLength={2}
                                value={exercise.sets === 0 ? "" : exercise.sets}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );

                                  updateExercise(
                                    index,
                                    "sets",
                                    value === "" ? 0 : parseInt(value, 10),
                                  );
                                }}
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
                                  type="text"
                                  placeholder="Reps"
                                  maxLength={2}
                                  value={
                                    exercise.reps === 0 ? "" : exercise.reps
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      "",
                                    ); // Allow only digits

                                    updateExercise(
                                      index,
                                      "reps",
                                      value === "" ? 0 : parseInt(value, 10),
                                    );
                                  }}
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
                  onCheckedChange={(checked) =>
                    setProgramForm({ ...programForm, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active Program</Label>
              </div>
            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsProgramDialogOpen(false);
                        setSubmittedPrograms(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Cancel without saving changes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSaveProgram}>
                      {editingProgram ? "Update" : "Create"} Program
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingProgram ? "Update program" : "Create a program"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Package Dialog */}
        <Dialog
          open={isPackageDialogOpen}
          onOpenChange={setIsPackageDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Add New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update the package details"
                  : "Create a new workout package"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Package ID</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="name"
                          value={packageForm.id}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                          // onChange={(e) => setPackageForm({ ...packageForm, id: e.target.value })}
                          placeholder="Auto Generated"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Package ID is Auto Generated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {/* Package Details */}
              <div className="space-y-2">
                <Label htmlFor="pkgName" className={ submittedPackage && !packageForm.name ? "text-red-500" : "" }>
                Package Name*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="pkgName"
                        value={packageForm.name}
                        onChange={(e) =>
                          setPackageForm({ ...packageForm, name: e.target.value })
                        }
                        placeholder="e.g., Weight Loss - Monthly"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Package Name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="pkgType" className={ submittedPackage && !packageForm.packageType ? "text-red-500" : "" } >
                    Package Type*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={packageForm.packageType}
                            onValueChange={(value) =>
                              setPackageForm({
                                ...packageForm,
                                packageType: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Package Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PackageTypes.map((PackageTypes: any) => (
                                <SelectItem
                                  key={PackageTypes.attributedetails_name}
                                  value={
                                    PackageTypes.attributedetails_name
                                  }
                                >
                                  {PackageTypes.attributedetails_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Select Package Type</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="price" className={ submittedPackage && !packageForm.price ? "text-red-500": "" }>
                  Price*</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          value={packageForm.price}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Price </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount %</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="discount"
                          min={0}
                          max={100}
                          value={packageForm.discountPercentage}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              discountPercentage: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Discount %</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pkgdays" className={ submittedPackage && !packageForm.duration_days ? "text-red-500": "" }>Duration Days*</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="pkgDays"
                          min={0}
                          max={100}
                          value={packageForm.duration_days}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              duration_days: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Duration Days"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Duration Days</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>

              {/* <div className="space-y-2">
                  <Label htmlFor="program">Associated Program</Label>
                  <Select
                    value={packageForm.programId}
                    onValueChange={(value) =>
                      setPackageForm({ ...packageForm, programId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

              {/* Associated Program */}
              {/* <div className="space-y-2">
                  <Label
                    htmlFor="program"
                    className={
                      submittedPackage && !packageForm.programId
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Associated Program
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={packageForm.programId}
                            onValueChange={(value) =>
                              setPackageForm({
                                ...packageForm,
                                programId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Package Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ProgramsID.map((ProgramsID: any) => (
                                <SelectItem
                                  key={ProgramsID.ProgramID}
                                  value={
                                    ProgramsID.ProgramID
                                  }
                                >
                                  {ProgramsID.ProgramID}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Select Package Type</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div> */}

              {/* <div className="space-y-2">
                <Label
                  htmlFor="program"
                  className={
                    submittedPackage && packageForm.programId.length === 0
                      ? "text-red-500"
                      : ""
                  }
                >
                  Associated Program*
                </Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ReactMultiSelect
                          options={programOptions}
                          value={packageForm.programId}
                          placeholder="Select Associated Program"
                          onChange={(selected) =>
                            setPackageForm({
                              ...packageForm,
                              programId: selected,
                            })
                          }
                        />
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Associated Program</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div> */}

              <div className="space-y-4">
                <Label className={ submittedPackage && packageForm.associatedPrograms.some((p) => !p.programId) ? "text-red-500" : "" } >
                  Associated Program*
                </Label>

                {packageForm.associatedPrograms.map((program, index) => (
                  <div key={index} className="flex items-center gap-3">

                    <div className="flex-1">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Select
            value={program.programId}
            onValueChange={(value) =>
              updatePrograms(index, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>

            <SelectContent>
              {ProgramsID.map((item: any) => (
                <SelectItem
                  key={item.ProgramID}
                  value={item.ProgramID}
                >
                  {item.ProgramID} - {item.ProgramName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TooltipTrigger>

      <TooltipContent>
        <p>Select Associated Program</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={addProgramField}
                      className="h-9 w-9 text-blue-600 hover:bg-blue-50 border"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProgramField(index)}
                      className="h-9 w-9 text-red-500 hover:bg-red-50 border"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Textarea
                        id="features"
                        value={packageForm.features}
                        onChange={(e) =>
                          setPackageForm({ ...packageForm, features: e.target.value })
                        }
                        placeholder="e.g., Personalized diet plan, Weekly check-ins, Full gym access"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Features (comma-separated)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="pkgActive"
                  checked={packageForm.isActive}
                  onCheckedChange={(checked) =>
                    setPackageForm({ ...packageForm, isActive: checked })
                  }
                />
                <Label htmlFor="pkgActive">Active Package</Label>
              </div>

            </div>

            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsPackageDialogOpen(false)}
              >
                Cancel
              </Button>
              </TooltipTrigger>

                  <TooltipContent>
                    <p>Cancel without saving changes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <Button
                onClick={handleSavePackage}
              >
                {editingPackage ? "Update" : "Create"} Package
              </Button>
              </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingProgram ? "Update Package" : "Create a Package"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit MemberShip Dialog */}
        <Dialog
          open={isMemberShipDialogOpen}
          onOpenChange={setIsMemberShipDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Membership" : "Add New Membership"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update the Membership details"
                  : "Create a new workout Membership"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Membership ID</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="name"
                          value={MemberShipForm.MemberShipType_id}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                          // onChange={(e) => setPackageForm({ ...packageForm, id: e.target.value })}
                          placeholder="Auto Generated"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Membership ID is Auto Generated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-2">
                <Label htmlFor="pkgName">Membership Type Name</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="pkgName"
                        value={MemberShipForm.MemberShipType_Name}
                        onChange={(e) =>
                          setMemberShipForm({ ...MemberShipForm, MemberShipType_Name: e.target.value })
                        }
                        placeholder="e.g., Weight Loss - Monthly"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Membership Type Name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-4">
                <Label
                  className={
                    submittedPackage &&
                      MemberShipForm.PackageIDName.some((p) => !p.package_ID)
                      ? "text-red-500"
                      : ""
                  }
                >
                  Package ID - Name
                </Label>

                {MemberShipForm.PackageIDName.map((program, index) => (
                  <div key={index} className="flex items-center gap-3">

                    <div className="flex-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Select
                                value={program.package_ID}
                                onValueChange={(value) =>
                                  updatePackages(index, value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Package ID - Name" />
                                </SelectTrigger>
                              
                                <SelectContent>
                                  {GetPackages.map((item: any) => (
                                    <SelectItem
                                      key={item.package_ID}
                                      value={item.package_ID}
                                    >
                                      {item.package_ID} - {item.package_Name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>
                                
                          <TooltipContent>
                            <p>Select Package ID - Name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={addPackageField}
                      className="h-9 w-9 text-blue-600 hover:bg-blue-50 border"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePackageField(index)}
                      className="h-9 w-9 text-red-500 hover:bg-red-50 border"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="pkgActive"
                  checked={MemberShipForm.Status}
                  onCheckedChange={(checked) =>
                    setMemberShipForm({ ...MemberShipForm, Status: checked })
                  }
                />
                <Label htmlFor="pkgActive">Active</Label>
              </div>

            </div>

            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsPackageDialogOpen(false)}
              >
                Cancel
              </Button>
              </TooltipTrigger>

                  <TooltipContent>
                    <p>Cancel without saving changes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
              <Button
                onClick={handleSaveMemberShip}
              >
                {editingPackage ? "Update" : "Create"} Membership
              </Button>
              </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingProgram ? "Update Package" : "Create a Package"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default WorkoutProgramManagement;
