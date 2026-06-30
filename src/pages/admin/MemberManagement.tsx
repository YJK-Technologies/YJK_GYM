
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowLeft, Edit, Users, UserCheck, UserX, Clock, Search, Plus, Eye, EyeOff, Pencil, Trash2, CalendarIcon, Phone, Mail, MapPin, AlertCircle, Bell, Megaphone } from 'lucide-react';
import { BASE_URL } from '../ApiConfig';
import AgGridTable from "@/components/ui/ag-grid-table";
import ImageUpload from "../ImageUpload";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Member {
  MemberID: string;
  Identity_No: string;
  Full_name: string;
  DOB: string;
  Gender: string;
  Mobile: string;
  WhatsApp_Number: string;
  Password: string;
  Email: string;
  Address: string;
  Emergency_contact_name: string;
  Emergency_contact_phone: string;
  Emergency_contact_relation: string;
  Membership_type: string;
  Joined_date: string;
  Plan_expiry_date: string;
  is_active: boolean;
  Receive_promotions: boolean;
  Receive_notifications: boolean;
  Company_code: string;
  Location_code: string;
  created_by: string;
  modified_by: string;
}

const emptyMember: Member = {
  MemberID: '',
  Identity_No: '',
  Full_name: '',
  DOB: '',
  Gender: '',
  Mobile: '',
  WhatsApp_Number: '',
  Password: '',
  Email: '',
  Address: '',
  Emergency_contact_name: '',
  Emergency_contact_phone: '',
  Emergency_contact_relation: '',
  Membership_type: 'Standard',
  Joined_date: '',
  Plan_expiry_date: '',
  is_active: false,
  Receive_promotions: false,
  Receive_notifications: false,
  Company_code: 'YJK',
  Location_code: 'LOC001',
  created_by: 'admin',
  modified_by: 'admin'
};

const MemberManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gender, setGender] = useState<any[]>([]);
  const [membershipType, setMembershipType] = useState<any[]>([]);
  const [relationship, setRelationship] = useState<any[]>([]);
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);

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

  const fetchMembershipType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMembershipType`, {
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
        setMembershipType(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchRelationship = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getRelationship`, {
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
        setRelationship(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchMembersData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllmemberData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: "YJK",
          Location_code: "LOC001",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMembers(data);
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
        fetchMembershipType(),
        fetchRelationship(),
        fetchMembersData(),
      ]);
    };

    loadData();
  }, []);


  const [members, setMembers] = useState<Member[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Member>(emptyMember as Member);
  const [showPassword, setShowPassword] = useState(false);
  const [memberImages, setMemberImages] = useState<(string | null)[]>([null, null]);
  const [submittedMember, setSubmittedMember] = useState(false);

  const handleMemberFiles = async (files: (File | null)[]) => {
    const convertedImages = await Promise.all(
      files.map((file, index) => {
        return new Promise<string | null>((resolve) => {
          if (!file) {
            resolve(memberImages[index] ?? null);
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

    setMemberImages(convertedImages);
  };

  const MembersColumnDefs = [
    {
      headerName: "Member ID",
      field: "MemberID",
      minWidth: 120,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Identity No",
      field: "Identity_No",
      minWidth: 140,
    },
    {
      headerName: "Full Name",
      field: "Full_name",
      minWidth: 180,
    },
    {
      headerName: "Date of Birth",
      field: "DOB",
      minWidth: 130,
    },
    {
      headerName: "Gender",
      field: "Gender",
      minWidth: 100,
    },
    {
      headerName: "Mobile",
      field: "Mobile",
      minWidth: 140,
    },
    {
      headerName: "WhatsApp",
      field: "WhatsApp_Number",
      minWidth: 150,
    },
    {
      headerName: "Email",
      field: "Email",
      minWidth: 220,
    },
    {
      headerName: "Address",
      field: "Address",
      minWidth: 250,
    },
    {
      headerName: "Emergency Contact",
      field: "Emergency_contact_name",
      minWidth: 180,
    },
    {
      headerName: "Emergency Phone",
      field: "Emergency_contact_phone",
      minWidth: 170,
    },
    {
      headerName: "Relation",
      field: "Emergency_contact_relation",
      minWidth: 140,
    },
    {
      headerName: "Receive Promotions",
      field: "Receive_promotions",
      minWidth: 170,
      cellRenderer: (params: any) => (
        <Badge variant={params.value ? "default" : "secondary"}>
          {params.value ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      headerName: "Receive Notifications",
      field: "Receive_notifications",
      minWidth: 180,
      cellRenderer: (params: any) => (
        <Badge variant={params.value ? "default" : "secondary"}>
          {params.value ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      headerName: "Joined Date",
      field: "Joined_date",
      minWidth: 140,
    },
    {
      headerName: "Plan Expiry",
      field: "Plan_expiry_date",
      minWidth: 150,
    },
    {
      headerName: "Membership",
      field: "Membership_type",
      minWidth: 140,
      cellRenderer: (params: any) => (
        <Badge variant="outline">{params.value}</Badge>
      ),
    },
    {
      headerName: "Status",
      field: "is_active",
      minWidth: 120,
      cellRenderer: (params: any) => (
        <Badge variant={params.value ? "default" : "secondary"}>
          {params.value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      headerName: "Actions",
      width: 170,
      minWidth: 170,
      maxWidth: 170,
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
            onClick={() => handleViewMember(params.data)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditMember(params.data)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteMember(params.data.MemberID)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  // const stats = [
  //   { title: 'Total Members', value: members.length, icon: Users, color: 'bg-blue-500' },
  //   { title: 'Active', value: members.filter(m => m.is_active).length, icon: UserCheck, color: 'bg-green-500' },
  //   { title: 'Inactive', value: members.filter(m => !m.is_active).length, icon: UserX, color: 'bg-red-500' },
  //   {
  //     title: 'Expiring Soon',
  //     value: members.filter(m => {
  //       const daysUntilExpiry = Math.ceil((m.Plan_expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  //       return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  //     }).length,
  //     icon: Clock,
  //     color: 'bg-orange-500'
  //   },
  // ];

  // const filteredMembers = members.filter(member => {
  //   const matchesSearch =
  //     member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     member.cpr.includes(searchTerm) ||
  //     member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     member.bahrainMobile.includes(searchTerm);

  //   const matchesStatus =
  //     statusFilter === 'all' ||
  //     (statusFilter === 'active' && member.isActive) ||
  //     (statusFilter === 'inactive' && !member.isActive);

  //   const matchesMembership =
  //     membershipFilter === 'all' || member.membershipType === membershipFilter;

  //   return matchesSearch && matchesStatus && matchesMembership;
  // });

  const handleAddMember = () => {
    setEditingMember(null);
    setFormData(emptyMember as Member);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setFormData({
      ...member,
      modified_by: member.modified_by ?? "admin",
      Receive_promotions:
        member.Receive_promotions === "Yes" ||
        member.Receive_promotions === true,

      Receive_notifications:
        member.Receive_notifications === "Yes" ||
        member.Receive_notifications === true,

      is_active:
        member.is_active === 1 ||
        member.is_active === "1" ||
        member.is_active === true,
    });

    if (member.Photo?.data) {
      const uint8Array = new Uint8Array(member.Photo.data);

      const binary = uint8Array.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        ""
      );

      const base64 = btoa(binary);

      setMemberImages([`data:image/png;base64,${base64}`]);
    } else {
      setMemberImages([]);
    }

    setIsDialogOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setViewingMember(member);
    setIsViewDialogOpen(true);
  };

  const handleDeleteMember = async (memberID: string) => {
    try {
      const response = await fetch(`${BASE_URL}/memberDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: "YJK",
          location_code: "LOC001",
          "modified-by": "admin", 
        },
        body: JSON.stringify({
          MemberIDs: [memberID],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data || "Member deleted successfully.",
        });

        fetchMembersData();

      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete member.",
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

  const validateMember = () => {
    if (
      !formData.Identity_No ||
      !formData.Full_name ||
      !formData.DOB ||
      !formData.Gender ||
      !formData.Mobile ||
      !formData.Password ||
      !formData.Email ||
      !formData.Emergency_contact_name ||
      !formData.Emergency_contact_phone ||
      !formData.Emergency_contact_relation ||
      !formData.Membership_type ||
      !formData.Joined_date ||
      !formData.Plan_expiry_date
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

    if (!emailRegex.test(formData.Email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^\d{8,15}$/.test(phone);
  };

  const validatePlanExpiryDate = () => {
    const joinedDate = new Date(formData.Joined_date);
    const expiryDate = new Date(formData.Plan_expiry_date);

    if (expiryDate <= joinedDate) {
      toast({
        title: "Invalid Plan Expiry Date",
        description: "Plan expiry date must be greater than joined date.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateMember = async () => {
    setSubmittedMember(true);

    if (!validateMember()) return;

    if (!isValidPhoneNumber(formData.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.WhatsApp_Number &&
      !isValidPhoneNumber(formData.WhatsApp_Number)
    ) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "WhatsApp number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!isValidPhoneNumber(formData.Emergency_contact_phone)) {
      toast({
        title: "Invalid Contact Phone",
        description: "Contact phone must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.Password || formData.Password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must contain at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }

    if (!validatePlanExpiryDate()) return;

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        switch (key) {
          case "Receive_promotions":
            form.append(
              key,
              value === true ? "Yes" : "No"
            );
            break;

          case "Receive_notifications":
            form.append(
              key,
              value === true ? "Yes" : "No"
            );
            break;

          case "is_active":
            form.append(
              key,
              value ? "1" : "0"
            );
            break;

          default:
            form.append(key, String(value ?? ""));
            break;
        }
      });

      memberImages.forEach((img, index) => {
        if (!img) return;

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

        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          form.append(
            "Photo",
            blob,
            `Photo.${extension}`
          );
        }
      });

      const response = await fetch(`${BASE_URL}/memberAddData`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Member created successfully.",
        });

        setIsDialogOpen(false);
        setSubmittedMember(false);

        // handleUserSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create member.",
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

  const handleUpdateMember = async () => {
    setSubmittedMember(true);

    if (!validateMember()) return;

    if (!isValidPhoneNumber(formData.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.WhatsApp_Number &&
      !isValidPhoneNumber(formData.WhatsApp_Number)
    ) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "WhatsApp number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!isValidPhoneNumber(formData.Emergency_contact_phone)) {
      toast({
        title: "Invalid Contact Phone",
        description: "Contact phone must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.Password || formData.Password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must contain at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }

    if (!validatePlanExpiryDate()) return;

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        switch (key) {
          case "Receive_promotions":
            form.append(
              key,
              value === true ? "Yes" : "No"
            );
            break;

          case "Receive_notifications":
            form.append(
              key,
              value === true ? "Yes" : "No"
            );
            break;

          case "is_active":
            form.append(
              key,
              value ? "1" : "0"
            );
            break;

          default:
            form.append(key, String(value ?? ""));
            break;
        }
      });

      memberImages.forEach((img, index) => {
        if (!img) return;

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

        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          form.append(
            "Photo",
            blob,
            `Photo.${extension}`
          );
        }
      });

      const response = await fetch(`${BASE_URL}/memberUpdate`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Member updated successfully.",
        });

        setEditingMember(null);
        setIsDialogOpen(false);
        setSubmittedMember(false);

        fetchMembersData();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user.",
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

  const handleSaveMember = async () => {
    if (editingMember) {
      await handleUpdateMember();
    } else {
      await handleCreateMember();
    }
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
            </div>
            <Button onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
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

        {/* Search and Filters */}
        {/* <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, CPR, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card> */}

        {/* Members Table */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Members ({filteredMembers.length})</CardTitle>
            <CardDescription>Manage gym members with CPR as primary identifier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CPR Number</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Plan Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.cpr}>
                      <TableCell className="font-mono font-medium">{member.cpr}</TableCell>
                      <TableCell className="font-medium">{member.fullName}</TableCell>
                      <TableCell>{member.bahrainMobile}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{format(member.joinedDate, 'dd MMM yyyy')}</TableCell>
                      <TableCell>{format(member.planExpiryDate, 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={member.isActive ? 'default' : 'secondary'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewMember(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.cpr)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No members found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            {/* <CardTitle>Members ({members.length})</CardTitle> */}
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage gym members with CPR as primary identifier</CardDescription>
          </CardHeader>
          <CardContent>
            <AgGridTable
              rowData={members}
              columnDefs={MembersColumnDefs}
              pagination={true}
              paginationPageSize={10}
              height="400px"
            />
          </CardContent>
        </Card>

        {/* Add/Edit Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedMember(false);
          }
          setIsDialogOpen(open)
        }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Update member information' : 'Enter member details. CPR number is the primary identifier.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="cpr" className={submittedMember && !formData.Identity_No ? "text-red-500" : ""}>Identity No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="cpr"
                            placeholder="Enter identity number"
                            value={formData.Identity_No}
                            onChange={(e) => setFormData({ ...formData, Identity_No: e.target.value })}
                            maxLength={20}
                            disabled={!!editingMember}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter identity number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className={submittedMember && !formData.Full_name ? "text-red-500" : ""}>Full Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="fullName"
                            placeholder="Enter full name"
                            value={formData.Full_name}
                            maxLength={100}
                            onChange={(e) => setFormData({ ...formData, Full_name: e.target.value })}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter full name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label className={submittedMember && !formData.DOB ? "text-red-500" : ""}>Date of Birth*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type='date'
                            value={formData.DOB}
                            max={maxDOB.toISOString().split("T")[0]}
                            onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                            placeholder="e.g., Date of Birth"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select date of birth</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className={submittedMember && !formData.Gender ? "text-red-500" : ""}>Gender*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Gender}
                              onValueChange={(value) => setFormData({ ...formData, Gender: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
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
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select gender</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="bahrainMobile" className={submittedMember && !formData.Mobile ? "text-red-500" : ""}>Mobile*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="bahrainMobile"
                            placeholder="Enter mobile number"
                            value={formData.Mobile}
                            inputMode="numeric"
                            maxLength={15}
                            onChange={(e) => handlePhoneNumberChange(e, "Mobile")}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter mobile number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="whatsappNumber"
                            placeholder="Enter whatsapp number"
                            value={formData.WhatsApp_Number}
                            inputMode="numeric"
                            maxLength={15}
                            onChange={(e) => handlePhoneNumberChange(e, "WhatsApp_Number")}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter whatsapp number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className={submittedMember && !formData.Password ? "text-red-500" : ""}>Password*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              value={formData.Password || ""}
                              onChange={(e) => setFormData({ ...formData, Password: e.target.value, })}
                              className="pr-10"
                              maxLength={50}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter password</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className={submittedMember && !formData.Email ? "text-red-500" : ""}>Email Address*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address (e.g., branch@example.com)"
                            value={formData.Email}
                            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Textarea
                            id="address"
                            placeholder="Flat/Villa, Building, Road, Block, Area"
                            value={formData.Address}
                            onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter full address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName" className={submittedMember && !formData.Emergency_contact_name ? "text-red-500" : ""}>Contact Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="emergencyContactName"
                            placeholder="Enter emergency contact name"
                            value={formData.Emergency_contact_name}
                            onChange={(e) => setFormData({ ...formData, Emergency_contact_name: e.target.value })}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter emergency contact name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone" className={submittedMember && !formData.Emergency_contact_phone ? "text-red-500" : ""}>Contact Phone*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="emergencyContactPhone"
                            placeholder="Enter emergency contact phone number"
                            value={formData.Emergency_contact_phone}
                            inputMode="numeric"
                            maxLength={15}
                            onChange={(e) =>
                              handlePhoneNumberChange(e, "Emergency_contact_phone")
                            }
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter emergency contact phone number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation" className={submittedMember && !formData.Emergency_contact_relation ? "text-red-500" : ""}>Relationship*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Emergency_contact_relation}
                              onValueChange={(value) => setFormData({ ...formData, Emergency_contact_relation: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                {relationship.map((relationship: any) => (
                                  <SelectItem
                                    key={relationship.attributedetails_name}
                                    value={relationship.attributedetails_name}
                                  >
                                    {relationship.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select Relationship</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="membershipType" className={submittedMember && !formData.Membership_type ? "text-red-500" : ""}>Membership Type*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Membership_type}
                              onValueChange={(value) => setFormData({ ...formData, Membership_type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Membership Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {membershipType.map((membershipType: any) => (
                                  <SelectItem
                                    key={membershipType.attributedetails_name}
                                    value={membershipType.attributedetails_name}
                                  >
                                    {membershipType.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select membership type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label className={submittedMember && !formData.Joined_date ? "text-red-500" : ""}>Joined Date*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type='date'
                            value={formData.Joined_date}
                            onChange={(e) => setFormData({ ...formData, Joined_date: e.target.value })}
                            placeholder="Select joined date"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select joined date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label className={submittedMember && !formData.Plan_expiry_date ? "text-red-500" : ""}>Plan Expiry Date*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type='date'
                            value={formData.Plan_expiry_date}
                            min={formData.Joined_date}
                            onChange={(e) => setFormData({ ...formData, Plan_expiry_date: e.target.value })}
                            placeholder="Select plan expiry date"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select plan expiry date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label>{formData.is_active ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>

                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Communication Preferences</h3>
                <div className="space-y-4">

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="receivePromotions"
                      checked={formData.Receive_promotions}
                      onCheckedChange={(checked) => setFormData({ ...formData, Receive_promotions: checked === true })}
                    />
                    <div className="flex items-center space-x-2">
                      <Megaphone className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="receivePromotions" className="cursor-pointer">
                        Receive Promotions
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="receiveNotifications"
                      checked={formData.Receive_notifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, Receive_notifications: checked === true })}
                    />
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="receiveNotifications" className="cursor-pointer">
                        Receive Notifications
                      </Label>
                    </div>
                  </div>

                </div>
              </div>

              <ImageUpload
                label="Member Image"
                images={memberImages}
                onImagesChange={setMemberImages}
                onFilesChange={handleMemberFiles}
                maxImages={1}
                tooltips={["Upload Member Image"]}
              />
            </div>

            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedMember(false);
                      setIsDialogOpen(false);
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
                    <Button onClick={handleSaveMember}>
                      {editingMember ? 'Update Member' : 'Add Member'}
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingMember
                        ? "Update member"
                        : "Create a member"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Member Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                Member ID: {viewingMember?.MemberID}
              </DialogDescription>
            </DialogHeader>

            {viewingMember && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{viewingMember.Full_name}</h2>
                    <Badge variant={viewingMember.is_active ? 'default' : 'secondary'} className="mt-2">
                      {viewingMember.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {viewingMember.Membership_type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Personal Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Identity No:</span> {viewingMember.Identity_No}</p>
                      <p><span className="font-medium">DOB:</span> {format(viewingMember.DOB, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Gender:</span> {viewingMember.Gender}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Membership</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Joined:</span> {format(viewingMember.Joined_date, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Expiry:</span> {format(viewingMember.Plan_expiry_date, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Type:</span> {viewingMember.Membership_type}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {viewingMember.Mobile}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> WhatsApp: {viewingMember.WhatsApp_Number}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {viewingMember.Email}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1" /> {viewingMember.Address}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {viewingMember.Emergency_contact_name}
                      </p>
                      <p><span className="font-medium">Phone:</span> {viewingMember.Emergency_contact_phone}</p>
                      <p><span className="font-medium">Relation:</span> {viewingMember.Emergency_contact_relation}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Communication Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4" />
                        <span>Promotions:</span>
                        <Badge variant={viewingMember.Receive_promotions ? 'default' : 'secondary'}>
                          {viewingMember.Receive_promotions ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications:</span>
                        <Badge variant={viewingMember.Receive_notifications ? 'default' : 'secondary'}>
                          {viewingMember.Receive_notifications ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                if (viewingMember) handleEditMember(viewingMember);
              }}>
                Edit Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default MemberManagement;
