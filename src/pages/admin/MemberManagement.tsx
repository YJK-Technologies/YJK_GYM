import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Search,
  RotateCcw,
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Bell,
  Megaphone,
} from "lucide-react";
import { BASE_URL } from "../ApiConfig";
import AgGridTable from "@/components/ui/ag-grid-table";
import ImageUpload from "../ImageUpload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showConfirmToast } from "../../components/ui/show-confirm-toast";
import { useCompany } from "../CompanyContext";
import { hasActionPermission } from "@/utils/permission";
import Loading from "@/components/Loading";

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
  DietPlanID: string;
  Receive_promotions: boolean;
  Receive_notifications: boolean;
  Company_code: string;
  Location_code: string;
  created_by: string;
  modified_by: string;
}

interface MemberStats {
  TotalMembers: number;
  ActiveMembers: number;
  InactiveMembers: number;
  ExpiringSoonMembers: number;
}

const MemberManagement = () => {
  const { companyCode, locationCode, userCode } = useCompany();
  // For loading
  const [loading, setLoading] = useState(false);

  const emptyMember: Member = {
    MemberID: "",
    Identity_No: "",
    Full_name: "",
    DOB: "",
    Gender: "",
    Mobile: "",
    WhatsApp_Number: "",
    Password: "",
    Email: "",
    Address: "",
    Emergency_contact_name: "",
    Emergency_contact_phone: "",
    Emergency_contact_relation: "",
    Membership_type: "",
    Joined_date: "",
    Plan_expiry_date: "",
    is_active: true,
    DietPlanID: "",
    Receive_promotions: false,
    Receive_notifications: false,
    Company_code: companyCode,
    Location_code: locationCode,
    created_by: userCode,
    modified_by: userCode,
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const [gender, setGender] = useState<any[]>([]);
  const [membershipType, setMembershipType] = useState<any[]>([]);
  const [dietPlanType, setDietPlanType] = useState<any[]>([]);
  const [relationship, setRelationship] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<MemberStats>({
    TotalMembers: 0,
    ActiveMembers: 0,
    InactiveMembers: 0,
    ExpiringSoonMembers: 0,
  });

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
          company_code: companyCode,
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
      const response = await fetch(`${BASE_URL}/getMeberShipTypeName`, {
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
        setMembershipType(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchDietPlanType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDietPlanNameId`, {
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
        setDietPlanType(data);
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
          company_code: companyCode,
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
      const response = await fetch(`${BASE_URL}/getMemberCardData`, {
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

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchGender(),
        fetchMembershipType(),
        fetchRelationship(),
        fetchMembersData(),
        fetchStatus(),
        fetchDietPlanType(),
      ]);
    };

    loadData();
  }, []);

  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Member>(emptyMember as Member);
  const [showPassword, setShowPassword] = useState(false);
  const [memberImages, setMemberImages] = useState<(string | null)[]>([
    null,
    null,
  ]);
  const [submittedMember, setSubmittedMember] = useState(false);

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

  const [memberSearchForm, setMemberSearchForm] = useState({
    MemberID: "",
    Identity_No: "",
    Full_name: "",
    age_from: "",
    age_to: "",
    Gender: "",
    Mobile: "",
    WhatsApp_Number: "",
    Email: "",
    Membership_type: "",
    is_active: "",
    DietPlanID: "",
    Joined_date_from: "",
    Joined_date_to: "",
    expiry_date_from: "",
    expiry_date_to: "",
  });

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
      }),
    );

    setMemberImages(convertedImages);
  };

  const showActionColumn =
    hasActionPermission("AdminMembers", "view") ||
    hasActionPermission("AdminMembers", "edit") ||
    hasActionPermission("AdminMembers", "delete");

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
      cellRenderer: (params: any) => {
        const isYes = params.value === "Yes";

        return (
          <Badge variant={isYes ? "default" : "secondary"}>
            {isYes ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      headerName: "Receive Notifications",
      field: "Receive_notifications",
      minWidth: 180,
      cellRenderer: (params: any) => {
        const isYes = params.value === "Yes";

        return (
          <Badge variant={isYes ? "default" : "secondary"}>
            {isYes ? "Yes" : "No"}
          </Badge>
        );
      },
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
      headerName: "Membership Type",
      field: "Membership_type",
      minWidth: 250,
      cellRenderer: (params: any) => {
        const membership = membershipType.find(
          (item: any) => item.MemberShipType_id === params.value,
        );

        return (
          <Badge variant="outline">
            {membership
              ? `${membership.MemberShipType_id} - ${membership.MemberShipType_Name}`
              : params.value}
          </Badge>
        );
      },
    },
    {
      headerName: "Diet Plan",
      field: "DietPlanID",
      minWidth: 250,
      cellRenderer: (params: any) => {
        const dietPlan = dietPlanType.find(
          (item: any) => item.DietPlanID === params.value,
        );

        return (
          <Badge variant="outline">
            {dietPlan
              ? `${dietPlan.DietPlanID} - ${dietPlan.Diet_Name}`
              : params.value}
          </Badge>
        );
      },
    },
    {
      headerName: "Status",
      field: "is_active",
      minWidth: 120,
      cellRenderer: (params: any) => {
        const isActive = params.value === "Active";

        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {params.value}
          </Badge>
        );
      },
    },
    ...(showActionColumn
      ? [
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
                {hasActionPermission("AdminMembers", "view") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMember(params.data)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View</TooltipContent>
                  </Tooltip>
                )}

                {hasActionPermission("AdminMembers", "edit") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMember(params.data)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                )}

                {hasActionPermission("AdminMembers", "delete") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(params.data.MemberID)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  const stats = [
    {
      title: "Total Members",
      value: statsData[0]?.TotalMembers ?? 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active",
      value: statsData[0]?.ActiveMembers ?? 0,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Inactive",
      value: statsData[0]?.InactiveMembers ?? 0,
      icon: UserX,
      color: "bg-red-500",
    },
    {
      title: "Expiring Soon",
      value: statsData[0]?.ExpiringSoonMembers ?? 0,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  const handleAddMember = () => {
    setEditingMember(null);
    setFormData(emptyMember as Member);

    // Clear previously loaded image
    setMemberImages([null, null]);
    setIsDialogOpen(true);
  };

  // Added for date fetiching in update screen
  const formatDateForInput = (date: any) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setFormData({
      ...member,
      modified_by: member.modified_by ?? "admin",

      // Added for date fetiching in update screen
      Joined_date: formatDateForInput(member.Joined_date),
      Plan_expiry_date: formatDateForInput(member.Plan_expiry_date),

      Receive_promotions:
        member.Receive_promotions === "Yes" ||
        member.Receive_promotions === true,

      Receive_notifications:
        member.Receive_notifications === "Yes" ||
        member.Receive_notifications === true,

      is_active: member.is_active === "Active" || member.is_active === true,
    });

    if (member.Photo?.data) {
      const uint8Array = new Uint8Array(member.Photo.data);

      const binary = uint8Array.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        "",
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

  const getMembershipDisplay = (membershipId: string) => {
    const membership = membershipType.find(
      (item: any) => item.MemberShipType_id === membershipId,
    );

    return membership
      ? `${membership.MemberShipType_id} - ${membership.MemberShipType_Name}`
      : membershipId;
  };

  const getDietPlanDisplay = (DietPlanID: string) => {
    const dietPlan = dietPlanType.find(
      (item: any) => item.MemberShipType_id === DietPlanID,
    );

    return dietPlan
      ? `${dietPlan.MemberShipType_id} - ${dietPlan.Diet_Name}`
      : DietPlanID;
  };

  const selectedDietPlan = dietPlanType.find(
    (item: any) => item.DietPlanID === viewingMember?.DietPlanID,
  );

  const handleDeleteMember = (memberID: string) => {
    showConfirmToast({
      title: "Delete Member",
      description: "Are you sure you want to delete this member?",
      onConfirm: () => deleteMember(memberID),
    });
  };

  const deleteMember = async (memberID: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/memberDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          "modified-by": userCode,
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
          variant: "success",
        });

        handleMemberSearch();
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
    } finally {
      setLoading(false);
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

    if (!validateEmail()) return;

    if (!isValidPhoneNumber(formData.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description:
          "Mobile number must contain only digits and be between 8 and 15 digits.",
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
        description:
          "WhatsApp number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!isValidPhoneNumber(formData.Emergency_contact_phone)) {
      toast({
        title: "Invalid Contact Phone",
        description:
          "Contact phone must contain only digits and be between 8 and 15 digits.",
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

    setLoading(true);
    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        switch (key) {
          case "Receive_promotions":
            form.append(key, value === true ? "Yes" : "No");
            break;

          case "Receive_notifications":
            form.append(key, value === true ? "Yes" : "No");
            break;

          case "is_active":
            form.append(key, value ? "Active" : "Close");
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
          char.charCodeAt(0),
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          form.append("Photo", blob, `Photo.${extension}`);
        }
      });

      const response = await fetch(`${BASE_URL}/memberAddData`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          MemberID: data.MemberID,
        }));

        toast({
          title: "Success",
          description: data.message || "Member created successfully.",
          variant: "success",
        });

        setIsDialogOpen(false);
        setSubmittedMember(false);

        // Clear previously loaded image
        setMemberImages([null, null]);

        handleMemberSearch();
        fetchMembersData();
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = () => {
    showConfirmToast({
      title: "Update Member",
      description: "Do you want to update these changes?",
      onConfirm: updateMember,
    });
  };

  const updateMember = async () => {
    setSubmittedMember(true);

    if (!validateMember()) return;

    if (!validateEmail()) return;

    if (!isValidPhoneNumber(formData.Mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description:
          "Mobile number must contain only digits and be between 8 and 15 digits.",
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
        description:
          "WhatsApp number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (!isValidPhoneNumber(formData.Emergency_contact_phone)) {
      toast({
        title: "Invalid Contact Phone",
        description:
          "Contact phone must contain only digits and be between 8 and 15 digits.",
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

    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        switch (key) {
          case "Receive_promotions":
            form.append(key, value === true ? "Yes" : "No");
            break;

          case "Receive_notifications":
            form.append(key, value === true ? "Yes" : "No");
            break;

          case "is_active":
            form.append(key, value ? "Active" : "Close");
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
          char.charCodeAt(0),
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: mimeType,
        });

        const extension = mimeType.split("/")[1] || "png";

        if (index === 0) {
          form.append("Photo", blob, `Photo.${extension}`);
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
          variant: "success",
        });

        setEditingMember(null);
        setIsDialogOpen(false);
        setSubmittedMember(false);

        // Clear previously loaded image
        setMemberImages([null, null]);

        handleMemberSearch();
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
    } finally {
      setLoading(false);
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
    field: keyof typeof formData,
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleReset = () => {
    setMemberSearchForm({
      MemberID: "",
      Identity_No: "",
      Full_name: "",
      age_from: "",
      age_to: "",
      Gender: "",
      Mobile: "",
      WhatsApp_Number: "",
      Email: "",
      Membership_type: "",
      is_active: "",
      DietPlanID: "",
      Joined_date_from: "",
      Joined_date_to: "",
      expiry_date_from: "",
      expiry_date_to: "",
    });
    setMembers([]);
  };

  const validateEmail = () => {
    if (!formData.Email) return true;

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

  // For search form validation - Email
  const validateSearchEmail = () => {
    if (!memberSearchForm.Email) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(memberSearchForm.Email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validatePhoneNumbers = () => {
    if (
      memberSearchForm.Mobile &&
      !isValidPhoneNumber(memberSearchForm.Mobile)
    ) {
      toast({
        title: "Invalid Mobile Number",
        description:
          "Mobile number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    if (
      memberSearchForm.WhatsApp_Number &&
      !isValidPhoneNumber(memberSearchForm.WhatsApp_Number)
    ) {
      toast({
        title: "Invalid WhatsApp Number",
        description:
          "WhatsApp number must contain only digits and be between 8 and 15 digits.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateJoinedDateRange = () => {
    const { Joined_date_from, Joined_date_to } = memberSearchForm;

    if (!Joined_date_from || !Joined_date_to) return true;

    const from = new Date(Joined_date_from);
    const to = new Date(Joined_date_to);

    if (from > to) {
      toast({
        title: "Invalid Joined Date Range",
        description:
          "'Joined Date From' cannot be greater than 'Joined Date To'.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const validateExpiryDateRange = () => {
    const { expiry_date_from, expiry_date_to } = memberSearchForm;

    if (!expiry_date_from || !expiry_date_to) return true;

    const from = new Date(expiry_date_from);
    const to = new Date(expiry_date_to);

    if (from > to) {
      toast({
        title: "Invalid Expiry Date Range",
        description:
          "'Expiry Date From' cannot be greater than 'Expiry Date To'.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const validateAgeRange = () => {
    const { age_from, age_to } = memberSearchForm;

    if (!age_from || !age_to) return true;

    const from = Number(age_from);
    const to = Number(age_to);

    if (from > to) {
      toast({
        title: "Invalid Age Range",
        description: "'Age From' cannot be greater than 'Age To'.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const handleMemberSearch = async () => {
    if (!validateSearchEmail()) return;

    if (!validatePhoneNumbers()) return;

    if (!validateJoinedDateRange()) return;

    if (!validateExpiryDateRange()) return;

    if (!validateAgeRange()) return;

    if (!validatePlanExpiryDate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/searchMemberData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: companyCode,
          Location_code: locationCode,
          MemberID: memberSearchForm.MemberID,
          Identity_No: memberSearchForm.Identity_No,
          Full_name: memberSearchForm.Full_name,
          age_from: memberSearchForm.age_from,
          age_to: memberSearchForm.age_to,
          Gender: memberSearchForm.Gender,
          Mobile: memberSearchForm.Mobile,
          WhatsApp_Number: memberSearchForm.WhatsApp_Number,
          Email: memberSearchForm.Email,
          Membership_type: memberSearchForm.Membership_type,
          is_active: memberSearchForm.is_active,
          DietPlanID: memberSearchForm.DietPlanID,
          Joined_date_from: memberSearchForm.Joined_date_from,
          Joined_date_to: memberSearchForm.Joined_date_to,
          expiry_date_from: memberSearchForm.expiry_date_from,
          expiry_date_to: memberSearchForm.expiry_date_to,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMembers(data);
      } else if (response.status === 404) {
        setMembers([]);
        toast({
          title: "Data Not Found",
          description: data?.message || "No matching members found.",
          variant: "destructive",
        });
      } else {
        setMembers([]);
        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);
      setMembers([]);
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

  const handleSearchNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof memberSearchForm,
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);

    setMemberSearchForm({
      ...memberSearchForm,
      [field]: value,
    });
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
                Member Management
              </h1>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                {hasActionPermission("AdminMembers", "add") && (
                  <Button
                    onClick={handleAddMember}
                    className="shrink-0 px-2 sm:px-4"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Member</span>
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>Add Member</TooltipContent>
            </Tooltip>
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

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label>Member ID</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter member id"
                        value={memberSearchForm.MemberID}
                        maxLength={30}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            MemberID: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Member ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Indentity No</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        maxLength={20}
                        placeholder="Enter identity number"
                        value={memberSearchForm.Identity_No}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            Identity_No: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Indentity No</p>
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
                        placeholder="Enter full name"
                        maxLength={100}
                        value={memberSearchForm.Full_name}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            Full_name: e.target.value,
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
                <Label>Age From</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        maxLength={3}
                        placeholder="Enter age from"
                        value={memberSearchForm.age_from}
                        onChange={(e) =>
                          handleSearchNumberChange(e, "age_from")
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
                        maxLength={3}
                        placeholder="Enter age to"
                        value={memberSearchForm.age_to}
                        onChange={(e) => handleSearchNumberChange(e, "age_to")}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Age To</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={memberSearchForm.Gender}
                          onValueChange={(value) =>
                            setMemberSearchForm({
                              ...memberSearchForm,
                              Gender: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>

                          <SelectContent>
                            {gender.map((gender: any) => (
                              <SelectItem
                                key={gender.attributedetails_name}
                                value={gender.attributedetails_name}
                              >
                                {gender.attributedetails_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Gender</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Mobile</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter mobile number"
                        value={memberSearchForm.Mobile}
                        inputMode="numeric"
                        maxLength={15}
                        onChange={(e) => handleSearchNumberChange(e, "Mobile")}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Mobile Number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter whatsapp number"
                        maxLength={10}
                        value={memberSearchForm.WhatsApp_Number}
                        inputMode="numeric"
                        onChange={(e) =>
                          handleSearchNumberChange(e, "WhatsApp_Number")
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter WhatsApp Number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Enter email address"
                        value={memberSearchForm.Email}
                        maxLength={100}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            Email: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter Email Address</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Membership Type</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={memberSearchForm.Membership_type}
                          onValueChange={(value) =>
                            setMemberSearchForm({
                              ...memberSearchForm,
                              Membership_type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Membership Type" />
                          </SelectTrigger>

                          <SelectContent>
                            {membershipType.map((membershipType) => (
                              <SelectItem
                                key={membershipType.MemberShipType_id}
                                value={membershipType.MemberShipType_id}
                              >
                                {membershipType.MemberShipType_id} -{" "}
                                {membershipType.MemberShipType_Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Membership Type</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Diet Plan</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={memberSearchForm.DietPlanID}
                          onValueChange={(value) =>
                            setMemberSearchForm({
                              ...memberSearchForm,
                              DietPlanID: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Diet Plan" />
                          </SelectTrigger>

                          <SelectContent>
                            {dietPlanType.map((dietPlanType: any) => (
                              <SelectItem
                                key={dietPlanType.DietPlanID}
                                value={dietPlanType.DietPlanID}
                              >
                                {dietPlanType.DietPlanID} -{" "}
                                {dietPlanType.Diet_Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Diet Plan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Join Date From</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={memberSearchForm.Joined_date_from}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            Joined_date_from: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Join Date From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Join Date To</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={memberSearchForm.Joined_date_to}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            Joined_date_to: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Join Date To</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Plan Expiry From</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={memberSearchForm.expiry_date_from}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            expiry_date_from: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Plan Expiry From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Plan Expiry To</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={memberSearchForm.expiry_date_to}
                        onChange={(e) =>
                          setMemberSearchForm({
                            ...memberSearchForm,
                            expiry_date_to: e.target.value,
                          })
                        }
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Plan Expiry To</p>
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
                          value={memberSearchForm.is_active}
                          onValueChange={(value) =>
                            setMemberSearchForm({
                              ...memberSearchForm,
                              is_active: value,
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

            <div className="flex justify-end gap-4 mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={handleMemberSearch}
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

        {/* Members Table */}
        <Card>
          <CardHeader>
            {/* <CardTitle>Members ({members.length})</CardTitle> */}
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage gym members and their details
            </CardDescription>
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
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSubmittedMember(false);
            }
            setIsDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Member" : "Add New Member"}
              </DialogTitle>
              <DialogDescription>
                {editingMember
                  ? "Update member information"
                  : "Enter member details. CPR number is the primary identifier."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="memberId"
                        value={formData.MemberID}
                        readOnly={
                          !!editingMember || numberGeneration === "Auto"
                        }
                        className={
                          !!editingMember || numberGeneration === "Auto"
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }
                        placeholder={
                          numberGeneration === "Auto"
                            ? "Auto Generated"
                            : "Enter Member ID"
                        }
                        maxLength={20}
                        onChange={(e) => {
                          if (!editingMember && numberGeneration === "Manual") {
                            const value = e.target.value.replace(
                              /[^a-zA-Z0-9]/g,
                              "",
                            );

                            setFormData((prev) => ({
                              ...prev,
                              MemberID: value,
                            }));
                          }
                        }}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        {!!editingMember
                          ? "Member ID cannot be edited"
                          : numberGeneration === "Auto"
                            ? "Member ID is Auto Generated"
                            : "Enter Member ID"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="cpr"
                      className={
                        submittedMember && !formData.Identity_No
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Identity No*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="cpr"
                            placeholder="Enter identity number"
                            value={formData.Identity_No}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Identity_No: e.target.value,
                              })
                            }
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
                    <Label
                      htmlFor="fullName"
                      className={
                        submittedMember && !formData.Full_name
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Full Name*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="fullName"
                            placeholder="Enter full name"
                            value={formData.Full_name}
                            maxLength={100}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Full_name: e.target.value,
                              })
                            }
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter full name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={
                        submittedMember && !formData.DOB ? "text-red-500" : ""
                      }
                    >
                      Date of Birth*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type="date"
                            value={formData.DOB}
                            max={maxDOB.toISOString().split("T")[0]}
                            onChange={(e) =>
                              setFormData({ ...formData, DOB: e.target.value })
                            }
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
                    <Label
                      htmlFor="gender"
                      className={
                        submittedMember && !formData.Gender
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Gender*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Gender}
                              onValueChange={(value) =>
                                setFormData({ ...formData, Gender: value })
                              }
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
                <h3 className="font-semibold text-lg border-b pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="bahrainMobile"
                      className={
                        submittedMember && !formData.Mobile
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Mobile*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="bahrainMobile"
                            placeholder="Enter mobile number"
                            value={formData.Mobile}
                            inputMode="numeric"
                            maxLength={15}
                            onChange={(e) =>
                              handlePhoneNumberChange(e, "Mobile")
                            }
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
                            onChange={(e) =>
                              handlePhoneNumberChange(e, "WhatsApp_Number")
                            }
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter whatsapp number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="email"
                      className={
                        submittedMember && !formData.Email ? "text-red-500" : ""
                      }
                    >
                      Email Address*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address (e.g., branch@example.com)"
                            value={formData.Email}
                            maxLength={100}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Email: e.target.value,
                              })
                            }
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className={
                        submittedMember && !formData.Password
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Password*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              value={formData.Password || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  Password: e.target.value,
                                })
                              }
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
                    <Label htmlFor="address">Full Address</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Textarea
                            id="address"
                            placeholder="Flat/Villa, Building, Road, Block, Area"
                            value={formData.Address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Address: e.target.value,
                              })
                            }
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
                <h3 className="font-semibold text-lg border-b pb-2">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="emergencyContactName"
                      className={
                        submittedMember && !formData.Emergency_contact_name
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Contact Name*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="emergencyContactName"
                            placeholder="Enter emergency contact name"
                            value={formData.Emergency_contact_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Emergency_contact_name: e.target.value,
                              })
                            }
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter emergency contact name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="emergencyContactPhone"
                      className={
                        submittedMember && !formData.Emergency_contact_phone
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Contact Phone*
                    </Label>
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
                              handlePhoneNumberChange(
                                e,
                                "Emergency_contact_phone",
                              )
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
                    <Label
                      htmlFor="emergencyContactRelation"
                      className={
                        submittedMember && !formData.Emergency_contact_relation
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Relationship*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Emergency_contact_relation}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  Emergency_contact_relation: value,
                                })
                              }
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
                <h3 className="font-semibold text-lg border-b pb-2">
                  Membership Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="membershipType"
                      className={
                        submittedMember && !formData.Membership_type
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Membership Type*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.Membership_type}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  Membership_type: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Membership Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {membershipType.map((membershipType: any) => (
                                  <SelectItem
                                    key={membershipType.MemberShipType_id}
                                    value={membershipType.MemberShipType_id}
                                  >
                                    {membershipType.MemberShipType_id} -{" "}
                                    {membershipType.MemberShipType_Name}
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
                    <Label
                    // htmlFor="membershipType"
                    // className={
                    //   submittedMember && !formData.DietPlanID
                    //     ? "text-red-500"
                    //     : ""
                    // }
                    >
                      Diet Plan
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={formData.DietPlanID}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  DietPlanID: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Diet Plan" />
                              </SelectTrigger>
                              <SelectContent>
                                {dietPlanType.map((dietPlanType: any) => (
                                  <SelectItem
                                    key={dietPlanType.DietPlanID}
                                    value={dietPlanType.DietPlanID}
                                  >
                                    {dietPlanType.DietPlanID} -{" "}
                                    {dietPlanType.Diet_Name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select Diet Plan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className={
                        submittedMember && !formData.Joined_date
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Joined Date*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type="date"
                            value={formData.Joined_date}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Joined_date: e.target.value,
                              })
                            }
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
                    <Label
                      className={
                        submittedMember && !formData.Plan_expiry_date
                          ? "text-red-500"
                          : ""
                      }
                    >
                      Plan Expiry Date*
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DOB"
                            type="date"
                            value={formData.Plan_expiry_date}
                            min={formData.Joined_date}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                Plan_expiry_date: e.target.value,
                              })
                            }
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
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <Label>
                        {formData.is_active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Communication Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="receivePromotions"
                      checked={formData.Receive_promotions}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          Receive_promotions: checked === true,
                        })
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Megaphone className="h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="receivePromotions"
                        className="cursor-pointer"
                      >
                        Receive Promotions
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="receiveNotifications"
                      checked={formData.Receive_notifications}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          Receive_notifications: checked === true,
                        })
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label
                        htmlFor="receiveNotifications"
                        className="cursor-pointer"
                      >
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmittedMember(false);
                        setIsDialogOpen(false);
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
                    <Button onClick={handleSaveMember}>
                      {editingMember ? "Update Member" : "Add Member"}
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>{editingMember ? "Update member" : "Create a member"}</p>
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
                    <h2 className="text-2xl font-bold">
                      {viewingMember.Full_name}
                    </h2>
                    <Badge
                      variant={
                        String(viewingMember.is_active) === "Active"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-2"
                    >
                      {String(viewingMember.is_active)}
                    </Badge>
                    {/* <Badge variant="outline" className="ml-2">
                      {viewingMember.Membership_type}
                    </Badge> */}
                    {/* <Badge variant="outline">
  {getDietPlanDisplay(viewingMember.DietPlanID)}
</Badge> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Personal Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Identity No:</span>{" "}
                        {viewingMember.Identity_No}
                      </p>
                      <p>
                        <span className="font-medium">DOB:</span>{" "}
                        {format(viewingMember.DOB, "dd MMM yyyy")}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span>{" "}
                        {viewingMember.Gender}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Membership
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Joined:</span>{" "}
                        {format(viewingMember.Joined_date, "dd MMM yyyy")}
                      </p>
                      <p>
                        <span className="font-medium">Expiry:</span>{" "}
                        {format(viewingMember.Plan_expiry_date, "dd MMM yyyy")}
                      </p>
                      {/* <p>
                        <span className="font-medium">Type:</span>{" "}
                        {viewingMember.Membership_type}
                      </p> */}
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {getMembershipDisplay(viewingMember.Membership_type)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {viewingMember.Mobile}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> WhatsApp:{" "}
                        {viewingMember.WhatsApp_Number}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {viewingMember.Email}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1" />{" "}
                        {viewingMember.Address}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />{" "}
                        {viewingMember.Emergency_contact_name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {viewingMember.Emergency_contact_phone}
                      </p>
                      <p>
                        <span className="font-medium">Relation:</span>{" "}
                        {viewingMember.Emergency_contact_relation}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Communication Preferences
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4" />
                          <span>Promotions:</span>
                          <Badge
                            variant={
                              viewingMember.Receive_promotions
                                ? "default"
                                : "secondary"
                            }
                          >
                            {viewingMember.Receive_promotions ? "Yes" : "No"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Notifications:</span>
                          <Badge
                            variant={
                              viewingMember.Receive_notifications
                                ? "default"
                                : "secondary"
                            }
                          >
                            {viewingMember.Receive_notifications ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Diet Plan Details
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Diet Plan ID:</span>{" "}
                        {selectedDietPlan?.DietPlanID || "N/A"}
                      </p>

                      <p>
                        <span className="font-medium">Diet Plan Name:</span>{" "}
                        {selectedDietPlan?.Diet_Name || "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  if (viewingMember) handleEditMember(viewingMember);
                }}
              >
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
