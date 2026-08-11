import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Utensils,
  Flame,
  Target,
  Clock,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Minus,
  Search,
  RotateCcw,
} from "lucide-react";
import { BASE_URL } from "../ApiConfig";
import { useCompany } from "../CompanyContext";
import { Switch } from "@/components/ui/switch";
import ReactMultiSelect, {
  MultiSelectOption,
} from "@/components/ui/react-multi-select";
import { showConfirmToast } from "../../components/ui/show-confirm-toast";
import { useToast } from "@/hooks/use-toast";
import { hasActionPermission } from "@/utils/permission";
import Loading from "@/components/Loading";
import ReactSingleSelect, {
  SingleSelectOption,
} from "@/components/ui/react-single-select";

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

interface PlanDetails {
  Essentials: string;
  Daily_Calories_Target: string;
  Duration: string;
}

interface PlanMeals {
  Meal_Type: string;
  Meal_Name: string;
  Quantity: string;
  Calories: string;
  Protein: string;
  Carbs: string;
  Fats: string;
  Time_Slot: string;
}

interface WorkoutDietPlan {
  DietPlanID: string;
  Diet_Name: string;
  Category: string;
  Description: string;
  Goals: string;
  Restrictions: string;
  TrainerID: string;
  Is_Active: string;
  DietPlanDetails: PlanDetails[];
  DietPlanMeals: PlanMeals[];
  Calories: string;
  Protein: string;
  Fats: string;
  Carbs: string;
  TotalDuration: string;
  AssignedMembers: string;
  KeyField: string;
  createdDate: string;
}

const DietPlanManagement = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutDietPlan | null>(null);

  // Const - Needed
  const { companyCode, locationCode, userCode } = useCompany();
  // For loading
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // For cards data - Backend
  const [dietPlanCards, setDietPlanCards] = useState({
    TotalPlans: 0,
    MembersOnPlans: 0,
    AvgCalories: 0,
    ActivePlans: 0,
  });

  const [numberGeneration, setNumberGeneration] = useState("Auto");

  useEffect(() => {
    const getSettingData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getSettingScreenData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Company_code: companyCode,
            Location_code: locationCode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch setting data");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setNumberGeneration(data[0].NumberGeneration || "Auto");
        } else {
          setNumberGeneration("Auto");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setNumberGeneration("Auto");
      }
    };

    if (companyCode && locationCode) {
      getSettingData();
    }
  }, [companyCode, locationCode]);

  // DietPlan Dialog States
  const [dietPlans, setDietPlans] = useState<WorkoutDietPlan[]>([]);
  const [submittedDietPlans, setSubmittedDietPlans] = useState(false);
  const [isDietPlanDialogOpen, setIsDietPlanDialogOpen] = useState(false);
  const [editingDietPlan, setEditingDietPlan] =
    useState<WorkoutDietPlan | null>(null);
  const [DietPlanForm, setDietPlanForm] = useState({
    DietPlanID: "",
    Diet_Name: "",
    Category: "",
    Description: "",
    Goals: "",
    Restrictions: "",
    TrainerID: [] as MultiSelectOption[],
    Is_Active: true,
    PlanDetails: [{ Essentials: "", Daily_Calories_Target: "", Duration: "" }],
    PlanMeals: [
      {
        Meal_Type: "",
        Meal_Name: "",
        Quantity: "",
        Calories: "",
        Protein: "",
        Carbs: "",
        Fats: "",
        Time_Slot: "",
      },
    ],
    KeyField: "",
  });

  const [DietPlanSearchForm, setDietPlanSearchForm] = useState({
    DietPlanID: "",
    Diet_Name: "",
    Category: "",
    Description: "",
    Goals: "",
    Restrictions: "",
    TrainerID: "",
    Is_Active: "",
    Keyfield: "",
  });

  //

  // Const - Dropdowns
  const [MealTypeDrop, setMealTypeDrop] = useState<any[]>([]);
  const [EssentialsDrop, setEssentialsDrop] = useState<any[]>([]);
  const [DurationDrop, setDurationDrop] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);

  // Const - duplicate rows - Meals
  const [mealRows, setMealRows] = useState([
    {
      Meal_Type: "",
      Meal_Name: "",
      Quantity: "",
      Calories: "",
      Protein: "",
      Carbs: "",
      Fats: "",
      Time_Slot: "",
    },
  ]);

  const addMealRow = () => {
    setMealRows([
      ...mealRows,
      {
        Meal_Type: "",
        Meal_Name: "",
        Quantity: "",
        Calories: "",
        Protein: "",
        Carbs: "",
        Fats: "",
        Time_Slot: "",
      },
    ]);
  };

  // Clear Inputs for search screen
  const handleReset = () => {
    setDietPlanSearchForm({
      DietPlanID: "",
      Diet_Name: "",
      Category: "",
      Description: "",
      Goals: "",
      Restrictions: "",
      TrainerID: "",
      Is_Active: "",
      Keyfield: "",
    });
    setDietPlans([]);
  };

  const removeMealRow = (index: number) => {
    if (mealRows.length === 1) return;

    setMealRows(mealRows.filter((_, i) => i !== index));
  };

  const updateMealRow = (index: number, field: string, value: string) => {
    const updatedRows = [...mealRows];

    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };

    setMealRows(updatedRows);
  };

  // Const - duplicate rows - Details
  const [dietPlanDetails, setDietPlanDetails] = useState([
    {
      Essentials: "",
      Daily_Calories_Target: "",
      Duration: "",
    },
  ]);

  const updateDietPlanDetail = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...dietPlanDetails];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setDietPlanDetails(updated);
  };

  const addDietPlanDetail = () => {
    setDietPlanDetails([
      ...dietPlanDetails,
      {
        Essentials: "",
        Daily_Calories_Target: "",
        Duration: "",
      },
    ]);
  };

  const removeDietPlanDetail = (index: number) => {
    if (dietPlanDetails.length === 1) return;

    setDietPlanDetails(dietPlanDetails.filter((_, i) => i !== index));
  };

  // Dropdown Functions
  const fetchMealType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMealType`, {
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
        setMealTypeDrop(data);
      } else {
        console.error("Failed to fetch difficulty levels");
      }
    } catch (error) {
      console.error("Error fetching difficulty levels:", error);
    }
  };

  const mealTypeOptions: SingleSelectOption[] = MealTypeDrop.map((item: any) => ({
    value: item.attributedetails_code,
    label: item.attributedetails_name,
  }));

  const fetchEssentials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getEssentials`, {
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
        setEssentialsDrop(data);
      } else {
        console.error("Failed to fetch difficulty levels");
      }
    } catch (error) {
      console.error("Error fetching difficulty levels:", error);
    }
  };

  const essentialsOptions: SingleSelectOption[] = EssentialsDrop.map((item: any) => ({
    value: item.attributedetails_code,
    label: item.attributedetails_name,
  }));

  const fetchDuration = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDuration`, {
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
        setDurationDrop(data);
      } else {
        console.error("Failed to fetch difficulty levels");
      }
    } catch (error) {
      console.error("Error fetching difficulty levels:", error);
    }
  };

  const durationOptions: SingleSelectOption[] = DurationDrop.map((item: any) => ({
    value: item.attributedetails_code,
    label: item.attributedetails_name,
  }));

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

  const trainersOptions: SingleSelectOption[] = trainers.map((item: any) => ({
    value: item.TrainerID,
    label: `${item.TrainerID} - ${item.FullName}`,
  }));

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

  const statusOptions: SingleSelectOption[] = status.map((item: any) => ({
    value: item.attributedetails_name,
    label: item.attributedetails_name,
  }));

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchMealType(),
        fetchEssentials(),
        fetchDuration(),
        fetchTrainers(),
        fetchStatus(),
        getDietPlanCardData(),
      ]);
    };

    loadData();
  }, []);

  const getMacroTotal = (plan: DietPlan) => {
    const { breakfast, lunch, dinner, snacks } = plan.meals;
    return {
      protein:
        breakfast.protein + lunch.protein + dinner.protein + snacks.protein,
      carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs,
      fats: breakfast.fats + lunch.fats + dinner.fats + snacks.fats,
    };
  };

  const trainerIDs = DietPlanForm.TrainerID.map(
    (trainer) => trainer.value,
  ).join(",");

  const handleAddDietPlan = () => {
    setEditingDietPlan(null);
    setDietPlanForm({
      DietPlanID: "",
      Diet_Name: "",
      Category: "",
      Description: "",
      Goals: "",
      Restrictions: "",
      TrainerID: [] as MultiSelectOption[],
      Is_Active: true,
      PlanDetails: [
        { Essentials: "", Daily_Calories_Target: "", Duration: "" },
      ],
      PlanMeals: [
        {
          Meal_Type: "",
          Meal_Name: "",
          Quantity: "",
          Calories: "",
          Protein: "",
          Carbs: "",
          Fats: "",
          Time_Slot: "",
        },
      ],
      KeyField: "",
    });

    setDietPlanDetails([
      {
        Essentials: "",
        Daily_Calories_Target: "",
        Duration: "",
      },
    ]);

    setMealRows([
      {
        Meal_Type: "",
        Meal_Name: "",
        Quantity: "",
        Calories: "",
        Protein: "",
        Carbs: "",
        Fats: "",
        Time_Slot: "",
      },
    ]);
    setIsDietPlanDialogOpen(true);
  };

  const handleSaveDietPlan = async () => {
    if (editingDietPlan) {
      await handleUpdateDietPlan();
    } else {
      await handleCreateDietPlan();
    }
  };

  const validateDietPlan = () => {
    const hasInvalidDetails = dietPlanDetails.some(
      (detail) =>
        !detail.Essentials.trim() ||
        !detail.Daily_Calories_Target.trim() ||
        !detail.Duration.trim(),
    );

    const hasInvalidMeals = mealRows.some(
      (meal) =>
        !meal.Meal_Type.trim() ||
        !meal.Meal_Name.trim() ||
        !meal.Quantity.trim() ||
        !meal.Calories.trim() ||
        !meal.Protein.trim() ||
        !meal.Carbs.trim() ||
        !meal.Fats.trim() ||
        !meal.Time_Slot.trim(),
    );

    if (
      !DietPlanForm.Diet_Name.trim() ||
      !DietPlanForm.Category.trim() ||
      !DietPlanForm.Goals.trim() ||
      DietPlanForm.TrainerID.length === 0 ||
      hasInvalidDetails ||
      hasInvalidMeals
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

  const handleCreateDietPlan = async () => {
    setSubmittedDietPlans(true);

    if (!validateDietPlan()) return;

    setLoading(true);
    try {
      const currentDate = new Date().toISOString();

      // ====================================================
      // 1. SAVE HEADER
      // ====================================================
      const hdrResponse = await fetch(`${BASE_URL}/Diet_Plans_hdrInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DietPlanID: DietPlanForm.DietPlanID,
          Diet_Name: DietPlanForm.Diet_Name,
          Category: DietPlanForm.Category,
          Description: DietPlanForm.Description,
          Duration: "1 Month",
          Goals: DietPlanForm.Goals,
          Restrictions: DietPlanForm.Restrictions,
          Meals: "Lunch",
          TrainerID: trainerIDs,
          Is_Active: DietPlanForm.Is_Active ? "Active" : "Close",
          KeyField: "",
          Location_Code: locationCode,

          company_code: companyCode,
          created_by: userCode,
        }),
      });

      const hdrData = await hdrResponse.json();

      if (!hdrResponse.ok || !hdrData.success) {
        throw new Error(hdrData.message || "Unable to save Diet Plan Header.");
      }

      // Generated ID from SP
      const generatedDietPlanID = hdrData.DietPlanID;

      // ====================================================
      // 2. SAVE DETAILS
      // ====================================================

      for (const detail of dietPlanDetails) {
        await fetch(`${BASE_URL}/Diet_Plans_DetailsInsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DietPlanID: generatedDietPlanID,
            Essentials: detail.Essentials,
            Daily_Calories_Target: detail.Daily_Calories_Target,
            Duration: detail.Duration,
            KeyField: "",
            Location_Code: locationCode,
            company_code: companyCode,
            created_by: userCode,
            UpdateMode: "UI",
          }),
        });
      }

      // ====================================================
      // 3. SAVE MEALS
      // ====================================================

      for (const meal of mealRows) {
        await fetch(`${BASE_URL}/Diet_Plans_MealsInsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DietPlanID: generatedDietPlanID,
            Meal_Type: meal.Meal_Type,
            Meal_Name: meal.Meal_Name,
            Quantity: meal.Quantity,
            Calories: meal.Calories,
            Protein: meal.Protein,
            Carbs: meal.Carbs,
            Fats: meal.Fats,
            Time_Slot: meal.Time_Slot,
            KeyField: "",
            Location_Code: locationCode,

            company_code: companyCode,
            created_by: userCode,
            modified_by: userCode,
            created_date: currentDate,
            modified_date: currentDate,
            UpdateMode: "UI",
          }),
        });
      }

      // ====================================================
      // SUCCESS
      // ====================================================

      setIsDietPlanDialogOpen(false);

      setSubmittedDietPlans(false);

      // Reset Header Form
      setDietPlanForm({
        DietPlanID: "",
        Diet_Name: "",
        Category: "",
        Description: "",
        Goals: "",
        Restrictions: "",
        TrainerID: [] as MultiSelectOption[],
        Is_Active: true,
        PlanDetails: [
          {
            Essentials: "",
            Daily_Calories_Target: "",
            Duration: "",
          },
        ],
        PlanMeals: [
          {
            Meal_Type: "",
            Meal_Name: "",
            Quantity: "",
            Calories: "",
            Protein: "",
            Carbs: "",
            Fats: "",
            Time_Slot: "",
          },
        ],
        KeyField: "",
      });

      // Reset Detail Rows
      setDietPlanDetails([
        {
          Essentials: "",
          Daily_Calories_Target: "",
          Duration: "",
        },
      ]);

      // Reset Meal Rows
      setMealRows([
        {
          Meal_Type: "",
          Meal_Name: "",
          Quantity: "",
          Calories: "",
          Protein: "",
          Carbs: "",
          Fats: "",
          Time_Slot: "",
        },
      ]);

      toast({
        title: "Diet Plan Added",
        description: "Diet Plan Added Successfully",
        variant: "success",
      });

      handleDietPlanSearch(); // Refresh the list after deletion
      getDietPlanCardData();
      setSubmittedDietPlans(false);
      setIsDietPlanDialogOpen(false);

      // Optional
      // getDietPlans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDietPlan = async (plan: WorkoutDietPlan) => {
    setLoading(true);
    try {
      const detailsResponse = await fetch(
        `${BASE_URL}/Diet_Plans_DetailsSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DietPlanID: plan.DietPlanID,
            company_code: companyCode,
            Location_Code: locationCode,
          }),
        },
      );

      const detailsResult = await detailsResponse.json();

      const mealsResponse = await fetch(`${BASE_URL}/Diet_Plans_MealsSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DietPlanID: plan.DietPlanID,
          company_code: companyCode,
          Location_Code: locationCode,
        }),
      });

      const mealsResult = await mealsResponse.json();
      console.log("Header", plan);
      console.log("Details", detailsResult);
      console.log("Meals", mealsResult);
      const viewData = {
        ...plan,
        DietPlanDetails: detailsResult,
        DietPlanMeals: mealsResult,
      };

      console.log("Selected Plan", viewData);

      setSelectedPlan(viewData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDietPlan = async (plan: any) => {
    setLoading(true);
    setEditingDietPlan(plan);

    // Convert Trainer IDs into MultiSelect format
    const selectedTrainers =
      plan.TrainerID?.split(",")
        .map((id: string) => {
          const trainer = trainerOptions.find(
            (t: any) => t.value === id.trim(),
          );

          return trainer ?? null;
        })
        .filter(Boolean) || [];

    console.log(plan);

    // Header
    setDietPlanForm({
      DietPlanID: plan.DietPlanID,
      Diet_Name: plan.Diet_Name,
      Category: plan.Category,
      Description: plan.Description,
      Goals: plan.Goals,
      Restrictions: plan.Restrictions,
      TrainerID: selectedTrainers,
      Is_Active: plan.Is_Active === "Active",

      PlanDetails: plan.DietPlanDetails ?? [
        {
          Essentials: "",
          Daily_Calories_Target: "",
          Duration: "",
        },
      ],

      PlanMeals: plan.DietPlanMeals ?? [
        {
          Meal_Type: "",
          Meal_Name: "",
          Quantity: "",
          Calories: "",
          Protein: "",
          Carbs: "",
          Fats: "",
          Time_Slot: "",
        },
      ],

      KeyField: plan.KeyField,
    });

    const detailResponse = await fetch(`${BASE_URL}/Diet_Plans_DetailsSearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        DietPlanID: plan.DietPlanID,
        company_code: companyCode,
        Location_Code: locationCode,
      }),
    });

    const details = await detailResponse.json();

    setDietPlanDetails(details);

    const mealResponse = await fetch(`${BASE_URL}/Diet_Plans_MealsSearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        DietPlanID: plan.DietPlanID,
        company_code: companyCode,
        Location_Code: locationCode,
      }),
    });

    const meals = await mealResponse.json();

    setMealRows(meals);

    // Open Dialog
    setIsDietPlanDialogOpen(true);
    setLoading(false);
  };

  const handleUpdateDietPlan = () => {
    showConfirmToast({
      title: "Update Diet Plan",
      description: "Do you want to update these changes?",
      onConfirm: updateDietPlan,
    });
  };

  const updateDietPlan = async () => {
    if (!editingDietPlan) return;

    setSubmittedDietPlans(true);

    if (!validateDietPlan()) return;

    setLoading(true);
    try {
      const currentDate = new Date().toISOString();

      // Trainer IDs only
      const trainerIds = DietPlanForm.TrainerID.map(
        (trainer) => trainer.value,
      ).join(",");

      const headerPayload = {
        DietPlanID: DietPlanForm.DietPlanID,
        Diet_Name: DietPlanForm.Diet_Name,
        Category: DietPlanForm.Category,
        Description: DietPlanForm.Description,
        Goals: DietPlanForm.Goals,
        Restrictions: DietPlanForm.Restrictions,
        TrainerID: trainerIds,
        Is_Active: DietPlanForm.Is_Active ? "Active" : "Close",
        KeyField: DietPlanForm.KeyField,
        Location_Code: locationCode,
        company_code: companyCode,
        modified_by: userCode,
      };

      // =====================================================
      // 1. UPDATE HEADER
      // =====================================================

      const response = await fetch(`${BASE_URL}/Diet_Plans_hdrUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(headerPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Diet Plan update failed.");
      }

      // =====================================================
      // 2. DELETE EXISTING DETAILS
      // =====================================================

      const detailDelete = await fetch(`${BASE_URL}/Diet_Plans_DetailsDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sno: 0,
          DietPlanID: DietPlanForm.DietPlanID,
          KeyField: editingDietPlan.KeyField,
          Location_Code: locationCode,
          company_code: companyCode,
          modified_by: userCode,
          updatemode: "UD",
        }),
      });

      const detailDeleteResult = await detailDelete.json();

      if (!detailDelete.ok || !detailDeleteResult.success) {
        throw new Error(
          detailDeleteResult.message || "Failed to delete diet plan details.",
        );
      }

      // =====================================================
      // 3. INSERT DETAILS AGAIN
      // =====================================================

      for (const detail of dietPlanDetails) {
        const detailInsert = await fetch(
          `${BASE_URL}/Diet_Plans_DetailsInsert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              DietPlanID: DietPlanForm.DietPlanID,
              Essentials: detail.Essentials,
              Daily_Calories_Target: detail.Daily_Calories_Target,
              Duration: detail.Duration,
              KeyField: "",
              Location_Code: locationCode,
              company_code: companyCode,
              created_by: userCode,
              UpdateMode: "UI",
            }),
          },
        );

        const detailInsertResult = await detailInsert.json();

        if (!detailInsert.ok || !detailInsertResult.success) {
          throw new Error(
            detailInsertResult.message ||
            "Failed while inserting diet plan details.",
          );
        }
      }

      // =====================================================
      // 4. DELETE EXISTING MEALS
      // =====================================================

      const mealDelete = await fetch(`${BASE_URL}/Diet_Plans_MealsDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sno: 0,
          DietPlanID: DietPlanForm.DietPlanID,
          KeyField: DietPlanForm.KeyField,
          Location_Code: locationCode,
          company_code: companyCode,
          modified_by: userCode,
          updatemode: "UD",
        }),
      });

      const mealDeleteResult = await mealDelete.json();

      if (!mealDelete.ok || !mealDeleteResult.success) {
        throw new Error(
          mealDeleteResult.message || "Failed to delete diet plan meals.",
        );
      }

      // =====================================================
      // 5. INSERT MEALS AGAIN
      // =====================================================

      for (const meal of mealRows) {
        const mealInsert = await fetch(`${BASE_URL}/Diet_Plans_MealsInsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DietPlanID: DietPlanForm.DietPlanID,
            Meal_Type: meal.Meal_Type,
            Meal_Name: meal.Meal_Name,
            Quantity: meal.Quantity,
            Calories: meal.Calories,
            Protein: meal.Protein,
            Carbs: meal.Carbs,
            Fats: meal.Fats,
            Time_Slot: meal.Time_Slot,
            KeyField: "",
            Location_Code: locationCode,

            company_code: companyCode,

            created_by: userCode,
            modified_by: userCode,

            created_date: currentDate,
            modified_date: currentDate,
            UpdateMode: "UI",
          }),
        });

        const mealInsertResult = await mealInsert.json();

        if (!mealInsert.ok || !mealInsertResult.success) {
          throw new Error(
            mealInsertResult.message ||
            "Failed while inserting diet plan meals.",
          );
        }
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      toast({
        title: "Diet Plan Updated",
        description: "Diet Plan Updated Successfully",
        variant: "success",
      });

      // Reload data
      // getDietPlans();
      handleDietPlanSearch();
      getDietPlanCardData();
      setSubmittedDietPlans(false);
      setIsDietPlanDialogOpen(false);
      setEditingDietPlan(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDietPlan = (dietPlan: any) => {
    showConfirmToast({
      title: "Delete Diet Plan",
      description: `Are you sure you want to delete "${dietPlan.Diet_Name}"?`,
      onConfirm: () => deleteDietPlan(dietPlan),
    });
  };

  const deleteDietPlan = async (dietPlan: any) => {
    setLoading(true);
    try {
      // ============================================
      // 1. DELETE DIET PLAN MEALS
      // ============================================

      const mealResponse = await fetch(`${BASE_URL}/Diet_Plans_MealsDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sno: 0,
          DietPlanID: dietPlan.DietPlanID,
          KeyField: dietPlan.KeyField,
          Location_Code: locationCode,
          company_code: companyCode,
          modified_by: userCode,
          updatemode: "UD",
        }),
      });

      const mealResult = await mealResponse.json();

      if (!mealResponse.ok || !mealResult.success) {
        throw new Error(
          mealResult.message || "Failed to delete diet plan meals.",
        );
      }

      // ============================================
      // 2. DELETE DIET PLAN DETAILS
      // ============================================

      const detailResponse = await fetch(
        `${BASE_URL}/Diet_Plans_DetailsDelete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Sno: 0,
            DietPlanID: dietPlan.DietPlanID,
            KeyField: dietPlan.KeyField,
            Location_Code: locationCode,
            company_code: companyCode,
            modified_by: userCode,
            updatemode: "UD",
          }),
        },
      );

      const detailResult = await detailResponse.json();

      if (!detailResponse.ok || !detailResult.success) {
        throw new Error(
          detailResult.message || "Failed to delete diet plan details.",
        );
      }

      // ============================================
      // 3. DELETE DIET PLAN HEADER
      // ============================================

      const headerResponse = await fetch(`${BASE_URL}/Diet_Plans_hdrDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DietPlanID: dietPlan.DietPlanID,
          KeyField: dietPlan.KeyField,
          Location_Code: locationCode,
          company_code: companyCode,
          modified_by: userCode,
        }),
      });

      const headerResult = await headerResponse.json();

      if (!headerResponse.ok || !headerResult.success) {
        throw new Error(headerResult.message || "Failed to delete diet plan.");
      }

      // ============================================
      // REMOVE FROM UI
      // ============================================

      setDietPlans((prev) =>
        prev.filter((item) => item.KeyField !== dietPlan.Keyfield),
      );

      handleDietPlanSearch(); // Refresh the list after deletion
      getDietPlanCardData();
      // Refresh Data
      // getDietPlans();

      toast({
        title: "Diet Plan Deleted",
        description: "Diet Plan deleted successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Delete Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDietPlanSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/dietPlanSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DietPlanID: DietPlanSearchForm.DietPlanID,
          Diet_Name: DietPlanSearchForm.Diet_Name,
          Category: DietPlanSearchForm.Category,
          Description: DietPlanSearchForm.Description,
          Goals: DietPlanSearchForm.Goals,
          Restrictions: DietPlanSearchForm.Restrictions,
          TrainerID: DietPlanSearchForm.TrainerID,
          Is_Active: DietPlanSearchForm.Is_Active,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDietPlans(data);
      } else if (response.status === 404) {
        setDietPlans([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching Diet Plans found.",
          variant: "destructive",
        });
      } else {
        setDietPlans([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setDietPlans([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDietPlanCardData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDietPlanCardData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDietPlanCards(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loading />}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                onClick={() => navigate("/AdminDashboard")}
                className="flex items-center px-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Diet Plan Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Badge variant="secondary">Admin</Badge> */}
              <Tooltip>
                <TooltipTrigger asChild>
                  {hasActionPermission("AdminDietPlans", "add") && (
                    <Button
                      className="shrink-0 px-2 sm:px-4"
                      onClick={handleAddDietPlan}
                    >
                      <Plus className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add Diet Plan</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>Add Diet Plan</TooltipContent>
              </Tooltip>
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dietPlanCards.TotalPlans}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Members on Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dietPlanCards.MembersOnPlans}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Calories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(dietPlanCards.AvgCalories)}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dietPlanCards.ActivePlans}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Diet Plan ID</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Diet Plan ID"
                        value={DietPlanSearchForm.DietPlanID}
                        maxLength={30}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            DietPlanID: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Diet Plan ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Plan Name</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Plan Name"
                        value={DietPlanSearchForm.Diet_Name}
                        maxLength={100}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            Diet_Name: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Plan Name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Category"
                        value={DietPlanSearchForm.Category}
                        maxLength={40}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            Category: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Category</p>
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
                        value={DietPlanSearchForm.Description}
                        maxLength={255}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            Description: e.target.value,
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

              <div className="space-y-2">
                <Label>Goals</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Goals"
                        value={DietPlanSearchForm.Goals}
                        maxLength={250}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            Goals: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Goals</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Dietary Restrictions"
                        value={DietPlanSearchForm.Restrictions}
                        maxLength={250}
                        onChange={(e) =>
                          setDietPlanSearchForm({
                            ...DietPlanSearchForm,
                            Restrictions: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Dietary Restrictions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">Trainer ID - Name</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ReactSingleSelect
                          options={trainersOptions}
                          value={
                            trainersOptions.find(
                              (option) => option.value === DietPlanSearchForm.TrainerID
                            ) || null
                          }
                          onChange={(selected) => {
                            setDietPlanSearchForm({
                              ...DietPlanSearchForm,
                              TrainerID: selected?.value || "",
                            });
                          }}
                          placeholder="Select Trainer ID - Name"
                        />
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Trainer ID - Name</p>
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
                        <ReactSingleSelect
                          options={statusOptions}
                          value={
                            statusOptions.find(
                              (option) => option.value === DietPlanSearchForm.Is_Active
                            ) || null
                          }
                          onChange={(selected) => {
                            setDietPlanSearchForm({
                              ...DietPlanSearchForm,
                              Is_Active: selected?.value || "",
                            });
                          }}
                          placeholder="Select Status"
                        />
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="col-span-full flex justify-end gap-4 mt-6">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full"
                        onClick={handleDietPlanSearch}
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
            </div>
          </CardContent>
        </Card>

        {/* Diet Plans Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>
              Create and manage nutrition programs for members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dietPlans.map((plan) => {
                return (
                  <Card
                    key={plan.DietPlanID}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6 h-[550px] flex flex-col justify-between">
                      {/* Scrollable Content Wrapper with Custom Scrollbar */}
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {plan.Diet_Name}
                              </h3>
                              <Badge
                                variant={
                                  plan.Is_Active === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {plan.Is_Active}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Plan ID: {plan.DietPlanID}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Category:
                              </p>
                            <Badge variant="outline" className="mb-2">
                              {plan.Category}
                            </Badge>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Training By:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {plan.TrainerID?.split(",").map(
                                  (goal, index) => {
                                    const trainer = trainers.find(
                                      (item: any) =>
                                        item.TrainerID === goal.trim(),
                                    );

                                    return (
                                      <Badge key={index} variant="outline">
                                        {trainer
                                          ? `${trainer.TrainerID} - ${trainer.FullName}`
                                          : goal.trim()}
                                      </Badge>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {hasActionPermission(
                                    "AdminDietPlans",
                                    "edit",
                                  ) && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditDietPlan(plan)}
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
                                  {hasActionPermission(
                                    "AdminDietPlans",
                                    "edit",
                                  ) && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteDietPlan(plan)}
                                        className="text-red-500 hover:text-red-700"
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

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {plan.Description}
                        </p>

                        <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Calories</p>
                            <p className="font-bold text-orange-600">
                              {plan.Calories}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Protein</p>
                            <p className="font-bold text-red-600">
                              {plan.Protein}g
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Carbs</p>
                            <p className="font-bold text-blue-600">
                              {plan.Carbs}g
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Fats</p>
                            <p className="font-bold text-yellow-600">
                              {plan.Fats}g
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {plan.TotalDuration} Weeks
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {plan.AssignedMembers} Members
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Goals:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {plan.Goals?.split(",").map((goal, index) => (
                              <Badge key={index} variant="outline">
                                {goal.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Dietary Tags:
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {plan.Restrictions?.split(",").map(
                              (restriction: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {restriction.trim()}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fixed Bottom Button */}
                      <div className="pt-4 mt-2 border-t">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleViewDietPlan(plan)}
                        >
                          View Full Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Diet Plans Add */}
        <Dialog
          open={isDietPlanDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSubmittedDietPlans(false);
            }
            setIsDietPlanDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDietPlan ? "Update Diet Plan" : "Create New Diet Plan"}
              </DialogTitle>
              <DialogDescription>
                {editingDietPlan
                  ? "Update diet plan information."
                  : "Design a comprehensive nutrition plan for members."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Faculty Assignment */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dietPlanId">Diet Plan ID</Label>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="dietPlanId"
                          value={DietPlanForm.DietPlanID}
                          readOnly={
                            !!editingDietPlan || numberGeneration === "Auto"
                          }
                          className={
                            !!editingDietPlan || numberGeneration === "Auto"
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }
                          placeholder={
                            numberGeneration === "Auto"
                              ? "Auto Generated"
                              : "Enter Diet Plan ID"
                          }
                          maxLength={20}
                          onChange={(e) => {
                            if (
                              !editingDietPlan &&
                              numberGeneration === "Manual"
                            ) {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9]/g,
                                "",
                              );
                              setDietPlanForm({
                                ...DietPlanForm,
                                DietPlanID: value,
                              });
                            }
                          }}
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>
                          {!!editingDietPlan
                            ? "Diet Plan ID cannot be edited"
                            : numberGeneration === "Auto"
                              ? "Diet Plan ID is Auto Generated"
                              : "Enter Diet Plan ID"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className={
                      submittedDietPlans && !DietPlanForm.Diet_Name
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Plan Name*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="Email"
                          maxLength={100}
                          value={DietPlanForm.Diet_Name}
                          onChange={(e) =>
                            setDietPlanForm({
                              ...DietPlanForm,
                              Diet_Name: e.target.value,
                            })
                          }
                          placeholder="e.g., Plan Name"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Plan Name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className={
                      submittedDietPlans && !DietPlanForm.Category
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Category*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="Email"
                          maxLength={40}
                          value={DietPlanForm.Category}
                          onChange={(e) =>
                            setDietPlanForm({
                              ...DietPlanForm,
                              Category: e.target.value,
                            })
                          }
                          placeholder="e.g., Weight Loss, Muscle Gain, etc."
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter Category</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Textarea
                        id="Email"
                        maxLength={255}
                        rows={3}
                        value={DietPlanForm.Description}
                        onChange={(e) =>
                          setDietPlanForm({
                            ...DietPlanForm,
                            Description: e.target.value,
                          })
                        }
                        placeholder="e.g., Detailed description of the diet plan..."
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Description</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={
                    submittedDietPlans && !DietPlanForm.Goals
                      ? "text-red-500"
                      : ""
                  }
                >
                  Goals* (comma-separated)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="Email"
                        maxLength={250}
                        value={DietPlanForm.Goals}
                        onChange={(e) =>
                          setDietPlanForm({
                            ...DietPlanForm,
                            Goals: e.target.value,
                          })
                        }
                        placeholder="e.g., Lose weight, Build muscle, etc"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Goals</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions (comma-separated)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="Email"
                        maxLength={250}
                        value={DietPlanForm.Restrictions}
                        onChange={(e) =>
                          setDietPlanForm({
                            ...DietPlanForm,
                            Restrictions: e.target.value,
                          })
                        }
                        placeholder="e.g., Vegetarian, Gluten-free, etc."
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Dietary Restrictions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className={
                      submittedDietPlans && DietPlanForm.TrainerID.length === 0
                        ? "text-red-500"
                        : ""
                    }
                  >
                    Trainer ID - Name*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <ReactMultiSelect
                            options={trainerOptions}
                            value={DietPlanForm.TrainerID}
                            placeholder="Select Trainer ID - Name"
                            onChange={(selected) =>
                              setDietPlanForm({
                                ...DietPlanForm,
                                TrainerID: selected,
                              })
                            }
                          />
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Select Trainer ID - Name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-gray-700">
                  Diet Plan Details
                </h4>
              </div>

              <div className="space-y-3">
                {dietPlanDetails.map((PlanDetails, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-gray-50/50 sm:bg-transparent"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1">
                      {/* Essentials Dropdown */}
                      <div className="space-y-2">
                        <Label
                          className={
                            submittedDietPlans && !PlanDetails.Essentials
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Essentials*
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <ReactSingleSelect
                                  options={essentialsOptions}
                                  value={
                                    essentialsOptions.find(
                                      (option) => option.value === PlanDetails.Essentials
                                    ) || null
                                  }
                                  onChange={(selected) =>
                                    updateDietPlanDetail(
                                      index,
                                      "Essentials",
                                      selected?.value || ""
                                    )
                                  }
                                  placeholder="Select Essentials"
                                />
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Select Essentials</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Daily Calories Target Input */}
                      <div className="space-y-2">
                        <Label
                          className={
                            submittedDietPlans &&
                              !PlanDetails.Daily_Calories_Target
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Daily Calories Target*
                        </Label>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="e.g. 2000"
                                maxLength={6}
                                value={PlanDetails.Daily_Calories_Target}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );

                                  updateDietPlanDetail(
                                    index,
                                    "Daily_Calories_Target",
                                    value,
                                  );
                                }}
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Daily Calories Target</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Duration Dropdown */}
                      <div className="space-y-2">
                        <Label
                          className={
                            submittedDietPlans && !PlanDetails.Duration
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Duration (Week)*
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <ReactSingleSelect
                                  options={durationOptions}
                                  value={
                                    durationOptions.find(
                                      (option) => option.value === PlanDetails.Duration
                                    ) || null
                                  }
                                  onChange={(selected) =>
                                    updateDietPlanDetail(
                                      index,
                                      "Duration",
                                      selected?.value || ""
                                    )
                                  }
                                  placeholder="Select Duration"
                                />
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Select Duration</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 pt-1 sm:pt-0">
                      {/* Add */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={addDietPlanDetail}
                        className="h-9 w-9 text-blue-600 hover:bg-blue-50 border rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      {/* Remove */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDietPlanDetail(index)}
                        className="h-9 w-9 text-red-500 hover:bg-red-50 border rounded-md"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h4 className="font-medium text-sm text-gray-700">
              Diet Plan Meals
            </h4>

            <div className="space-y-4">
              {mealRows.map((meal, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Meal Type */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Meal_Type
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Meal Type*
                      </Label>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <ReactSingleSelect
                                options={mealTypeOptions}
                                value={
                                  mealTypeOptions.find(
                                    (option) => option.value === meal.Meal_Type
                                  ) || null
                                }
                                onChange={(selected) =>
                                  updateMealRow(
                                    index,
                                    "Meal_Type",
                                    selected?.value || ""
                                  )
                                }
                                placeholder="e.g. Breakfast"
                              />
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Select Meal Type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Meal Name */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Meal_Name
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Meal Name*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              value={meal.Meal_Name}
                              placeholder="e.g. Fruits"
                              maxLength={100}
                              onChange={(e) =>
                                updateMealRow(
                                  index,
                                  "Meal_Name",
                                  e.target.value,
                                )
                              }
                              className="bg-white w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Meal Name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Quantity
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Quantity*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={meal.Quantity}
                              placeholder="e.g. 3 counts"
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Numbers only

                                updateMealRow(index, "Quantity", value);
                              }}
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Quantity</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Calories */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Calories
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Calories*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={meal.Calories}
                              placeholder="e.g. 200"
                              maxLength={5}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Numbers only

                                updateMealRow(index, "Calories", value);
                              }}
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Calories</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Protein */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Protein
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Protein*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={meal.Protein}
                              placeholder="e.g. 200"
                              maxLength={5}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Numbers only

                                updateMealRow(index, "Protein", value);
                              }}
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Protein</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Carbs
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Carbs*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={meal.Carbs}
                              placeholder="e.g. 200"
                              maxLength={5}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Numbers only

                                updateMealRow(index, "Carbs", value);
                              }}
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Carbs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Fats */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Fats ? "text-red-500" : ""
                        }
                      >
                        Fats*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={meal.Fats}
                              placeholder="e.g. 200"
                              maxLength={5}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Numbers only

                                updateMealRow(index, "Fats", value);
                              }}
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Fats</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Time Slot */}
                    <div className="space-y-2">
                      <Label
                        className={
                          submittedDietPlans && !meal.Time_Slot
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Time Slot*
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              value={meal.Time_Slot}
                              maxLength={50}
                              placeholder="2PM - 6PM"
                              onChange={(e) =>
                                updateMealRow(
                                  index,
                                  "Time_Slot",
                                  e.target.value,
                                )
                              }
                              className="w-full"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Time Slot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 pt-1 sm:pt-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMealRow}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMealRow(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={DietPlanForm.Is_Active}
                onCheckedChange={(checked) =>
                  setDietPlanForm({ ...DietPlanForm, Is_Active: checked })
                }
              />
              <Label htmlFor="isActive">Active Diet Plan</Label>
            </div>

            <div className="flex justify-end gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmittedDietPlans(false);
                        setIsDietPlanDialogOpen(false);
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
                    <Button onClick={handleSaveDietPlan}>
                      {editingDietPlan ? "Update Plan" : "Create Plan"}
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>{editingDietPlan ? "Update Plan" : "Create Plan"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!selectedPlan}
          onOpenChange={() => setSelectedPlan(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPlan.Diet_Name}</DialogTitle>
                  <DialogDescription>
                    Diet Plan ID: {selectedPlan.DietPlanID}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Header Summary Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedPlan.Diet_Name}
                      </h2>
                      <Badge
                        variant={
                          String(selectedPlan.Is_Active) === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className="mt-2"
                      >
                        {String(selectedPlan.Is_Active)}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {selectedPlan.Category}
                      </Badge>
                    </div>
                  </div>

                  {/* Core Information Stack (One by One) */}
                  <div className="flex flex-col gap-6">
                    {/* Overview Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                          Overview & Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          <span className="font-medium">Description:</span>{" "}
                          {selectedPlan.Description}
                        </p>
                        <p>
                          <span className="font-medium">Goals:</span>{" "}
                          {selectedPlan.Goals}
                        </p>
                        <p>
                          <span className="font-medium">Restrictions:</span>{" "}
                          {selectedPlan.Restrictions}
                        </p>
                        <p>
                          <span className="font-medium">Trainer ID:</span>{" "}
                          {selectedPlan.TrainerID?.split(",")
                            .map((id: string) => {
                              const trainer = trainers.find(
                                (item: any) => item.TrainerID === id.trim(),
                              );

                              return trainer
                                ? `${trainer.TrainerID} - ${trainer.FullName}`
                                : id.trim();
                            })
                            .join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Assigned Members:</span>{" "}
                          {selectedPlan.AssignedMembers}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Diet Plan Details Stack */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1 normal-case tracking-wider">
                        Diet Plan Details
                      </h3>
                      <div className="flex flex-col gap-4">
                        {selectedPlan.DietPlanDetails?.map((detail, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xs font-medium text-gray-400">
                                Phase {index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p>
                                <span className="font-medium">Essentials:</span>{" "}
                                {detail.Essentials}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Daily Calories Target:
                                </span>{" "}
                                {detail.Daily_Calories_Target}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Duration (Weeks):
                                </span>{" "}
                                {detail.Duration}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Meals Stack */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1 normal-case tracking-wider">
                        Meals Schedule
                      </h3>
                      <div className="flex flex-col gap-4">
                        {selectedPlan.DietPlanMeals?.map((meal, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                              <CardTitle className="text-sm font-bold text-gray-800">
                                {meal.Meal_Name}
                              </CardTitle>
                              <Badge variant="secondary">
                                {meal.Meal_Type}
                              </Badge>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p>
                                <span className="font-medium">Time Slot:</span>{" "}
                                {meal.Time_Slot}
                              </p>
                              <p>
                                <span className="font-medium">Quantity:</span>{" "}
                                {meal.Quantity}
                              </p>
                              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-gray-100 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Calories:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {meal.Calories}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Protein:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {meal.Protein}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Carbs:</span>{" "}
                                  <span className="font-medium">
                                    {meal.Carbs}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Fats:</span>{" "}
                                  <span className="font-medium">
                                    {meal.Fats}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPlan(null)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DietPlanManagement;
