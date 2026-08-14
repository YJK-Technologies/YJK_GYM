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
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Mail,
  Search,
  RotateCcw,
  Phone,
  Clock,
  Award,
  Users,
  Eye,
  EyeOff,
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
import { BASE_URL } from "../ApiConfig";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "../ImageUpload";
import { showConfirmToast } from "../../components/ui/show-confirm-toast";
import { Switch } from "@/components/ui/switch";
import { useCompany } from "../CompanyContext";
import { hasActionPermission } from "@/utils/permission";
import Loading from "@/components/Loading";
import ReactSingleSelect, {
  SingleSelectOption,
} from "@/components/ui/react-single-select";

const FacultyManagement = () => {
  const navigate = useNavigate();
  const { companyCode, locationCode, userCode } = useCompany();
  // For loading
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const [TrainerImages, setTrainerImages] = useState<(string | null)[]>([
    null,
    null,
  ]);

  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);

  const bufferToBase64 = (buffer: number[], mimeType: string = "image/png") => {
    let binary = "";

    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return `data:${mimeType};base64,${window.btoa(binary)}`;
  };

  //Trainer Dialog States
  const [gender, setGender] = useState<any[]>([]);

  const [submittedTrainer, setSubmittedTrainer] = useState(false);
  const [Trainers, setTrainers] = useState([]);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const [isTrainerDialogOpen, setIsTrainerDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<any[]>([]);
  const [trainerCardData, setTrainerCardData] = useState({
    TotalTrainers: 0,
    assignedMembers: 0,
    AvgExperience: 0,
    ActiveTrainers: 0,
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

  const [TrainerForm, setTrainerForm] = useState({
    company_code: "",
    Location_Code: "",
    TrainerID: "",
    KeyField: "",
    FullName: "",
    Email: "",
    Password: "",
    DOB: "",
    Gender: "",
    Mobile: "",
    Experience: "",
    Certifications: "",
    Specializations: "",
    WorkingSchedule: "",
    Biography: "",
    Is_Active: "Close",
    created_by: "",
    modified_by: "",
  });

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof TrainerForm,
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);

    setTrainerForm({
      ...TrainerForm,
      [field]: value,
    });
  };

  // Trainer
  const handleTrainerFiles = async (files: (File | null)[]) => {
    const convertedImages = await Promise.all(
      files.map((file, index) => {
        return new Promise<string | null>((resolve) => {
          // Keep existing image if no new file is selected
          if (!file) {
            resolve(TrainerImages[index] ?? null);
            return;
          }

          const reader = new FileReader();

          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };

          reader.onerror = () => resolve(null);

          reader.readAsDataURL(file);
        });
      }),
    );

    setTrainerImages(convertedImages);
  };

  //Trainers Search States
  const [TrainersSearchForm, setTrainersSearchForm] = useState({
    company_code: companyCode,
    Location_Code: locationCode,
    TrainerID: "",
    FullName: "",
    Email: "",
    age_from: "",
    age_to: "",
    DOB: "",
    Mobile: "",
    experience_from: "",
    experience_to: "",
    Experience: "",
    Gender: "",
    Specializations: "",
    WorkingSchedule: "",
    Is_Active: "",
  });

  // Gender DropDown
  const fetchGender = async () => {
    try {
      const response = await fetch(`${BASE_URL}/gender`, {
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
        setGender(data);
      } else {
        console.error("Failed to fetch gender");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const genderOptions: SingleSelectOption[] = gender.map((item: any) => ({
    value: item.attributedetails_code,
    label: item.attributedetails_name,
  }));

  // Status DropDown
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
      await Promise.all([fetchGender(), fetchStatus()]);
    };

    loadData();
  }, []);

  useEffect(() => {
    // handleTrainerSearch();
    getTrainerCardData();
  }, []);

  //Trainer CRUD Functions
  const handleAddTrainer = () => {
    setEditingTrainer(null);
    setTrainerForm({
      company_code: companyCode,
      Location_Code: locationCode,
      TrainerID: "",
      KeyField: "",
      FullName: "",
      Email: "",
      Password: "",
      DOB: "",
      Gender: "",
      Mobile: "",
      Experience: "",
      Certifications: "",
      Specializations: "",
      WorkingSchedule: "",
      Biography: "",
      Is_Active: "Active",
      created_by: userCode,
      modified_by: userCode,
    });
    setTrainerImages([null]);
    setIsTrainerDialogOpen(true);
  };

  const validateTrainer = () => {
    if (
      !TrainerForm.company_code ||
      !TrainerForm.FullName ||
      !TrainerForm.Email ||
      !TrainerForm.Password ||
      !TrainerForm.DOB ||
      !TrainerForm.Gender ||
      !TrainerForm.Mobile ||
      !TrainerForm.Experience ||
      !TrainerForm.Specializations ||
      !TrainerForm.WorkingSchedule
    ) {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(TrainerForm.Email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (Number(TrainerForm.Experience) <= 0) {
      toast({
        title: "Invalid Experience",
        description: "Experience must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const isValidPhoneNumber = (Mobile: string) => {
    return /^\d{8,15}$/.test(Mobile);
  };

  const handleCreateTrainer = async () => {
    setSubmittedTrainer(true);

    if (!validateTrainer()) return;

    if (!isValidPhoneNumber(TrainerForm.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description:
          "Mobile number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!TrainerForm.Password || TrainerForm.Password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must contain at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(TrainerForm).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      TrainerImages.forEach((img, index) => {
        if (!img) return;

        // Extract mime type from base64 string
        const mimeType = img.match(/data:(.*?);base64/)?.[1] || "image/png";

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0),
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        // Generate extension based on mime type
        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          formData.append("Photo", blob, `Photo.${extension}`);
        }
      });

      const response = await fetch(`${BASE_URL}/GYM_TrainerInsert`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const trainerID = data.TrainerID;

      if (!response.ok) {
        throw new Error(data.message || "Trainer insert failed.");
      }

      setTrainerForm((prev) => ({
        ...prev,
        TrainerID: trainerID,
      }));

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Trainer created successfully.",
          variant: "success",
        });

        setIsTrainerDialogOpen(false);
        setSubmittedTrainer(false);

        handleTrainerSearch();
        getTrainerCardData();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create Trainer.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrainer = () => {
    showConfirmToast({
      title: "Update Trainer",
      description: "Do you want to update these changes?",
      onConfirm: updateTrainer,
    });
  };

  const updateTrainer = async () => {
    setSubmittedTrainer(true);

    if (!validateTrainer()) return;

    if (!isValidPhoneNumber(TrainerForm.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description:
          "Mobile number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!TrainerForm.Password || TrainerForm.Password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must contain at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(TrainerForm).forEach(([key, value]) => {
        if (key === "super_admin") {
          formData.append("super_admin", value ? "Yes" : "No");
        } else {
          formData.append(key, String(value ?? ""));
        }
      });

      TrainerImages.forEach((img, index) => {
        if (!img) return;

        const mimeType = img.match(/data:(.*?);base64/)?.[1] || "image/png";

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0),
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          formData.append("Photo", blob, `Photo.${extension}`);
        }
      });

      const response = await fetch(`${BASE_URL}/GYM_TrainerUpdate`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Trainer updated successfully.",
          variant: "success",
        });

        setEditingTrainer(null);
        setIsTrainerDialogOpen(false);
        setSubmittedTrainer(false);

        handleTrainerSearch();
        getTrainerCardData();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update Trainer.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error(err);

      toast({
        title: "Server Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = (trainer: any) => {
    showConfirmToast({
      title: "Delete Trainer",
      description: `Are you sure you want to delete ${trainer.FullName}?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/GYM_TrainerDelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              company_code: companyCode,
              Location_Code: locationCode,
              TrainerID: trainer.TrainerID,
              KeyField: trainer.KeyField,
              modified_by: userCode,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            toast({
              title: "Success",
              description: data.message || "Trainer deleted successfully.",
              variant: "success",
            });

            handleTrainerSearch();
            getTrainerCardData();
          } else {
            toast({
              title: "Error",
              description: data.message || "Failed to delete trainer.",
              variant: "destructive",
            });
          }
        } catch (err: any) {
          console.error(err);

          toast({
            title: "Server Error",
            description: err.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSaveTrainer = async () => {
    if (editingTrainer) {
      await handleUpdateTrainer();
    } else {
      await handleCreateTrainer();
    }
  };

  // For search form validation - Email
  const validateSearchEmail = () => {
    if (!TrainersSearchForm.Email) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(TrainersSearchForm.Email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleTrainerSearch = async () => {
    if (!validateSearchEmail()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/getTrainerSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
          Location_Code: locationCode,
          TrainerID: TrainersSearchForm.TrainerID,
          FullName: TrainersSearchForm.FullName,
          Email: TrainersSearchForm.Email,
          DOB: TrainersSearchForm.DOB,
          Gender: TrainersSearchForm.Gender,
          Mobile: TrainersSearchForm.Mobile,
          Experience: TrainersSearchForm.Experience,
          Specializations: TrainersSearchForm.Specializations,
          WorkingSchedule: TrainersSearchForm.WorkingSchedule,
          age_from: TrainersSearchForm.age_from,
          age_to: TrainersSearchForm.age_to,
          experience_from: TrainersSearchForm.experience_from,
          experience_to: TrainersSearchForm.experience_to,
          Is_Active: TrainersSearchForm.Is_Active,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setTrainers(data);
      } else if (response.status === 404) {
        setTrainers([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching trainers found.",
          variant: "destructive",
        });
      } else {
        setTrainers([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setTrainers([]);

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

  const getTrainerCardData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getTrainerCardData`, {
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

      if (response.ok && data.length > 0) {
        setTrainerCardData(data[0]);
      } else {
        setTrainerCardData({
          TotalTrainers: 0,
          assignedMembers: 0,
          AvgExperience: 0,
          ActiveTrainers: 0,
        });
      }
    } catch (err) {
      console.error("Trainer Card Error:", err);

      setTrainerCardData({
        TotalTrainers: 0,
        assignedMembers: 0,
        AvgExperience: 0,
        ActiveTrainers: 0,
      });
    }
  };

  const handleEditTrainer = (Trainer: any) => {
    setEditingTrainer(Trainer);
    // console.log(Trainer);

    setTrainerForm({
      company_code: companyCode,
      Location_Code: locationCode,
      TrainerID: Trainer.TrainerID,
      KeyField: Trainer.KeyField,
      FullName: Trainer.FullName,
      Email: Trainer.Email,
      Password: Trainer.Password,
      DOB: Trainer.DOB ? new Date(Trainer.DOB).toISOString().split("T")[0] : "",
      Gender: Trainer.Gender,
      Mobile: Trainer.Mobile,
      Experience: Trainer.Experience,
      Certifications: Trainer.Certifications,
      Specializations: Trainer.Specializations,
      WorkingSchedule: Trainer.WorkingSchedule,
      Biography: Trainer.Biography,
      Is_Active: Trainer.Is_Active,
      created_by: Trainer.created_by,
      modified_by: Trainer.modified_by,
    });

    const userLogo =
      Trainer.Photo?.data && Array.isArray(Trainer.Photo.data)
        ? bufferToBase64(Trainer.Photo.data)
        : null;

    setTrainerImages([userLogo]);

    setIsTrainerDialogOpen(true);
  };

  const handleReset = () => {
    setTrainersSearchForm({
      company_code: companyCode,
      Location_Code: locationCode,
      TrainerID: "",
      FullName: "",
      Email: "",
      age_from: "",
      age_to: "",
      DOB: "",
      Mobile: "",
      experience_from: "",
      experience_to: "",
      Experience: "",
      Gender: "",
      Specializations: "",
      WorkingSchedule: "",
      Is_Active: "",
    });
    setTrainers([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loading />}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/AdminDashboard")}
                className="flex items-center px-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Faculty Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Badge variant="secondary">Admin</Badge> */}
              <Dialog
                open={isTrainerDialogOpen}
                onOpenChange={setIsTrainerDialogOpen}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {hasActionPermission("AdminFaculty", "add") && (
                        <Button
                          onClick={handleAddTrainer}
                          className="shrink-0 px-2 sm:px-4"
                        >
                          <Plus className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Add Trainer</span>
                        </Button>
                      )}
                    </TooltipTrigger>

                    <TooltipContent>Add Trainer</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTrainer
                        ? "Update trainer details."
                        : "Enter the details for the new personal trainer."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainerId">Trainer ID</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              id="trainerId"
                              value={TrainerForm.TrainerID}
                              readOnly={
                                !!editingTrainer || numberGeneration === "Auto"
                              }
                              className={
                                !!editingTrainer || numberGeneration === "Auto"
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : ""
                              }
                              placeholder={
                                numberGeneration === "Auto"
                                  ? "Auto Generated"
                                  : "Enter Trainer ID"
                              }
                              maxLength={20}
                              onChange={(e) => {
                                if (
                                  !editingTrainer &&
                                  numberGeneration === "Manual"
                                ) {
                                  const value = e.target.value.replace(
                                    /[^a-zA-Z0-9]/g,
                                    "",
                                  );

                                  setTrainerForm({
                                    ...TrainerForm,
                                    TrainerID: value,
                                  });
                                }
                              }}
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>
                              {!!editingTrainer
                                ? "Trainer ID cannot be edited"
                                : numberGeneration === "Auto"
                                  ? "Trainer ID is Auto Generated"
                                  : "Enter Trainer ID"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.FullName
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Full Name
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id="Email"
                                maxLength={100}
                                value={TrainerForm.FullName}
                                onChange={(e) =>
                                  setTrainerForm({
                                    ...TrainerForm,
                                    FullName: e.target.value,
                                  })
                                }
                                placeholder="e.g., Full Name"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Full Name</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.Email
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Email
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id="Email"
                                maxLength={255}
                                value={TrainerForm.Email}
                                onChange={(e) =>
                                  setTrainerForm({
                                    ...TrainerForm,
                                    Email: e.target.value,
                                  })
                                }
                                placeholder="e.g., trainer@ruw.edu.bh"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Newly Added Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.Password
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Password
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Input
                                  id="Password"
                                  maxLength={50}
                                  type={showPassword ? "text" : "password"}
                                  value={TrainerForm.Password}
                                  onChange={(e) =>
                                    setTrainerForm({
                                      ...TrainerForm,
                                      Password: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Password"
                                  className="pr-10"
                                />

                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Password</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Newly Added Field */}
                      <div className="space-y-2">
                        {/* <Label htmlFor="email">Date of Birth*</Label>
                        <Input id="email" type="date" placeholder="trainer@ruw.edu.bh" /> */}
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.DOB
                              ? "text-red-500"
                              : ""
                          }
                        >
                          DOB
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id="DOB"
                                type="date"
                                value={TrainerForm.DOB}
                                max={maxDOB.toISOString().split("T")[0]}
                                onChange={(e) =>
                                  setTrainerForm({
                                    ...TrainerForm,
                                    DOB: e.target.value,
                                  })
                                }
                                placeholder="e.g., DOB"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Select DOB</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Newly Added Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.Gender
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Gender
                        </Label>

                        <ReactSingleSelect
                          options={genderOptions}
                          value={
                            genderOptions.find(
                              (option) => option.value === TrainerForm.Gender
                            ) || null
                          }
                          onChange={(selected) => {
                            setTrainerForm({
                              ...TrainerForm,
                              Gender: selected?.value || "",
                            });
                          }}
                          placeholder="Select Gender"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.Mobile
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Phone
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id="Email"
                                value={TrainerForm.Mobile}
                                onChange={(e) =>
                                  handlePhoneNumberChange(e, "Mobile")
                                }
                                inputMode="numeric"
                                maxLength={15}
                                placeholder="e.g., +973 XXXX XXXX"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Phone</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          required
                          className={
                            submittedTrainer && !TrainerForm.Experience
                              ? "text-red-500"
                              : ""
                          }
                        >
                          Years of Experience
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                id="Experience"
                                type="text"
                                inputMode="numeric"
                                maxLength={2}
                                value={TrainerForm.Experience}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  ); // Allow digits only

                                  setTrainerForm({
                                    ...TrainerForm,
                                    Experience: value,
                                  });
                                }}
                                placeholder="e.g., 5"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Enter Years of Experience</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch
                            checked={TrainerForm.Is_Active === "Active"}
                            onCheckedChange={(checked) =>
                              setTrainerForm({
                                ...TrainerForm,
                                Is_Active: checked ? "Active" : "Close",
                              })
                            }
                          />
                          <Label>{TrainerForm.Is_Active}</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certifications">
                        Certifications (comma-separated)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              id="Email"
                              value={TrainerForm.Certifications}
                              maxLength={500}
                              onChange={(e) =>
                                setTrainerForm({
                                  ...TrainerForm,
                                  Certifications: e.target.value,
                                })
                              }
                              placeholder="e.g., NASM CPT, ACE Fitness..."
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Certifications</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        required
                        className={
                          submittedTrainer && !TrainerForm.Specializations
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Specializations (comma-separated)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              id="Email"
                              value={TrainerForm.Specializations}
                              maxLength={500}
                              onChange={(e) =>
                                setTrainerForm({
                                  ...TrainerForm,
                                  Specializations: e.target.value,
                                })
                              }
                              placeholder="e.g., Weight Loss, Strength Training..."
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Specializations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        required
                        className={
                          submittedTrainer && !TrainerForm.WorkingSchedule
                            ? "text-red-500"
                            : ""
                        }
                      >
                        Working Schedule
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              id="Email"
                              value={TrainerForm.WorkingSchedule}
                              maxLength={500}
                              onChange={(e) =>
                                setTrainerForm({
                                  ...TrainerForm,
                                  WorkingSchedule: e.target.value,
                                })
                              }
                              placeholder="e.g., Sun-Thu: 6AM-2PM"
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Working Schedule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Textarea
                              id="Email"
                              value={TrainerForm.Biography}
                              maxLength={1000}
                              onChange={(e) =>
                                setTrainerForm({
                                  ...TrainerForm,
                                  Biography: e.target.value,
                                })
                              }
                              placeholder="e.g., Brief description about the trainer..."
                            />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter Biography</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <ImageUpload
                      label="Trainer Image"
                      images={TrainerImages}
                      onImagesChange={setTrainerImages}
                      onFilesChange={handleTrainerFiles}
                      maxImages={1}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsTrainerDialogOpen(false);
                              setEditingTrainer(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          Cancel without saving changes.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleSaveTrainer}>
                            {editingTrainer ? "Update Trainer" : "Create Trainer"}
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            {editingTrainer
                              ? "Update a Trainer"
                              : "Create a Trainer"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Trainers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trainerCardData.TotalTrainers}
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
                    Assigned Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trainerCardData.assignedMembers || 0}
                    {/* {Trainers.reduce((sum, t) => sum + t.assignedMembers, 0)} */}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Experience
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(Number(trainerCardData.AvgExperience))} yrs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-500 text-white mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Now
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trainerCardData.ActiveTrainers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* For Search Input Fields */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Trainer ID</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        maxLength={100}
                        placeholder="Enter Full Name"
                        value={TrainersSearchForm.TrainerID}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            TrainerID: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Trainer ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        maxLength={100}
                        placeholder="Enter Full Name"
                        value={TrainersSearchForm.FullName}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            FullName: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Full Name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        maxLength={255}
                        placeholder="Enter Email"
                        value={TrainersSearchForm.Email}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            Email: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Phone"
                        value={TrainersSearchForm.Mobile}
                        inputMode="numeric"
                        maxLength={15}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            Mobile: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Phone</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Age From</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="Enter Age From"
                        value={TrainersSearchForm.age_from}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            age_from: e.target.value.replace(/\D/g, ""), // Numbers only
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Age From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Age To</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="Enter Age To"
                        value={TrainersSearchForm.age_to}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            age_to: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Age To</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Years of Experience From</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Years of Experience From"
                        value={TrainersSearchForm.experience_from}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            experience_from: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Years of Experience From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Years of Experience To</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter Years of Experience To"
                        value={TrainersSearchForm.experience_to}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            experience_to: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Years of Experience To</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <ReactSingleSelect
                  options={genderOptions}
                  value={
                    genderOptions.find(
                      (option) => option.value === TrainersSearchForm.Gender
                    ) || null
                  }
                  onChange={(selected) => {
                    setTrainersSearchForm({
                      ...TrainersSearchForm,
                      Gender: selected?.value || "",
                    });
                  }}
                  placeholder="Select Gender"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="Email"
                        value={TrainersSearchForm.Specializations}
                        maxLength={500}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            Specializations: e.target.value,
                          })
                        }
                        placeholder="Enter Specializations"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Specializations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Working Schedule</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="Email"
                        value={TrainersSearchForm.WorkingSchedule}
                        maxLength={500}
                        onChange={(e) =>
                          setTrainersSearchForm({
                            ...TrainersSearchForm,
                            WorkingSchedule: e.target.value,
                          })
                        }
                        placeholder="Enter Working Schedule"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Working Schedule</p>
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
                              (option) => option.value === TrainersSearchForm.Is_Active
                            ) || null
                          }
                          onChange={(selected) => {
                            setTrainersSearchForm({
                              ...TrainersSearchForm,
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
                        onClick={handleTrainerSearch}
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

        {/* Trainers Grid */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Personal Trainers</CardTitle>
            <CardDescription>
              Manage your gym's personal training staff
            </CardDescription>
          </CardHeader>

          <CardContent className="px-3 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Trainers.map((trainer: any) => (
                <Card
                  key={trainer.id}
                  className="hover:shadow-md transition-shadow overflow-hidden bg-white"
                >
                  {/* Dynamic height: auto for mobile, fixed for desktop */}
                  <CardContent className="p-4 sm:p-6 h-auto md:h-[480px] flex flex-col justify-between">
                    {/* Scrollable Container with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-4 min-h-0">

                      {/* ================= HEADER ================= */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 pb-2 border-b border-gray-100">
                        <div className="flex items-start sm:items-center w-full sm:w-auto">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg text-slate-900 break-words">
                              {trainer.FullName}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-500 font-mono">
                              {trainer.TrainerID}
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500">
                              {trainer.Experience} years experience
                            </p>

                            <Badge
                              variant={
                                trainer.Is_Active === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="mt-1 text-[11px] sm:text-xs"
                            >
                              {trainer.Is_Active === "Active" ? "Active" : "Closed"}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions Top Right on Desktop, Auto on Mobile */}
                        <div className="flex gap-1 self-end sm:self-start bg-slate-50 p-1 rounded-lg border border-gray-100 shrink-0">
                          {hasActionPermission("AdminFaculty", "edit") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                              onClick={() => handleEditTrainer(trainer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          {hasActionPermission("AdminFaculty", "delete") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteTrainer(trainer)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* ================= CONTACT & SCHEDULE ================= */}
                      <div className="space-y-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 min-w-0">
                          <Mail className="h-4 w-4 mr-2 shrink-0 text-violet-500" />
                          <span className="truncate break-all">{trainer.Email}</span>
                        </div>

                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 shrink-0 text-violet-500" />
                          <span>{trainer.Mobile}</span>
                        </div>

                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 shrink-0 text-violet-500" />
                          <span className="break-words">{trainer.WorkingSchedule}</span>
                        </div>

                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 shrink-0 text-violet-500" />
                          <span>{trainer.AssignedMembers} members assigned</span>
                        </div>
                      </div>

                      {/* ================= SPECIALIZATIONS ================= */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Specializations:
                        </p>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {typeof trainer.Specializations === "string"
                            ? trainer.Specializations.split(",").map(
                              (spec: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs break-words"
                                >
                                  {spec.trim()}
                                </Badge>
                              )
                            )
                            : Array.isArray(trainer.Specializations)
                              ? trainer.Specializations.map(
                                (spec: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs break-words"
                                  >
                                    {spec}
                                  </Badge>
                                )
                              )
                              : null}
                        </div>
                      </div>

                      {/* ================= CERTIFICATIONS ================= */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Certifications:
                        </p>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {typeof trainer.Certifications === "string"
                            ? trainer.Certifications.split(",").map(
                              (cert: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-violet-50 text-violet-700 border border-violet-100 break-words"
                                >
                                  {cert.trim()}
                                </Badge>
                              )
                            )
                            : Array.isArray(trainer.Certifications)
                              ? trainer.Certifications.map(
                                (cert: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-violet-50 text-violet-700 border border-violet-100 break-words"
                                  >
                                    {cert}
                                  </Badge>
                                )
                              )
                              : null}
                        </div>
                      </div>

                      {/* ================= BIOGRAPHY ================= */}
                      {trainer.Biography && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Biography:
                          </p>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">
                            {trainer.Biography}
                          </p>
                        </div>
                      )}

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FacultyManagement;
