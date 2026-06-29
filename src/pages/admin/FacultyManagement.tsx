
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, GraduationCap, Mail, Phone, Clock, Award, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BASE_URL } from '../ApiConfig';
import { useToast } from '@/hooks/use-toast';

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

//Trainer Dialog States
const [gender, setGender] = useState<any[]>([]);

const [submittedTrainer, setSubmittedTrainer] = useState(false);
const [Trainers, setTrainers] = useState([]);
const [editingTrainer, setEditingTrainer] = useState<any>(null);
const [isTrainerDialogOpen, setIsTrainerDialogOpen] = useState(false);
const [TrainerForm, setTrainerForm] = useState({
    company_code: "",
    user_code: "",
    user_name: "",
    first_name: "",
    last_name: "",
    user_password: "",
    user_status: "Active",
    log_in_out: "",
    user_type: "",
    email_id: "",
    dob: "",
    gender: "",
    role_id: "",
    super_admin: false,
    created_by: "admin",
    modified_by: "admin",
  });

  // Trainer
  const handleTrainerFiles = async (files: (File | null)[]) => {
      const convertedImages = await Promise.all(
        files.map((file, index) => {
          return new Promise<string | null>((resolve) => {
            // Keep existing image if no new file is selected
            
  
            const reader = new FileReader();
  
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
  
            reader.onerror = () => resolve(null);
  
            reader.readAsDataURL(file);
          });
        })
      );
    };
  
    //Trainers Search States
    const [TrainersSearchForm, setTrainersSearchForm] = useState({
      company_code: "YJK",
      user_code: "",
      user_name: "",
      first_name: "",
      last_name: "",
      user_status: "",
      dob: "",
      gender: "",
    });
  
    //Trainer Ag Grid
    const TrainerColumnDefs = [
      {
        headerName: "User Code",
        field: "user_code",
        minWidth: 150,
        cellStyle: { fontWeight: 600 },
      },
      {
        headerName: "User Name",
        field: "user_name",
        minWidth: 150,
      },
      {
        headerName: "First Name",
        field: "first_name",
        minWidth: 150,
      },
      {
        headerName: "Last Name",
        field: "last_name",
        minWidth: 150,
      },
      {
        headerName: "User Status",
        field: "user_status",
        minWidth: 150,
        cellRenderer: (params: any) => {
          const status = params.value?.toString().toLowerCase();
        
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {params.value}
            </Badge>
          );
        },
      },
      {
        headerName: "DOB",
        field: "dob",
        minWidth: 150,
      },
      {
        headerName: "Role ID",
        field: "role_id",
        minWidth: 150,
      },
      {
        headerName: "Gender",
        field: "gender",
        minWidth: 150,
      },
      {
    headerName: "Actions",
    width: 120,
    minWidth: 120,
    maxWidth: 120,
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cellRenderer: (params: any) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditTrainer(params.data)}
        >
          <Edit className="h-4 w-4" />
        </Button>
  
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteTrainer(params.data.user_code)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  }
    ];
  
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
  
  // Sample trainers data
  const [trainers] = useState<Trainer[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@ruw.edu.bh',
      phone: '+973 3456 7890',
      photo: '',
      certifications: ['NASM Certified Personal Trainer', 'ACE Fitness Nutrition Specialist'],
      specializations: ['Weight Loss', 'Strength Training', 'HIIT'],
      experience: 8,
      schedule: 'Sun-Thu: 6AM-2PM',
      bio: 'Ahmed is a dedicated fitness professional with over 8 years of experience helping clients achieve their fitness goals. He specializes in weight loss transformations and strength building programs.',
      assignedMembers: 24,
      isActive: true
    },
    {
      id: '2',
      name: 'Fatima Hassan',
      email: 'fatima.hassan@ruw.edu.bh',
      phone: '+973 3567 8901',
      photo: '',
      certifications: ['Yoga Alliance RYT-500', 'Pilates Method Alliance Certified'],
      specializations: ['Yoga', 'Pilates', 'Flexibility Training', 'Mindfulness'],
      experience: 6,
      schedule: 'Sun-Thu: 2PM-10PM',
      bio: 'Fatima brings a holistic approach to fitness, combining traditional yoga practices with modern wellness techniques. She is passionate about helping members find balance in body and mind.',
      assignedMembers: 18,
      isActive: true
    },
    {
      id: '3',
      name: 'Omar Khalil',
      email: 'omar.khalil@ruw.edu.bh',
      phone: '+973 3678 9012',
      photo: '',
      certifications: ['ISSA Sports Nutrition', 'CrossFit Level 2 Trainer', 'First Aid Certified'],
      specializations: ['CrossFit', 'Sports Performance', 'Muscle Building'],
      experience: 10,
      schedule: 'Sat-Wed: 8AM-4PM',
      bio: 'Omar is a former competitive athlete turned fitness coach. With a decade of experience, he excels at designing performance-focused training programs for athletes and fitness enthusiasts alike.',
      assignedMembers: 32,
      isActive: true
    },
    {
      id: '4',
      name: 'Sara Al-Mahmoud',
      email: 'sara.mahmoud@ruw.edu.bh',
      phone: '+973 3789 0123',
      photo: '',
      certifications: ['ACSM Certified Exercise Physiologist', 'Pre/Postnatal Fitness Specialist'],
      specializations: ['Cardio Training', 'Women\'s Fitness', 'Senior Fitness'],
      experience: 5,
      schedule: 'Sun-Thu: 10AM-6PM',
      bio: 'Sara specializes in creating inclusive fitness programs for women of all ages and fitness levels. She has particular expertise in pre/postnatal fitness and senior wellness programs.',
      assignedMembers: 15,
      isActive: true
    }
  ]);

  //Trainer CRUD Functions
  const handleAddTrainer = () => {
      setEditingTrainer(null);
      setTrainerForm({
        company_code: "YJK",
        user_code: "",
        user_name: "",
        first_name: "",
        last_name: "",
        user_password: "",
        user_status: "Active",
        log_in_out: "",
        user_type: "",
        email_id: "",
        dob: "",
        gender: "",
        role_id: "",
        super_admin: false,
        created_by: "admin",
        modified_by: "admin",
      });
      setIsTrainerDialogOpen(true);
    };
  
    const validateTrainer = () => {
      if (
        !TrainerForm.company_code ||
        !TrainerForm.user_code ||
        !TrainerForm.user_name ||
        !TrainerForm.first_name ||
        !TrainerForm.last_name ||
        !TrainerForm.user_password ||
        !TrainerForm.user_status ||
        !TrainerForm.email_id ||
        !TrainerForm.dob ||
        !TrainerForm.role_id
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
  
      if (!emailRegex.test(TrainerForm.email_id)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return false;
      }
  
      return true;
    };
  
    const handleCreateTrainer = async () => {
      setSubmittedTrainer(true);
  
      if (!validateTrainer()) return;
  
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
  
        const response = await fetch(`${BASE_URL}/useradd`, {
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

        const response = await fetch(`${BASE_URL}/UserUpdates`, {
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
    
    const handleDeleteTrainer = async (user_code: string) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Trainer?"
      );
  
      if (!confirmDelete) return;
  
      try {
        const response = await fetch(`${BASE_URL}/userdelete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "modified-by": "admin",
            "company_code": "YJK",
          },
          body: JSON.stringify({
            user_codes: [user_code],
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
            description: data.message || "Failed to delete Trainer.",
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
  
    const handleSaveTrainer = async () => {
      if (editingTrainer) {
        await handleUpdateTrainer();
      } else {
        await handleCreateTrainer();
      }
    };
  
    const handleTrainerSearch = async () => {
      try {
        const response = await fetch(`${BASE_URL}/usersearchcriteria`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: "YJK",
            user_code: TrainersSearchForm.user_code,
            user_name: TrainersSearchForm.user_name,
            first_name: TrainersSearchForm.first_name,
            last_name: TrainersSearchForm.last_name,
            user_status: TrainersSearchForm.user_status,
            dob: TrainersSearchForm.dob,
            gender: TrainersSearchForm.gender,
          }),
        });
  
        const data = await response.json();
  
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
        user_code: Trainer.user_code,
        user_name: Trainer.user_name,
        first_name: Trainer.first_name,
        last_name: Trainer.last_name,
        user_password: Trainer.user_password,
        user_status: Trainer.user_status,
        log_in_out: Trainer.log_in_out,
        user_type: Trainer.user_type,
        email_id: Trainer.email_id,
        dob: Trainer.dob,
        gender: Trainer.gender,
        role_id: Trainer.role_id,
        super_admin: Trainer.super_admin === "Yes",
        created_by: Trainer.created_by,
        modified_by: Trainer.modified_by,
      });
  
      setIsTrainerDialogOpen(true);
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trainer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Trainer</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new personal trainer.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="trainer@ruw.edu.bh" />
                      </div>

                      {/* Newly Added Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Date of Birth</Label>
                        <Input id="email" type="date" placeholder="trainer@ruw.edu.bh" />
                      </div>

                      {/* Newly Added Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Gender</Label>
                        <Select
                          value={TrainerForm.gender}
                          onValueChange={(value) =>
                            setTrainerForm({ ...TrainerForm, gender: value })
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+973 XXXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input id="experience" type="number" placeholder="5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      <Input id="certifications" placeholder="NASM CPT, ACE Fitness..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                      <Input id="specializations" placeholder="Weight Loss, Strength Training..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Working Schedule</Label>
                      <Input id="schedule" placeholder="Sun-Thu: 6AM-2PM" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea id="bio" placeholder="Brief description about the trainer..." rows={4} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Add Trainer
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
                  <p className="text-2xl font-bold text-gray-900">{trainers.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{trainers.reduce((sum, t) => sum + t.assignedMembers, 0)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{Math.round(trainers.reduce((sum, t) => sum + t.experience, 0) / trainers.length)} yrs</p>
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
                  <p className="text-2xl font-bold text-gray-900">{trainers.filter(t => t.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trainers Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Trainers</CardTitle>
            <CardDescription>Manage your gym's personal training staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainers.map((trainer) => (
                <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <GraduationCap className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trainer.name}</h3>
                          <p className="text-sm text-gray-500">{trainer.experience} years experience</p>
                          <Badge variant={trainer.isActive ? 'default' : 'secondary'} className="mt-1">
                            {trainer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {trainer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {trainer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {trainer.schedule}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {trainer.assignedMembers} members assigned
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline">{spec}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
                        ))}
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
