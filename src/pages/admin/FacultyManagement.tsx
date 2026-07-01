
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, GraduationCap, Mail, Search, RotateCcw, Phone, Clock, Award, Users, Eye, EyeOff, } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BASE_URL } from '../ApiConfig';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from "../ImageUpload";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  certifications: string[];
  specializations: string[];
  experience: number;
  schedule: string;
  bio: string;
  assignedMembers: number;
  isActive: boolean;
}

const FacultyManagement = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { toast } = useToast();

  const [TrainerImages, setTrainerImages] = useState<(string | null)[]>([null, null]);

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
const [TrainerForm, setTrainerForm] = useState({
    company_code: "YJK",
    Location_Code: "001",
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
    created_by: "admin",
    modified_by: "admin",
  });

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof TrainerForm
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
      })
    );

    setTrainerImages(convertedImages);
  };
  
    //Trainers Search States
    const [TrainersSearchForm, setTrainersSearchForm] = useState({
      company_code: "YJK",
      Location_Code: "001",
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
            company_code: "YJK",
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setGender(data);
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
          fetchGender(),
        ]);
      };
  
      loadData();
    }, []);

//     useEffect(() => {
//   handleTrainerSearch();
// }, []);

  //Trainer CRUD Functions
  const handleAddTrainer = () => {
      setEditingTrainer(null);
      setTrainerForm({
        company_code: "YJK",
        Location_Code: "001",
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
        created_by: "admin",
        modified_by: "admin",
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
          description: "Mobile number must contain only digits and be between 8 and 15 digits.",
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
  
      try {
        const formData = new FormData();
  
        Object.entries(TrainerForm).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        // Object.entries(TrainerForm).forEach(([key, value]) => {
        //   if (key === "super_admin") {
        //     formData.append("super_admin", value ? "Yes" : "No");
        //   } else {
        //     formData.append(key, String(value ?? ""));
        //   }
        // });

        TrainerImages.forEach((img, index) => {
        if (!img) return;

        // Extract mime type from base64 string
        const mimeType = img.match(/data:(.*?);base64/)?.[1] || "image/png";

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        // Generate extension based on mime type
        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          formData.append(
            "Photo",
            blob,
            `Photo.${extension}`
          );
        }
      });
  
        const response = await fetch(`${BASE_URL}/GYM_TrainerInsert`, {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          toast({
            title: "Success",
            description: data.message || "Trainer created successfully.",
          });
  
          setIsTrainerDialogOpen(false);
          setSubmittedTrainer(false);
  
          handleTrainerSearch();
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
      }
    };
  
    const handleUpdateTrainer = async () => {
      setSubmittedTrainer(true);
  
      if (!validateTrainer()) return;

      if (!isValidPhoneNumber(TrainerForm.Mobile)) {
        toast({
          title: "Invalid Mobile Number",
          description: "Mobile number must contain only digits and be between 8 and 15 digits.",
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
  
      try {
        const formData = new FormData();
  
        // Object.entries(TrainerForm).forEach(([key, value]) => {
        //   formData.append(key, value as string);
        // });
        Object.entries(TrainerForm).forEach(([key, value]) => {
          if (key === "super_admin") {
            formData.append("super_admin", value ? "Yes" : "No");
          } else {
            formData.append(key, String(value ?? ""));
          }
        });

        TrainerImages.forEach((img, index) => {
        if (!img) return;

        // Extract mime type from base64 string
        const mimeType = img.match(/data:(.*?);base64/)?.[1] || "image/png";

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        // Generate extension based on mime type
        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          formData.append(
            "Photo",
            blob,
            `Photo.${extension}`
          );
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
          });
  
          setEditingTrainer(null);
          setIsTrainerDialogOpen(false);
          setSubmittedTrainer(false);
  
          handleTrainerSearch();
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
      }
    };
    
    // const handleDeleteTrainer = async (user_code: string) => {
    //   const confirmDelete = window.confirm(
    //     "Are you sure you want to delete this Trainer?"
    //   );
  
    //   if (!confirmDelete) return;
  
    //   try {
    //     const response = await fetch(`${BASE_URL}/GYM_TrainerDelete`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "modified-by": "admin",
    //         "company_code": "YJK",
    //       },
    //       body: JSON.stringify({
    //         user_codes: [user_code],
    //       }),
    //     });
  
    //     const data = await response.json();
  
    //     if (response.ok) {
    //       toast({
    //         title: "Success",
    //         description: data.message || "Trainer deleted successfully.",
    //       });
  
    //       handleTrainerSearch();
    //     } else {
    //       toast({
    //         title: "Error",
    //         description: data.message || "Failed to delete Trainer.",
    //         variant: "destructive",
    //       });
    //     }
    //   } catch (err: any) {
    //     console.error(err);
  
    //     toast({
    //       title: "Server Error",
    //       description: err.message || "Something went wrong.",
    //       variant: "destructive",
    //     });
    //   }
    // };

    const handleDeleteTrainer = async (trainer: any) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${trainer.FullName}?`
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${BASE_URL}/GYM_TrainerDelete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: trainer.company_code,
        Location_Code: trainer.Location_Code,
        TrainerID: trainer.TrainerID,
        KeyField: trainer.KeyField,
        modified_by: "admin",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: "Success",
        description: data.message || "Trainer deleted successfully.",
      });

      handleTrainerSearch();
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
  }
};
  
    const handleSaveTrainer = async () => {
      if (editingTrainer) {
        await handleUpdateTrainer();
      } else {
        await handleCreateTrainer();
      }
    };
  
    const handleTrainerSearch = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getTrainerSC`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: "YJK",
            Location_Code: "001",
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
            description: data?.message || "No matching attributes found.",
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
      }
    };
  
    const handleEditTrainer = (Trainer: any) => {
      setEditingTrainer(Trainer);
      console.log(Trainer);
  
      setTrainerForm({
        company_code: Trainer.company_code,
        Location_Code: Trainer.Location_Code,
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
      Trainer.Photo?.data &&
        Array.isArray(Trainer.Photo.data)
        ? bufferToBase64(Trainer.Photo.data)
        : null;

    setTrainerImages([userLogo]);
  
      setIsTrainerDialogOpen(true);
    };

    const handleReset = () => {
        setTrainersSearchForm({
          company_code: "YJK",
      Location_Code: "001",
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
        });
        setTrainers([]);
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
              <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <Dialog
                  open={isTrainerDialogOpen}
                  onOpenChange={setIsTrainerDialogOpen}
                >
                  <Button onClick={handleAddTrainer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trainer
                  </Button>
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

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">

                      <div className="space-y-2">
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.FullName ? "text-red-500" : ""}>Full Name*</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              maxLength={100}
                                              value={TrainerForm.FullName}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, FullName: e.target.value })}
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
                        {/* <Label htmlFor="email">Email*</Label>
                        <Input id="email" type="email" placeholder="trainer@ruw.edu.bh" /> */}
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Email ? "text-red-500" : ""}>Email*</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              maxLength={255}
                                              value={TrainerForm.Email}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, Email: e.target.value })}
                                              placeholder="e.g., Email"
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
                          <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Password ? "text-red-500" : ""}>Password*</Label>
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
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.DOB ? "text-red-500" : ""}>DOB*</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="DOB"
                                              type='date'
                                              value={TrainerForm.DOB}
                                              max={maxDOB.toISOString().split("T")[0]}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, DOB: e.target.value })}
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
                        {/* <Label htmlFor="email">Gender*</Label> */}
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Gender ? "text-red-500" : ""}>Gender*</Label>
                        <Select
                          value={TrainerForm.Gender}
                          onValueChange={(value) =>
                            setTrainerForm({ ...TrainerForm, Gender: value })
                          }
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                </TooltipTrigger>
                        
                              <TooltipContent>
                                <p>Select Gender</p>
                              </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        
                          <SelectContent>
                            {gender.map((status: any) => (
                              <SelectItem
                                key={status.attributedetails_code}
                                value={status.attributedetails_code}
                              >
                                {status.attributedetails_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    {/* </div> */}

                    {/* <div className="grid grid-cols-2 gap-4"> */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Mobile ? "text-red-500" : ""}>Phone*</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              
                                              value={TrainerForm.Mobile}
                                              onChange={(e) => handlePhoneNumberChange(e, "Mobile")}
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
                        <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Experience ? "text-red-500" : ""}>Years of Experience*</Label>
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
                                                const value = e.target.value.replace(/\D/g, ""); // Allow digits only
                                              
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      {/* <Input id="certifications" placeholder="NASM CPT, ACE Fitness..." /> */}
                      <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              value={TrainerForm.Certifications}
                                              maxLength={500}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, Certifications: e.target.value })}
                                              placeholder="e.g., NASM CPT, ACE Fitness..."
                                            />
                                            </TooltipTrigger>
                        
                                                <TooltipContent>
                                                  <p>Enter Certifications (comma-separated)</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      {/* <Label htmlFor="specializations">Specializations* (comma-separated)</Label>
                      <Input id="specializations" placeholder="Weight Loss, Strength Training..." /> */}
                      <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Specializations ? "text-red-500" : ""}>Specializations* (comma-separated)</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              value={TrainerForm.Specializations}
                                              maxLength={500}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, Specializations: e.target.value })}
                                              placeholder="e.g., Weight Loss, Strength Training..."
                                            />
                                            </TooltipTrigger>
                        
                                                <TooltipContent>
                                                  <p>Enter Specializations* (comma-separated)</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      {/* <Label htmlFor="schedule">Working Schedule*</Label>
                      <Input id="schedule" placeholder="Sun-Thu: 6AM-2PM" /> */}
                      <Label htmlFor="name" className={submittedTrainer && !TrainerForm.WorkingSchedule ? "text-red-500" : ""}>Working Schedule*</Label>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              value={TrainerForm.WorkingSchedule}
                                              maxLength={500}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, WorkingSchedule: e.target.value })}
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
                      {/* <Textarea id="bio" placeholder="Brief description about the trainer..." rows={4} /> */}
                      <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Textarea
                                              id="Email"
                                              value={TrainerForm.Biography}
                                              maxLength={1000}
                                              onChange={(e) => setTrainerForm({ ...TrainerForm, Biography: e.target.value })}
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsTrainerDialogOpen(false);
                            setEditingTrainer(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSaveTrainer}>
                        {editingTrainer ? "Update Trainer" : "Add Trainer"}
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
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trainers</p>
                  <p className="text-2xl font-bold text-gray-900">{Trainers.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Assigned Members</p>
                  <p className="text-2xl font-bold text-gray-900">{Trainers.reduce((sum, t) => sum + t.assignedMembers, 0)}</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg. Experience</p>
                  <p className="text-2xl font-bold text-gray-900">{Trainers.length > 0
  ? Math.round(
      Trainers.reduce(
        (sum: number, t: any) => sum + Number(t.Experience || 0),
        0
      ) / Trainers.length
    )
  : 0} yrs</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-gray-900">{Trainers.filter((t: any) => t.Is_Active === "Active").length}</p>
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
              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, age_to: e.target.value.replace(/\D/g, ""), })} />
              </TooltipTrigger>
                  
                <TooltipContent>
                  <p>Enter Age To</p>
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
              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, Mobile: e.target.value.replace(/\D/g, ""), })} />
              </TooltipTrigger>
                  
                <TooltipContent>
                  <p>Enter Phone</p>
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
              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, experience_from: e.target.value.replace(/\D/g, ""), })} />
              </TooltipTrigger>
                  
                <TooltipContent>
                  <p>Enter Years of Experience</p>
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
              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, experience_to: e.target.value.replace(/\D/g, ""), })} />
              </TooltipTrigger>
                  
                <TooltipContent>
                  <p>Enter Years of Experience</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
    
        <div className="space-y-2">
          <Label>Gender</Label>

          <Select
            value={TrainersSearchForm.Gender}
            onValueChange={(value) =>
              setTrainersSearchForm({
                ...TrainersSearchForm,
                Gender: value,
              })
            }
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                </TooltipTrigger>
          
                <TooltipContent>
                  <p>Select Gender</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          
            <SelectContent>
              {gender.map((gender: any) => (
                <SelectItem
                  key={gender.attributedetails_code}
                  value={gender.attributedetails_code}
                >
                  {gender.attributedetails_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations</Label>
                      {/* <Input id="specializations" placeholder="Weight Loss, Strength Training..." /> */}
                      {/* <Label htmlFor="name" className={submittedTrainer && !TrainerForm.Specializations ? "text-red-500" : ""}>Specializations* (comma-separated)</Label> */}
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              value={TrainersSearchForm.Specializations}
                                              maxLength={500}
                                              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, Specializations: e.target.value })}
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
                      <Label htmlFor="schedule">Working Schedule</Label>
                      {/* <Input id="schedule" placeholder="Sun-Thu: 6AM-2PM" /> */}
                      {/* <Label htmlFor="name" className={submittedTrainer && !TrainerForm.WorkingSchedule ? "text-red-500" : ""}>Working Schedule*</Label> */}
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                            <Input
                                              id="Email"
                                              value={TrainersSearchForm.WorkingSchedule}
                                              maxLength={500}
                                              onChange={(e) => setTrainersSearchForm({ ...TrainersSearchForm, WorkingSchedule: e.target.value })}
                                              placeholder="e.g., Sun-Thu: 6AM-2PM"
                                            />
                                            </TooltipTrigger>
                        
                                                <TooltipContent>
                                                  <p>Enter Working Schedule</p>
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
          <CardHeader>
            <CardTitle>Personal Trainers</CardTitle>
            <CardDescription>Manage your gym's personal training staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Trainers.map((trainer: any) => (
                <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <GraduationCap className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trainer.FullName}</h3>
                          <p className="text-sm text-gray-500">{trainer.Experience} years experience</p>
                          <Badge variant={trainer.Is_Active === "Active" ? 'default' : 'secondary'} className="mt-1">
                            {trainer.Is_Active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTrainer(trainer)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTrainer(trainer)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trainer.Biography}</p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {trainer.Email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {trainer.Mobile}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {trainer.WorkingSchedule}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {trainer.assignedMembers} members assigned
                      </div>
                    </div>

                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {console.log("Trainer:", trainer)}
                        {typeof trainer.Specializations === "string"
                          ? trainer.Specializations.split(",").map((spec: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {spec.trim()}
                              </Badge>
                            ))
                          : Array.isArray(trainer.Specializations)
                          ? trainer.Specializations.map((spec: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {spec}
                              </Badge>
                            ))
                          : null}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {typeof trainer.Certifications === "string"
                          ? trainer.Certifications.split(",").map((cert: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cert.trim()}
                              </Badge>
                            ))
                          : Array.isArray(trainer.Certifications)
                          ? trainer.Certifications.map((cert: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))
                          : null}
                      </div>
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
