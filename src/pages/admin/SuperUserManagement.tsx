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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Search, RotateCcw, Dumbbell, Package, Edit, Trash2, Eye, EyeOff, } from 'lucide-react';
import ImageUpload from "../ImageUpload";
import { BASE_URL } from '../ApiConfig';
import AgGridTable from "@/components/ui/ag-grid-table";
import '../../index.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const WorkoutProgramManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);
  const [company, setCompany] = useState<any[]>([]);
  const [role, setRole] = useState<any[]>([]);

  //Role Rights Screen
  const [permission, setPermission] = useState<any[]>([]);
  const [screen, setScreen] = useState<any[]>([]);
  const [roleRight, setRoleRight] = useState<any[]>([]);

  //User Screen
  const [logInLogOut, setLogInLogOut] = useState<any[]>([]);
  const [gender, setGender] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  //Attribute Detail Screen
  const [attributehdr, setAttributeHdr] = useState<any[]>([]);

  //Numberseries screen 
  const [ScreenType, setScreenType] = useState<any[]>([]);
  const [NumberPrefix, setNumberPrefix] = useState<any[]>([]);
  const [BillFormat, setBillFormat] = useState<any[]>([]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/city`, {
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
        setCities(data);
      } else {
        console.error("Failed to fetch cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(`${BASE_URL}/state`, {
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
        setStates(data);
      } else {
        console.error("Failed to fetch states");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/country`, {
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
        setCountries(data);
      } else {
        console.error("Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
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

  const fetchLocation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/locationno`);

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usercode`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Companyno`);

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await fetch(`${BASE_URL}/roleid`, {
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
        setRole(data);
      } else {
        console.error("Failed to fetch cities");
      }

    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  //Role Rights Screen
  const fetchPermission = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Permissions`, {
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
        setPermission(data);
      } else {
        console.error("Failed to fetch cities");
      }

    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchRoleRight = async () => {
    try {
      const response = await fetch(`${BASE_URL}/roleid`, {
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
        setRoleRight(data);
      } else {
        console.error("Failed to fetch cities");
      }

    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchScreen = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Screens`, {
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
        setScreen(data);
      } else {
        console.error("Failed to fetch cities");
      }

    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Added by Dinesh Gokul - 23-06-2026 for User
  const fetchLogInLogOut = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Loginorout`, {
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
        setLogInLogOut(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

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

  //Attribute Detail Screen
  const fetchAttributeHdr = async () => {
    try {
      const response = await fetch(`${BASE_URL}/hdrcode`, {
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
        setAttributeHdr(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  //Number series Detail Screen 
  const fetchScreenType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/screentype`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setScreenType(data);
      } else {
        console.error("Failed to fetch ScreenType");
      }

    } catch (error) {
      console.error("Error fetching ScreenType:", error);
    }
  };

  const fetchNumberPrefix = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getboolean`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNumberPrefix(data);
      } else {
        console.error("Failed to fetch NumberPrefix");
      }

    } catch (error) {
      console.error("Error fetching ScreenType:", error);
    }
  };

  const fetchBillFormat = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getBillFormat`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBillFormat(data);
      } else {
        console.error("Failed to fetch BillFormat");
      }

    } catch (error) {
      console.error("Error fetching BillFormat:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCities(),
        fetchStates(),
        fetchCountries(),
        fetchStatus(),
        fetchLocation(),
        fetchUsers(),
        fetchCompanies(),
        fetchRole(),
        fetchPermission(),
        fetchRoleRight(),
        fetchScreen(),
        fetchLogInLogOut(),
        fetchGender(),
        fetchAttributeHdr(),
        fetchScreenType(),
        fetchNumberPrefix(),
        fetchBillFormat()
      ]);
    };

    loadData();
  }, []);

  //Company Dialog States
  const [submittedCompany, setSubmittedCompany] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({
    company_no: "",
    company_name: "",
    short_name: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    email_id: "",
    status: "Active",
    foundedDate: "",
    websiteURL: "",
    contact_no: "",
    annualReportURL: "",
    location_no: "",
    company_gst_no: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Company Search States
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

  //Company Ag Grid
  const CompanyColumnDefs = [
    {
      headerName: "Company No",
      field: "company_no",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Name",
      field: "company_name",
      minWidth: 150,
    },
    {
      headerName: "Short Name",
      field: "short_name",
      minWidth: 150,
    },
    {
      headerName: "Address 1",
      field: "address1",
      minWidth: 150,
    },
    {
      headerName: "Address 2",
      field: "address2",
      minWidth: 150,
    },
    {
      headerName: "Address 3",
      field: "address3",
      minWidth: 150,
    },
    {
      headerName: "City",
      field: "city",
      minWidth: 150,
    },
    {
      headerName: "State",
      field: "state",
      minWidth: 150,
    },
    {
      headerName: "Pin Code",
      field: "pincode",
      minWidth: 150,
    },
    {
      headerName: "Country",
      field: "country",
      minWidth: 150,
    },
    {
      headerName: "Email",
      field: "email_id",
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "status",
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
      headerName: "Founded Date",
      field: "foundedDate",
      minWidth: 150,
    },
    {
      headerName: "Website URL",
      field: "websiteURL",
      minWidth: 150,
    },
    {
      headerName: "Contact No",
      field: "contact_no",
      minWidth: 150,
    },
    {
      headerName: "Annual Report URL",
      field: "annualReportURL",
      minWidth: 150,
    },
    {
      headerName: "Location No",
      field: "location_no",
      minWidth: 150,
    },
    {
      headerName: "Identification No",
      field: "company_gst_no",
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
            onClick={() => handleEditCompany(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCompany(params.data.company_no)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  // Preview images for ImageUpload component
  const [companyImages, setCompanyImages] = useState<(string | null)[]>([
    null,
    null,
  ]);

  const handleCompanyFiles = async (files: (File | null)[]) => {
    const convertedImages = await Promise.all(
      files.map((file, index) => {
        return new Promise<string | null>((resolve) => {
          // Keep existing image if no new file is selected
          if (!file) {
            resolve(companyImages[index] ?? null);
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

    setCompanyImages(convertedImages);
  };

  //Company Mapping Dialog States
  const [submittedCompanyMapping, setSubmittedCompanyMapping] = useState(false);
  const [companyMappings, setCompanyMappings] = useState([]);
  const [editingCompanyMapping, setEditingCompanyMapping] = useState<any>(null);
  const [isCompanyMappingDialogOpen, setIsCompanyMappingDialogOpen] = useState(false);
  const [companyMappingForm, setCompanyMappingForm] = useState({
    company_code: "YJK",
    user_code: "",
    company_no: "",
    location_no: "",
    status: "Active",
    order_no: "",
    keyfiels: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Company Mapping Search States
  const [companyMappingSearchForm, setCompanyMappingSearchForm] = useState({
    user_code: "",
    company_no: "",
    location_no: "",
    status: "",
  });

  //Company Ag Grid
  const CompanyMappingColumnDefs = [
    {
      headerName: "User Code",
      field: "user_code",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Company Code",
      field: "company_no",
      minWidth: 150,
    },
    {
      headerName: "Location No",
      field: "location_no",
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "status",
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
      headerName: "Order No",
      field: "order_no",
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
            onClick={() => handleEditCompanyMapping(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCompanyMapping(params.data.keyfiels)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Location Dialog States
  const [submittedLocation, setSubmittedLocation] = useState(false);
  const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationForm, setLocationForm] = useState({
    location_no: "",
    location_name: "",
    short_name: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    email_id: "",
    status: "Active",
    contact_no: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Location Search States
  const [locationSearchForm, setLocationSearchForm] = useState({
    location_no: "",
    location_name: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    status: "",
  });

  //Location Ag Grid
  const LocationColumnDefs = [
    {
      headerName: "Location No",
      field: "location_no",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Location Name",
      field: "location_name",
      minWidth: 150,
    },
    {
      headerName: "Short Name",
      field: "short_name",
      minWidth: 150,
    },
    {
      headerName: "Address 1",
      field: "address1",
      minWidth: 150,
    },
    {
      headerName: "Address 2",
      field: "address2",
      minWidth: 150,
    },
    {
      headerName: "Address 3",
      field: "address3",
      minWidth: 150,
    },
    {
      headerName: "City",
      field: "city",
      minWidth: 150,
    },
    {
      headerName: "State",
      field: "state",
      minWidth: 150,
    },
    {
      headerName: "Pin Code",
      field: "pincode",
      minWidth: 150,
    },
    {
      headerName: "Country",
      field: "country",
      minWidth: 150,
    },
    {
      headerName: "Email",
      field: "email_id",
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "status",
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
      headerName: "Contact No",
      field: "contact_no",
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
            onClick={() => handleEditLocation(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteLocation(params.data.location_no)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Role Dialog States
  const [submittedRole, setSubmittedRole] = useState(false);
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({
    company_code: "YJK",
    role_id: "",
    role_name: "",
    description: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Role Search States
  const [roleSearchForm, setRoleSearchForm] = useState({
    role_id: "",
    role_name: "",
  });

  //Role Ag Grid
  const roleColumnDefs = [
    {
      headerName: "Role ID",
      field: "role_id",
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Role Name",
      field: "role_name",
    },
    {
      headerName: "Description",
      field: "description",
    },
    {
      headerName: "Actions",
      maxWidth: 150,
      cellStyle: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditRole(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRole(params.data.role_id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  //Role Mapping Dialog States
  const [submittedRoleMapping, setSubmittedRoleMapping] = useState(false);
  const [roleMappings, setRoleMappings] = useState([]);
  const [editingRoleMapping, setEditingRoleMapping] = useState<any>(null);
  const [isRoleMappingDialogOpen, setIsRoleMappingDialogOpen] = useState(false);
  const [roleMappingForm, setRoleMappingForm] = useState({
    company_code: "YJK",
    user_code: "",
    role_id: "",
    keyfield: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Role Mapping Search States
  const [roleMappingSearchForm, setRoleMappingSearchForm] = useState({
    user_code: "",
    user_name: "",
    role_id: "",
    role_name: "",
  });

  //Role Mapping Ag Grid
  const RoleMappingColumnDefs = [
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
      headerName: "Role ID",
      field: "role_id",
      minWidth: 150,
    },
    {
      headerName: "Role Name",
      field: "role_name",
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
            onClick={() => handleEditRoleMapping(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRoleMapping(params.data.keyfield)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Role Rights Dialog States
  const [submittedRoleRights, setSubmittedRoleRights] = useState(false);
  const [roleRights, setRoleRights] = useState([]);
  const [editingRoleRight, setEditingRoleRight] = useState<any>(null);
  const [isRoleRightsDialogOpen, setIsRoleRightsDialogOpen] = useState(false);
  const [roleRightsForm, setRoleRightsForm] = useState({
    company_code: "YJK",
    role_id: "",
    screen_type: "",
    permission_type: "",
    keyfield: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Role Rights Search States
  const [roleRightsSearchForm, setRoleRightsSearchForm] = useState({
    role_id: "",
    screen_type: "",
    permission_type: "",
  });

  //Role Rights Ag Grid
  const RoleRightsColumnDefs = [
    {
      headerName: "Role ID",
      field: "role_id",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Screen Type",
      field: "screen_type",
      minWidth: 150,
    },
    {
      headerName: "Permission Type",
      field: "permission_type",
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
            onClick={() => handleEditRoleRight(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRoleRight(params.data.keyfield)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //User Dialog States
  const [submittedUser, setSubmittedUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState({
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

  const [userImages, setUserImages] = useState<(string | null)[]>([null, null]);

  const handleUserFiles = async (files: (File | null)[]) => {
    const convertedImages = await Promise.all(
      files.map((file, index) => {
        return new Promise<string | null>((resolve) => {
          // Keep existing image if no new file is selected
          if (!file) {
            resolve(userImages[index] ?? null);
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

    setUserImages(convertedImages);
  };

  //users Search States
  const [usersSearchForm, setusersSearchForm] = useState({
    company_code: "YJK",
    user_code: "",
    user_name: "",
    first_name: "",
    last_name: "",
    user_status: "",
    dob: "",
    gender: "",
  });

  //User Ag Grid
  const UserColumnDefs = [
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
            onClick={() => handleEditUser(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(params.data.user_code)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Attribute Detail Dialog States
  const [submittedAttributeDet, setSubmittedAttributeDet] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [editingAttribute, setEditingAttribute] = useState<any>(null);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [attributeForm, setAttributeForm] = useState({
    company_code: "YJK",
    attributeheader_code: "",
    attributedetails_code: "",
    attributedetails_name: "",
    descriptions: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Attribute Detail Search States
  const [attributeSearchForm, setAttributeSearchForm] = useState({
    attributeheader_code: "",
    attributedetails_code: "",
    attributedetails_name: "",
    descriptions: "",
  });

  //Attribute Ag Grid
  const AttributeColumnDefs = [
    {
      headerName: "Code",
      field: "attributeheader_code",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Sub Code",
      field: "attributedetails_code",
      minWidth: 150,
    },
    {
      headerName: "Details Name",
      field: "attributedetails_name",
      minWidth: 150,
    },
    {
      headerName: "Description",
      field: "descriptions",
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
            onClick={() => handleEditAttribute(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteAttribute(params.data.attributeheader_code, params.data.attributedetails_code)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Attribute Header Dialog States
  const [submittedAttributeHdr, setSubmittedAttributeHdr] = useState(false);
  const [isAttributeHdrDialogOpen, setIsAttributeHdrDialogOpen] = useState(false);
  const [attributeHdrForm, setAttributeHdrForm] = useState({
    company_code: "YJK", attributeheader_code: "", attributeheader_name: "", status: "Active", created_by: "admin", modified_by: "admin", tempstr1: "", tempstr2: "",
    tempstr3: "", tempstr4: "", datetime1: "", datetime2: "", datetime3: "", datetime4: "",
  });

  //Nunmber Series 
  
  const [submittedNumberSeries, setSubmittedNumberSeries] = useState(false);
  const [isNumberSeriesDialogOpen, setIsNumberSeriesDialogOpen] = useState(false);
  const [editingNumberSeries, setEditingNumberSeries] = useState<any>(null);
  const [numberSeries, setNumberSeries] = useState([]);
const [numberSeriesForm, setNumberSeriesForm] = useState({
  company_code: "YJK",
  Screen_Type: "",
  Start_Year: "",
  End_Year: "",
  Start_No: "",
  Running_No: "",
  End_No: "",
  text: "",
  number_prefix: "0",
  Status: "Active",
  bill_format: "",
  created_by: "admin",
  modified_by: "admin",
});

useEffect(() => {
  const today = new Date();
  const financialYear =
    today.getMonth() >= 3
      ? today.getFullYear()
      : today.getFullYear() - 1;

  setNumberSeriesForm((prev) => ({
    ...prev,
    Start_Year: `${financialYear}-04-01`,
    End_Year: `${financialYear + 1}-03-31`,
  }));
}, []);

console.log(numberSeriesForm)

  const currentYear = new Date().getFullYear();

  const fyStart = `${currentYear}-04-01`;
  const fyEnd = `${currentYear + 1}-03-31`;

  //Number Series Search States
  const [numberSeriesSearchForm, setnumberSeriesSearchForm] = useState({
    Screen_Type: ""
  });

  //Number Series Ag Grid
  const NumberSeriesColumnDefs = [
    {
      headerName: "Screen Type",
      field: "Screen_Type",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Start Year",
      field: "Start_Year",
      minWidth: 150,
    },
    {
      headerName: "End Year",
      field: "End_Year",
      minWidth: 150,
    },
    {
      headerName: "Start No",
      field: "Start_No",
      minWidth: 150,
    },
    {
      headerName: "Running No",
      field: "Running_No",
      minWidth: 150,
    },
    {
      headerName: "End No",
      field: "End_No",
      minWidth: 150,
    },
    {
      headerName: "Text",
      field: "text",
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "Status",
      minWidth: 150,
    },
    {
      headerName: "Bill Format",
      field: "bill_format",
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
            onClick={() => handleEditNumberSeries(params.data)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteNumberSeries(params.data)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  //Company CRUD Functions
  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyForm({
      company_no: "",
      company_name: "",
      short_name: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      email_id: "",
      status: "Active",
      foundedDate: "",
      websiteURL: "",
      contact_no: "",
      annualReportURL: "",
      location_no: "",
      company_gst_no: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setCompanyImages([null, null]);

    setIsCompanyDialogOpen(true);
  };

  const validateCompany = () => {
    if (
      !companyForm.company_no ||
      !companyForm.company_name ||
      !companyForm.address1 ||
      !companyForm.address2 ||
      !companyForm.city ||
      !companyForm.state ||
      !companyForm.pincode ||
      !companyForm.country ||
      !companyForm.email_id ||
      !companyForm.contact_no ||
      !companyForm.location_no
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

    if (!emailRegex.test(companyForm.email_id)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateCompany = async () => {
    setSubmittedCompany(true);

    if (!validateCompany()) return;

    try {
      const formData = new FormData();

      Object.keys(companyForm).forEach((key) => {
        formData.append(key, companyForm[key as keyof typeof companyForm]);
      });

      companyImages.forEach((img, index) => {
        if (!img) return;

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "image/png",
        });

        if (index === 0) {
          formData.append("company_logo", blob, "company_logo.png");
        }

        if (index === 1) {
          formData.append(
            "authorisedSignatur",
            blob,
            "authorisedSignatur.png"
          );
        }
      });

      const response = await fetch(`${BASE_URL}/add`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company created successfully.",
        });

        handleCompanySearch();
        setIsCompanyDialogOpen(false);
        setSubmittedCompany(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create company.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Server Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompany = async () => {
    setSubmittedCompany(true);

    if (!validateCompany()) return;

    try {
      const formData = new FormData();

      Object.keys(companyForm).forEach((key) => {
        formData.append(key, companyForm[key as keyof typeof companyForm] ?? "");
      });

      companyImages.forEach((img, index) => {
        if (!img) return;

        const base64 = img.split(",")[1];
        const byteCharacters = atob(base64);

        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "image/png",
        });

        if (index === 0) {
          formData.append("company_logo", blob, "company_logo.png");
        }

        if (index === 1) {
          formData.append(
            "authorisedSignatur",
            blob,
            "authorisedSignatur.png"
          );
        }
      });

      const response = await fetch(`${BASE_URL}/CompanyUpdate`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company updated successfully.",
        });

        handleCompanySearch();
        setEditingCompany(null);
        setIsCompanyDialogOpen(false);
        setSubmittedCompany(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update company.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Server Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async (companyNo: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "modified-by": "admin",
          },
          body: JSON.stringify({
            company_nos: [companyNo],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company deleted successfully.",
        });

        handleCompanySearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete company.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Server Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCompany = async () => {
    if (editingCompany) {
      await handleUpdateCompany();
    } else {
      await handleCreateCompany();
    }
  };

  const bufferToBase64 = (buffer: number[], mimeType: string = "image/png") => {
    let binary = "";

    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return `data:${mimeType};base64,${window.btoa(binary)}`;
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);

    setCompanyForm({
      company_no: company.company_no,
      company_name: company.company_name,
      short_name: company.short_name,
      address1: company.address1,
      address2: company.address2,
      address3: company.address3,
      city: company.city,
      state: company.state,
      pincode: company.pincode,
      country: company.country,
      email_id: company.email_id,
      status: company.status,
      foundedDate: company.foundedDate,
      websiteURL: company.websiteURL,
      contact_no: company.contact_no,
      annualReportURL: company.annualReportURL,
      location_no: company.location_no,
      company_gst_no: company.company_gst_no,
      created_by: company.created_by,
      modified_by: company.modified_by,
    });

    const logo =
      company.company_logo?.data &&
        Array.isArray(company.company_logo.data)
        ? bufferToBase64(company.company_logo.data)
        : null;

    const signature =
      company.authorisedSignatur?.data &&
        Array.isArray(company.authorisedSignatur.data)
        ? bufferToBase64(company.authorisedSignatur.data)
        : null;

    setCompanyImages([logo, signature]);

    setIsCompanyDialogOpen(true);
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

  //Company Mapping CRUD Functions
  const handleAddCompanyMapping = () => {
    setEditingCompanyMapping(null);
    setCompanyMappingForm({
      company_code: "YJK",
      user_code: "",
      company_no: "",
      location_no: "",
      status: "Active",
      order_no: "",
      keyfiels: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsCompanyMappingDialogOpen(true);
  };

  const validateCompanyMapping = () => {
    if (
      !companyMappingForm.user_code ||
      !companyMappingForm.company_no ||
      !companyMappingForm.location_no ||
      !companyMappingForm.status
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

  const handleCreateCompanyMapping = async () => {
    setSubmittedCompanyMapping(true);

    if (!validateCompanyMapping()) return;

    try {
      const response = await fetch(`${BASE_URL}/addCompanyMappingData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyMappingForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company mapping created successfully.",
        });

        handleCompanyMappingSearch();
        setIsCompanyMappingDialogOpen(false);
        setSubmittedCompanyMapping(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create company mapping.",
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

  const handleUpdateCompanyMapping = async () => {
    setSubmittedCompanyMapping(true);

    if (!validateCompanyMapping()) return;

    try {
      const response = await fetch(`${BASE_URL}/CompanyMappingUpdate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyMappingForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company mapping updated successfully.",
        });

        handleCompanyMappingSearch();
        setEditingCompanyMapping(null);
        setIsCompanyMappingDialogOpen(false);
        setSubmittedCompanyMapping(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update company mapping.",
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

  const handleDeleteCompanyMapping = async (keyfiels: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company mapping? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/commappingdeleteData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "modified-by": "admin",
          },
          body: JSON.stringify({
            keyfiels: [keyfiels],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || "Company mapping deleted successfully.",
        });

        handleCompanyMappingSearch();
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Failed to delete company mapping.",
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

  const handleSaveCompanyMapping = async () => {
    if (editingCompanyMapping) {
      await handleUpdateCompanyMapping();
    } else {
      await handleCreateCompanyMapping();
    }
  };

  const handleCompanyMappingSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/companymappingsearchdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: "YJK",
            user_code: companyMappingSearchForm.user_code,
            company_no: companyMappingSearchForm.company_no,
            location_no: companyMappingSearchForm.location_no,
            status: companyMappingSearchForm.status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCompanyMappings(data);
      } else if (response.status === 404) {
        setCompanyMappings([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching companies found.",
          variant: "destructive",
        });
      } else {
        setCompanyMappings([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setCompanyMappings([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditCompanyMapping = (mapping: any) => {
    setEditingCompanyMapping(mapping);

    setCompanyMappingForm({
      company_code: "YJK",
      user_code: mapping.user_code,
      company_no: mapping.company_no,
      location_no: mapping.location_no,
      status: mapping.status,
      order_no: mapping.order_no,
      keyfiels: mapping.keyfiels,
      created_by: mapping.created_by,
      modified_by: mapping.modified_by,
    });

    setIsCompanyMappingDialogOpen(true);
  };

  // Location CRUD Functions
  const handleAddLocation = () => {
    setEditingLocation(null);
    setLocationForm({
      location_no: "",
      location_name: "",
      short_name: "",
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      email_id: "",
      status: "Active",
      contact_no: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsLocationDialogOpen(true);
  };

  const validateLocation = () => {
    if (
      !locationForm.location_no ||
      !locationForm.location_name ||
      !locationForm.short_name ||
      !locationForm.address1 ||
      !locationForm.address2 ||
      !locationForm.city ||
      !locationForm.state ||
      !locationForm.pincode ||
      !locationForm.country ||
      !locationForm.contact_no ||
      !locationForm.email_id
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

    if (!emailRegex.test(locationForm.email_id)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateLocation = async () => {
    setSubmittedLocation(true);

    if (!validateLocation()) return;

    try {
      const response = await fetch(`${BASE_URL}/addlocationinfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Location created successfully.",
        });

        handleLocationSearch();
        setIsLocationDialogOpen(false);
        setSubmittedLocation(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create location.",
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

  const handleUpdateLocation = async () => {
    setSubmittedLocation(true);

    if (!validateLocation()) return;

    try {
      const response = await fetch(`${BASE_URL}/LocationUpdate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || data || "Location updated successfully.",
        });

        handleLocationSearch();
        setEditingLocation(null);
        setIsLocationDialogOpen(false);
        setSubmittedLocation(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update location.",
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

  const handleDeleteLocation = async (location_no: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this location? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/deletelocation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "modified-by": "admin",
          },
          body: JSON.stringify({
            location_nos: [location_no],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Location deleted successfully.",
        });

        handleLocationSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete location.",
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

  const handleSaveLocation = async () => {
    if (editingLocation) {
      await handleUpdateLocation();
    } else {
      await handleCreateLocation();
    }
  };

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/locationSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_no: locationSearchForm.location_no,
          location_name: locationSearchForm.location_name,
          city: locationSearchForm.city,
          state: locationSearchForm.state,
          pincode: locationSearchForm.pincode,
          country: locationSearchForm.country,
          status: locationSearchForm.status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLocations(data);
      } else if (response.status === 404) {
        setCompanies([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching locations found.",
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

  const handleEditLocation = (location: any) => {
    setEditingLocation(location);

    setLocationForm({
      location_no: location.location_no,
      location_name: location.location_name,
      short_name: location.short_name,
      address1: location.address1,
      address2: location.address2,
      address3: location.address3,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      country: location.country,
      email_id: location.email_id,
      status: location.status,
      contact_no: location.contact_no,
      created_by: location.created_by,
      modified_by: location.modified_by,
    });

    setIsLocationDialogOpen(true);
  };

  //Role CRUD Functions
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({
      company_code: "YJK",
      role_id: "",
      role_name: "",
      description: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsRoleDialogOpen(true);
  };

  const validateRole = () => {
    if (
      !roleForm.role_id ||
      !roleForm.role_name
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

  const handleCreateRole = async () => {
    setSubmittedRole(true);

    if (!validateRole()) return;

    try {
      const response = await fetch(`${BASE_URL}/addRoleInfoData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role created successfully.",
        });

        handleRoleSearch();
        setIsRoleDialogOpen(false);
        setSubmittedRole(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create role.",
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

  const handleUpdateRole = async () => {
    setSubmittedRole(true);

    if (!validateRole()) return;

    try {
      const response = await fetch(`${BASE_URL}/RoleUpdates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role updated successfully.",
        });

        handleRoleSearch();
        setEditingRole(null);
        setIsRoleDialogOpen(false);
        setSubmittedRole(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update role.",
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

  const handleDeleteRole = async (role_id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/roledelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
          "company_code": roleForm.company_code,
        },
        body: JSON.stringify({
          role_ids: [role_id],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role deleted successfully.",
        });

        handleRoleSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete role.",
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

  const handleSaveRole = async () => {
    if (editingRole) {
      await handleUpdateRole();
    } else {
      await handleCreateRole();
    }
  };

  const handleRoleSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Rolesearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
          role_id: roleSearchForm.role_id,
          role_name: roleSearchForm.role_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRoles(data);
      } else if (response.status === 404) {
        setCompanies([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching roles found.",
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

  const handleEditRole = (role: any) => {
    setEditingRole(role);

    setRoleForm({
      company_code: "YJK",
      role_id: role.role_id,
      role_name: role.role_name,
      description: role.description,
      created_by: role.created_by,
      modified_by: "admin",
    });

    setIsRoleDialogOpen(true);
  };

  //Role Mapping CRUD Functions
  const handleAddRoleMapping = () => {
    setEditingRoleMapping(null);
    setRoleMappingForm({
      company_code: "YJK",
      user_code: "",
      role_id: "",
      keyfield: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsRoleMappingDialogOpen(true);
  };

  const validateRoleMapping = () => {
    if (
      !roleMappingForm.user_code ||
      !roleMappingForm.role_id
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

  const handleCreateRoleMapping = async () => {
    setSubmittedRoleMapping(true);

    if (!validateRoleMapping()) return;

    try {
      const response = await fetch(`${BASE_URL}/addUserRoleMappingData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleMappingForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role mapping created successfully.",
        });

        handleRoleMappingSearch();
        setIsRoleMappingDialogOpen(false);
        setSubmittedRoleMapping(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create role mapping.",
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

  const handleUpdateRoleMapping = async () => {
    setSubmittedRoleMapping(true);

    if (!validateRoleMapping()) return;

    try {
      const response = await fetch(`${BASE_URL}/RoleMappingUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleMappingForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role mapping updated successfully.",
        });

        handleRoleMappingSearch();
        setEditingRoleMapping(null);
        setIsRoleMappingDialogOpen(false);
        setSubmittedRoleMapping(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update role mapping.",
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

  const handleDeleteRoleMapping = async (keyfield: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role mapping? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/RollMappingDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
        },
        body: JSON.stringify({
          keyfield: [keyfield],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role mapping deleted successfully.",
        });

        handleRoleMappingSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete role mapping.",
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

  const handleSaveRoleMapping = async () => {
    if (editingRoleMapping) {
      await handleUpdateRoleMapping();
    } else {
      await handleCreateRoleMapping();
    }
  };

  const handleRoleMappingSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/userrolsearchdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: "YJK",
            user_code: roleMappingSearchForm.user_code,
            user_name: roleMappingSearchForm.user_name,
            role_id: roleMappingSearchForm.role_id,
            role_name: roleMappingSearchForm.role_name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRoleMappings(data);
      } else if (response.status === 404) {
        setCompanies([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching roles found.",
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

  const handleEditRoleMapping = (mapping: any) => {
    setEditingRoleMapping(mapping);

    setRoleMappingForm({
      company_code: "YJK",
      user_code: mapping.user_code,
      role_id: mapping.role_id,
      keyfield: mapping.keyfield,
      created_by: mapping.created_by,
      modified_by: "admin",
    });

    setIsRoleMappingDialogOpen(true);
  };

  //Role Rights CRUD Functions
  const handleAddRoleRights = () => {
    setEditingRoleRight(null);
    setRoleRightsForm({
      company_code: "YJK",
      role_id: "",
      screen_type: "",
      permission_type: "",
      keyfield: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsRoleRightsDialogOpen(true);
  };

  const validateRoleRights = () => {
    if (
      !roleRightsForm.role_id ||
      !roleRightsForm.screen_type ||
      !roleRightsForm.permission_type
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

  const handleCreateRoleRight = async () => {
    setSubmittedRoleRights(true);

    if (!validateRoleRights()) return;

    try {
      const response = await fetch(`${BASE_URL}/adduserscreenmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleRightsForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role rights created successfully.",
        });

        handleRoleRightsSearch();
        setIsRoleRightsDialogOpen(false);
        setSubmittedRoleRights(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create role rights.",
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

  const handleUpdateRoleRight = async () => {
    setSubmittedRoleRights(true);

    if (!validateRoleRights()) return;

    try {
      const response = await fetch(`${BASE_URL}/updateRoleRights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleRightsForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role rights updated successfully.",
        });

        handleRoleRightsSearch();
        setEditingRoleRight(null);
        setIsRoleRightsDialogOpen(false);
        setSubmittedRoleRights(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update role rights.",
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

  const handleDeleteRoleRight = async (keyfield: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role right? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/userscreenmapdeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
        },
        body: JSON.stringify({
          keyfield: [keyfield],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Role rights deleted successfully.",
        });

        handleRoleRightsSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete role rights.",
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

  const handleSaveRoleRight = async () => {
    if (editingRoleRight) {
      await handleUpdateRoleRight();
    } else {
      await handleCreateRoleRight();
    }
  };

  const handleRoleRightsSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/userscreensearchdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: "YJK",
            role_id: roleRightsSearchForm.role_id,
            screen_type: roleRightsSearchForm.screen_type,
            permission_type: roleRightsSearchForm.permission_type,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRoleRights(data);
      } else if (response.status === 404) {
        setCompanies([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching role rights found.",
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

  const handleEditRoleRight = (item: any) => {
    setEditingRoleRight(item);

    setRoleRightsForm({
      company_code: "YJK",
      role_id: item.role_id,
      screen_type: item.screen_type,
      permission_type: item.permission_type,
      keyfield: item.keyfield,
      created_by: item.created_by,
      modified_by: "admin",
    });

    setIsRoleRightsDialogOpen(true);
  };

  //User CRUD Functions
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
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
    setUserImages([null]);
    setIsUserDialogOpen(true);
  };

  const validateUser = () => {
    if (
      !userForm.company_code ||
      !userForm.user_code ||
      !userForm.user_name ||
      !userForm.first_name ||
      !userForm.last_name ||
      !userForm.user_password ||
      !userForm.user_status ||
      !userForm.email_id ||
      !userForm.dob ||
      !userForm.role_id
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

    if (!emailRegex.test(userForm.email_id)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateUser = async () => {
    setSubmittedUser(true);

    if (!validateUser()) return;

    try {
      const formData = new FormData();

      // Object.entries(userForm).forEach(([key, value]) => {
      //   formData.append(key, value as string);
      // });
      Object.entries(userForm).forEach(([key, value]) => {
        if (key === "super_admin") {
          formData.append("super_admin", value ? "Yes" : "No");
        } else {
          formData.append(key, String(value ?? ""));
        }
      });

      // if (userImages?.length > 0 && userImages[0]) {
      //   formData.append("user_img", userImages[0]);
      // }

      userImages.forEach((img, index) => {
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
            "user_img",
            blob,
            `user_img.${extension}`
          );
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
          description: data.message || "User created successfully.",
        });

        setIsUserDialogOpen(false);
        setSubmittedUser(false);

        handleUserSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create user.",
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

  const handleUpdateUser = async () => {
    setSubmittedUser(true);

    if (!validateUser()) return;

    try {
      const formData = new FormData();

      // Object.entries(userForm).forEach(([key, value]) => {
      //   formData.append(key, value as string);
      // });
      Object.entries(userForm).forEach(([key, value]) => {
        if (key === "super_admin") {
          formData.append("super_admin", value ? "Yes" : "No");
        } else {
          formData.append(key, String(value ?? ""));
        }
      });

      // if (userImages.length > 0) {
      //   formData.append("user_images", userImages[0]);
      // }

      userImages.forEach((img, index) => {
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
            "user_images",
            blob,
            `user_images.${extension}`
          );
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
          description: data.message || "User updated successfully.",
        });

        setEditingUser(null);
        setIsUserDialogOpen(false);
        setSubmittedUser(false);

        handleUserSearch();
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

  const handleDeleteUser = async (user_code: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
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
          description: data.message || "User deleted successfully.",
        });

        handleUserSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user.",
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

  const handleSaveUser = async () => {
    if (editingUser) {
      await handleUpdateUser();
    } else {
      await handleCreateUser();
    }
  };

  const handleUserSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usersearchcriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
          user_code: usersSearchForm.user_code,
          user_name: usersSearchForm.user_name,
          first_name: usersSearchForm.first_name,
          last_name: usersSearchForm.last_name,
          user_status: usersSearchForm.user_status,
          dob: usersSearchForm.dob,
          gender: usersSearchForm.gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else if (response.status === 404) {
        setUsers([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching attributes found.",
          variant: "destructive",
        });
      } else {
        setUsers([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setUsers([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    console.log(user);

    setUserForm({
      company_code: user.company_code,
      user_code: user.user_code,
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
      user_password: user.user_password,
      user_status: user.user_status,
      log_in_out: user.log_in_out,
      user_type: user.user_type,
      email_id: user.email_id,
      dob: user.dob,
      gender: user.gender,
      role_id: user.role_id,
      super_admin: user.super_admin === "Yes",
      created_by: user.created_by,
      modified_by: user.modified_by,
    });

    const userLogo =
      user.user_images?.data &&
        Array.isArray(user.user_images.data)
        ? bufferToBase64(user.user_images.data)
        : null;

    setUserImages([userLogo]);

    setIsUserDialogOpen(true);
  };

  //Attribute Detail CRUD Functions
  const handleAddAttribute = () => {
    setEditingAttribute(null);
    setAttributeForm({
      company_code: "YJK",
      attributeheader_code: "",
      attributedetails_code: "",
      attributedetails_name: "",
      descriptions: "",
      created_by: "admin",
      modified_by: "admin",
    });
    setIsAttributeDialogOpen(true);
  };

  const validateAttributeDet = () => {
    if (
      !attributeForm.attributeheader_code ||
      !attributeForm.attributedetails_code ||
      !attributeForm.attributedetails_name
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

  const handleCreateAttribute = async () => {
    setSubmittedAttributeDet(true);

    if (!validateAttributeDet()) return;

    try {
      const response = await fetch(`${BASE_URL}/addattridetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attributeForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || "Attribute details created successfully.",
        });

        handleAttributeSearch();
        setIsAttributeDialogOpen(false);
        setSubmittedAttributeDet(false);
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Failed to create attribute details.",
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

  const handleUpdateAttribute = async () => {
    setSubmittedAttributeDet(true);

    if (!validateAttributeDet()) return;

    try {
      const response = await fetch(`${BASE_URL}/AttributeUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attributeForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || data || "Attribute details updated successfully.",
        });

        handleAttributeSearch();
        setEditingAttribute(null);
        setIsAttributeDialogOpen(false);
        setSubmittedAttributeDet(false);
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Failed to update attribute details.",
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

  const handleDeleteAttribute = async (attributeheader_code: string, attributedetails_code: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attribute? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/delattridetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
          "company_code": "YJK",
        },
        body: JSON.stringify({
          attributeheader_codesToDelete: [attributeheader_code],
          attributedetails_codeToDelete: [attributedetails_code],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || data || "Attribute details deleted successfully.",
        });

        handleAttributeSearch();
      } else {
        toast({
          title: "Error",
          description:
            data.message || data || "Failed to delete attribute details.",
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

  const handleSaveAttribute = async () => {
    if (editingAttribute) {
      await handleUpdateAttribute();
    } else {
      await handleCreateAttribute();
    }
  };

  const handleAttributeSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/attributeSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
          attributeheader_code: attributeSearchForm.attributeheader_code,
          attributedetails_code: attributeSearchForm.attributedetails_code,
          attributedetails_name: attributeSearchForm.attributedetails_name,
          descriptions: attributeSearchForm.descriptions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAttributes(data);
      } else if (response.status === 404) {
        setAttributes([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching attributes found.",
          variant: "destructive",
        });
      } else {
        setAttributes([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setAttributes([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditAttribute = (attribute: any) => {
    setEditingAttribute(attribute);

    setAttributeForm({
      company_code: attribute.company_code,
      attributeheader_code: attribute.attributeheader_code,
      attributedetails_code: attribute.attributedetails_code,
      attributedetails_name: attribute.attributedetails_name,
      descriptions: attribute.descriptions,
      created_by: attribute.created_by,
      modified_by: "admin",
    });

    setIsAttributeDialogOpen(true);
  };

  //add Attribute CRUD Functions
  const handleAddAttributeHdr = () => {
    setAttributeHdrForm({
      company_code: "YJK",
      attributeheader_code: "",
      attributeheader_name: "",
      status: "Active",
      created_by: "admin",
      modified_by: "admin",
      tempstr1: "",
      tempstr2: "",
      tempstr3: "",
      tempstr4: "",
      datetime1: "",
      datetime2: "",
      datetime3: "",
      datetime4: "",
    });
    setIsAttributeHdrDialogOpen(true);
  };

  const validateAttributeHdr = () => {
    if (
      !attributeHdrForm.attributeheader_code ||
      !attributeHdrForm.attributeheader_name ||
      !attributeHdrForm.status
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

  const handleCreateAttributeHdr = async () => {
    setSubmittedAttributeHdr(true);

    if (!validateAttributeHdr()) return;

    try {
      const response = await fetch(`${BASE_URL}/addattriData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attributeHdrForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || "Attribute header created successfully.",
        });
        setIsAttributeHdrDialogOpen(false);
        setSubmittedAttributeHdr(false);
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Failed to create attribute header.",
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

  // NumberSeries CRUD Functions  
  const handleAddNumberSeries = () => {
    setEditingNumberSeries(null);
    setNumberSeriesForm({
      company_code: "YJK",
      Screen_Type: "",
      Start_Year: "",
      End_Year: "",
      Start_No: "",
      Running_No: "",
      End_No: "",
      text: "",
      number_prefix: "",
      Status: "Active",
      bill_format: "",
      created_by: "admin",
      modified_by: "admin",
    });

    setIsNumberSeriesDialogOpen(true);
  };
  const validateNumberSeries = () => {
    if (
      !numberSeriesForm.Screen_Type ||
      !numberSeriesForm.Start_Year ||
      !numberSeriesForm.End_Year ||
      !numberSeriesForm.Start_No ||
      !numberSeriesForm.Running_No ||
      !numberSeriesForm.End_No ||
      !numberSeriesForm.text ||
      !numberSeriesForm.number_prefix ||
      !numberSeriesForm.Status ||
      !numberSeriesForm.bill_format
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
  const handleCreateNumberSeries = async () => {
    setSubmittedNumberSeries(true);

    if (!validateNumberSeries()) return;

    try {
      const response = await fetch(`${BASE_URL}/addNumberseries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(numberSeriesForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Number Series created successfully.",
        });

        handleSearchNumberSeries();
        setIsNumberSeriesDialogOpen(false);
        setSubmittedNumberSeries(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create Number Series.",
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
  const handleUpdateNumberSeries = async () => {
    setSubmittedNumberSeries(true);

    if (!validateNumberSeries()) return;

    try {

      const response = await fetch(`${BASE_URL}/NumberSeriesUpdate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(numberSeriesForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "NumberSeries updated successfully.",
        });

        handleSearchNumberSeries();
        setEditingNumberSeries(null);
        setIsNumberSeriesDialogOpen(false);
        setSubmittedNumberSeries(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update company.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Server Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };
  const handleDeleteNumberSeries = async (row: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Number Series?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/NumberSeriesdeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
          "company_code": "YJK", // if required
        },
        body: JSON.stringify({
          Screen_TypesToDelete: [
            {
              Screen_Type: row.Screen_Type,
              Start_Year: row.Start_Year,
              End_Year: row.End_Year,
            },
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });

        handleSearchNumberSeries();
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Server Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  const handleSaveNumberSeries = async () => {
    if (editingNumberSeries) {
      await handleUpdateNumberSeries();
    } else {
      await handleCreateNumberSeries();
    }
  };

  const handleEditNumberSeries = (mapping: any) => {
    setEditingNumberSeries(mapping);

    setNumberSeriesForm({
      company_code: "YJK",
      Screen_Type: mapping.Screen_Type,
      Start_Year: mapping.Start_Year,
      End_Year: mapping.End_Year,
      Start_No: mapping.Start_No,
      Running_No: mapping.Running_No || "0",
      End_No: mapping.End_No,
      text: mapping.text,
      number_prefix: mapping.number_prefix,
      Status: mapping.Status,
      bill_format: mapping.bill_format,
      created_by: "admin",
      modified_by: "admin",
    });

    setIsNumberSeriesDialogOpen(true);
  };

  const handleSearchNumberSeries = async () => {

    try {
      const response = await fetch(`${BASE_URL}/numberseriessearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: "YJK",
          Screen_Type: numberSeriesSearchForm.Screen_Type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNumberSeries(data);
      } else if (response.status === 404) {
        setNumberSeries([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching Number Series found.",
          variant: "destructive",
        });
      } else {
        setNumberSeries([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Search Error:", error);

      setNumberSeries([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  //TAB BUTTON LABELS
  const addLabels = {
    company: "Company",
    companyMapping: "Company Mapping",
    location: "Location",
    role: "Role",
    roleMapping: "Role Mapping",
    roleRights: "Role Rights",
    user: "User",
    attribute: "Attribute",
    NumberSeries: "NumberSeries",

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
      case "NumberSeries":
        handleAddNumberSeries();
        break;
      default:
        break;
    }
  };

  const renderCompanySearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label>Company No</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Company No"
                value={companySearchForm.company_no}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, company_no: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Company No</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Company Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Company Name"
                value={companySearchForm.company_name}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, company_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Company Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter City"
                value={companySearchForm.city}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, city: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter City</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>State</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter State"
                value={companySearchForm.state}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, state: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter State</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Pin Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Pin Code"
                maxLength={10}
                value={companySearchForm.pincode}
                inputMode="numeric"
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, pincode: e.target.value.replace(/\D/g, ""), })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Pin Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Country"
                value={companySearchForm.country}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, country: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Country</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Identification No</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Identification No"
                value={companySearchForm.gst_no}
                onChange={(e) => setCompanySearchForm({ ...companySearchForm, gst_no: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Identification No</p>
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
                  value={companySearchForm.status}
                  onValueChange={(value) => setCompanySearchForm({ ...companySearchForm, status: value, })}>
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

  const renderCompanyMappingSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>User Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter User Code"
                value={companyMappingSearchForm.user_code}
                onChange={(e) => setCompanyMappingSearchForm({ ...companyMappingSearchForm, user_code: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter User Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Company Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Company Code"
                value={companyMappingSearchForm.company_no}
                onChange={(e) => setCompanyMappingSearchForm({ ...companyMappingSearchForm, company_no: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Company Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Location No</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Location No"
                value={companyMappingSearchForm.location_no}
                onChange={(e) => setCompanyMappingSearchForm({ ...companyMappingSearchForm, location_no: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Location No</p>
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
                <Select value={companyMappingSearchForm.status} onValueChange={(value) => setCompanyMappingSearchForm({ ...companyMappingSearchForm, status: value, })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((item: any) => (
                      <SelectItem
                        key={item.attributedetails_code}
                        value={item.attributedetails_code}
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

  const renderLocationSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label>Location No</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Location No"
                value={locationSearchForm.location_no}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, location_no: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Location No</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Location Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Location Name"
                value={locationSearchForm.location_name}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, location_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Location Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter City"
                value={locationSearchForm.city}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, city: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter City</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>State</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter State"
                value={locationSearchForm.state}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, state: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter State</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Pin Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Pin Code"
                value={locationSearchForm.pincode}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, pincode: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Pin Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Country"
                value={locationSearchForm.country}
                onChange={(e) => setLocationSearchForm({ ...locationSearchForm, country: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Country</p>
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
                  value={locationSearchForm.status}
                  onValueChange={(value) => setLocationSearchForm({ ...locationSearchForm, status: value, })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    {status.map((status: any) => (
                      <SelectItem
                        key={status.attributedetails_name}
                        value={status.attributedetails_name}
                      >
                        {status.attributedetails_name}
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

  const renderRoleSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>Role ID</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Role ID"
                value={roleSearchForm.role_id}
                onChange={(e) => setRoleSearchForm({ ...roleSearchForm, role_id: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Role ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Role Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Role Name"
                value={roleSearchForm.role_name}
                onChange={(e) => setRoleSearchForm({ ...roleSearchForm, role_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Role Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const renderRoleMappingSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>User Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter User Code"
                value={roleMappingSearchForm.user_code}
                onChange={(e) => setRoleMappingSearchForm({ ...roleMappingSearchForm, user_code: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter User Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>User Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter User Name"
                value={roleMappingSearchForm.user_name}
                onChange={(e) => setRoleMappingSearchForm({ ...roleMappingSearchForm, user_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter User Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Role ID</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Role ID"
                value={roleMappingSearchForm.role_id}
                onChange={(e) => setRoleMappingSearchForm({ ...roleMappingSearchForm, role_id: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Role ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Role Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Role Name"
                value={roleMappingSearchForm.role_name}
                onChange={(e) => setRoleMappingSearchForm({ ...roleMappingSearchForm, role_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Role Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const renderRoleRightsSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>Role ID</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Role ID"
                value={roleRightsSearchForm.role_id}
                onChange={(e) => setRoleRightsSearchForm({ ...roleRightsSearchForm, role_id: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Role ID</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Screen Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Screen Type"
                value={roleRightsSearchForm.screen_type}
                onChange={(e) => setRoleRightsSearchForm({ ...roleRightsSearchForm, screen_type: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Screen Type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Permission Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Permission Type"
                value={roleRightsSearchForm.permission_type}
                onChange={(e) => setRoleRightsSearchForm({ ...roleRightsSearchForm, permission_type: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Permission Type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const renderUserSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>User Code</Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter User Code"
                value={usersSearchForm.user_code}
                onChange={(e) =>
                  setusersSearchForm({
                    ...usersSearchForm,
                    user_code: e.target.value,
                  })
                }
              />
            </TooltipTrigger>
              
            <TooltipContent>
              <p>Enter User Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>User Name</Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter User Name"
                value={usersSearchForm.user_name}
                onChange={(e) =>
                  setusersSearchForm({
                    ...usersSearchForm,
                    user_name: e.target.value,
                  })
                }
              />
            </TooltipTrigger>
              
            <TooltipContent>
              <p>Enter User Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>First Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
        <Input
          placeholder="Enter First Name"
          value={usersSearchForm.first_name}
          onChange={(e) => setusersSearchForm({ ...usersSearchForm, first_name: e.target.value, })} />
          </TooltipTrigger>
              
            <TooltipContent>
              <p>Enter First Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Last Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
        <Input
          placeholder="Enter Last Name"
          value={usersSearchForm.last_name}
          onChange={(e) => setusersSearchForm({ ...usersSearchForm, last_name: e.target.value, })} />
          </TooltipTrigger>
              
            <TooltipContent>
              <p>Enter Last Name</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>User Status</Label>
                    
        <Select
          value={usersSearchForm.user_status}
          onValueChange={(value) =>
            setusersSearchForm({
              ...usersSearchForm,
              user_status: value,
            })
          }
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger>
                  <SelectValue placeholder="Select User Status" />
                </SelectTrigger>
              </TooltipTrigger>
        
              <TooltipContent>
                <p>Select User Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        
          <SelectContent>
            {status.map((item: any) => (
              <SelectItem
                key={item.attributedetails_code}
                value={item.attributedetails_code}
              >
                {item.attributedetails_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>DOB</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
        <Input
          type='date'
          placeholder="Enter DOB"
          value={usersSearchForm.dob}
          onChange={(e) => setusersSearchForm({ ...usersSearchForm, dob: e.target.value, })} />
          </TooltipTrigger>

            <TooltipContent>
              <p>Select DOB</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
  <Label>Gender</Label>

  <Select
    value={usersSearchForm.gender}
    onValueChange={(value) =>
      setusersSearchForm({
        ...usersSearchForm,
        gender: value,
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

    </div>
  );

  const renderAttributeSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label>Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Code"
                value={attributeSearchForm.attributeheader_code}
                onChange={(e) => setAttributeSearchForm({ ...attributeSearchForm, attributeheader_code: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Sub Code</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Sub Code"
                value={attributeSearchForm.attributedetails_code}
                onChange={(e) => setAttributeSearchForm({ ...attributeSearchForm, attributedetails_code: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Sub Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label>Detail Name</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Enter Detail Name"
                value={attributeSearchForm.attributedetails_name}
                onChange={(e) => setAttributeSearchForm({ ...attributeSearchForm, attributedetails_name: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Detail Name</p>
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
                value={attributeSearchForm.descriptions}
                onChange={(e) => setAttributeSearchForm({ ...attributeSearchForm, descriptions: e.target.value, })} />
            </TooltipTrigger>

            <TooltipContent>
              <p>Enter Description</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const renderNumberSeriesSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="space-y-2">
        <Label htmlFor="ScreenType" className={submittedNumberSeries && !numberSeriesSearchForm.Screen_Type ? "text-red-500" : ""}>Screen Type*</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select value={numberSeriesSearchForm.Screen_Type} onValueChange={(value) => setnumberSeriesSearchForm({ ...numberSeriesSearchForm, Screen_Type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Screen Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ScreenType.map((Screen_Type: any) => (
                      <SelectItem
                        key={Screen_Type.attributedetails_name}
                        value={Screen_Type.attributedetails_name}
                      >
                        {Screen_Type.attributedetails_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>Select the Screen Type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    </div>
  );

  const handleSearch = () => {
    switch (activeTab) {
      case "company":
        handleCompanySearch();
        break;

      case "companyMapping":
        handleCompanyMappingSearch();
        break;

      case "location":
        handleLocationSearch();
        break;

      case "role":
        handleRoleSearch();
        break;

      case "roleMapping":
        handleRoleMappingSearch();
        break;

      case "roleRights":
        handleRoleRightsSearch();
        break;

      case "user":
        handleUserSearch();
        break;

      case "attribute":
        handleAttributeSearch();
        break;

      case "NumberSeries":
        handleSearchNumberSeries();
        break;

      default:
        break;
    }
  };

  const handleReset = () => {
    switch (activeTab) {
      case "company":
        setCompanySearchForm({
          company_no: "",
          company_name: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          gst_no: "",
          status: "",
        });
        setCompanies([]);
        break;

      case "companyMapping":
        setCompanyMappingSearchForm({
          user_code: "",
          company_no: "",
          location_no: "",
          status: "",
        });
        setCompanyMappings([]);
        break;

      case "location":
        setLocationSearchForm({
          location_no: "",
          location_name: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          status: "",
        });
        setLocations([]);
        break;

      case "role":
        setRoleSearchForm({
          role_id: "",
          role_name: "",
        });
        setRoles([]);
        break;

      case "roleMapping":
        setRoleMappingSearchForm({
          user_code: "",
          user_name: "",
          role_id: "",
          role_name: "",
        });
        setRoleMappings([]);
        break;

      case "roleRights":
        setRoleRightsSearchForm({
          role_id: "",
          screen_type: "",
          permission_type: "",
        });
        setRoleRights([]);
        break;

      case "user":
        setusersSearchForm({
          company_code: "",
          user_code: "",
          user_name: "",
          first_name: "",
          last_name: "",
          user_status: "",
          dob: "",
          gender: "",
        });
        setUsers([]);
        break;

      case "attribute":
        setAttributeSearchForm({
          attributeheader_code: "",
          attributedetails_code: "",
          attributedetails_name: "",
          descriptions: "",
        });
        setAttributes([]);
        break;

      case "NumberSeries":
        setnumberSeriesSearchForm({
          Screen_Type: ""
        });
        setNumberSeries([]);
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
          <CardContent className="p-6">

            {activeTab === "company" && renderCompanySearch()}

            {activeTab === "companyMapping" && renderCompanyMappingSearch()}

            {activeTab === "location" && renderLocationSearch()}

            {activeTab === "role" && renderRoleSearch()}

            {activeTab === "roleMapping" && renderRoleMappingSearch()}

            {activeTab === "roleRights" && renderRoleRightsSearch()}

            {activeTab === "user" && renderUserSearch()}

            {activeTab === "attribute" && renderAttributeSearch()}

            {activeTab === "NumberSeries" && renderNumberSeriesSearch()}

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

        {/*  companies and Packages */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full">
            <div className="overflow-x-auto min-w-0 max-w-full custom-scrollbar pb-2">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max">
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
                <TabsTrigger value="NumberSeries" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Number Series
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-shrink-0 sm:ml-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {addLabels[activeTab]}
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Add {addLabels[activeTab]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Company Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Company</CardTitle>
                <CardDescription>
                  Manage all companies and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={companies}
                  columnDefs={CompanyColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="400px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Mapping Tab */}
          <TabsContent value="companyMapping">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Company Mapping</CardTitle>
                <CardDescription>
                  Manage all mapping companies and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={companyMappings}
                  columnDefs={CompanyMappingColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>
          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Manage all mapping locations and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={locations}
                  columnDefs={LocationColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="400px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Role Tab */}
          <TabsContent value="role">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Role</CardTitle>
                <CardDescription>
                  Manage all roles and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={roles}
                  columnDefs={roleColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="roleMapping">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Role Mapping</CardTitle>
                <CardDescription>
                  Manage all role mappings and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={roleMappings}
                  columnDefs={RoleMappingColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>


          {/* Role Rights Tab */}
          <TabsContent value="roleRights">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Role Rights</CardTitle>
                <CardDescription>
                  Manage all role rights and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={roleRights}
                  columnDefs={RoleRightsColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Tab */}
          <TabsContent value="user">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>User</CardTitle>
                <CardDescription>
                  Manage all users and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={users}
                  columnDefs={UserColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="400px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attribute Tab */}
          <TabsContent value="attribute">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Attribute</CardTitle>
                <CardDescription>
                  Manage all attributes and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={attributes}
                  columnDefs={AttributeColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* NumberSeries Tab */}
          {/* <TabsContent value="NumberSeries">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>NumberSeries</CardTitle>
                <CardDescription>Manage all NumberSeries and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Screen Type</TableHead>
                      <TableHead>Start Year</TableHead>
                      <TableHead>End Year</TableHead>
                      <TableHead>Start No</TableHead>
                      <TableHead>Running No</TableHead>
                      <TableHead>End No</TableHead>
                      <TableHead>Text</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bill Format</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {numberSeries.map((NumberSeries: any) => (
                      <TableRow
                        key={`${NumberSeries.attributeheader_code}-${NumberSeries.attributedetails_code}`}
                      >
                        <TableCell>{NumberSeries.Screen_Type}</TableCell>
                        <TableCell>{NumberSeries.Start_Year}</TableCell>
                        <TableCell>{NumberSeries.End_Year}</TableCell>
                        <TableCell>{NumberSeries.Start_No}</TableCell>
                        <TableCell>{NumberSeries.Running_No}</TableCell>
                        <TableCell>{NumberSeries.End_No}</TableCell>
                        <TableCell>{NumberSeries.text}</TableCell>
                        <TableCell>{NumberSeries.status}</TableCell>
                        <TableCell>{NumberSeries.bill_format}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditNumberSeries(NumberSeries)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNumberSeries(NumberSeries)}
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

          <TabsContent value="NumberSeries">
            <Card>
              <CardHeader className="text-left items-start">
                <CardTitle>Number Series</CardTitle>
                <CardDescription>
                  Manage all NumberSeries and their details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AgGridTable
                  rowData={numberSeries}
                  columnDefs={NumberSeriesColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  height="300px"
                />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Add/Edit Company Dialog Or Popup*/}
        <Dialog open={isCompanyDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedCompany(false);
          }
          setIsCompanyDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the company details' : 'Create a new company'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.company_no ? "text-red-500" : ""}>Company Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            readOnly={!!editingCompany}
                            value={companyForm.company_no}
                            maxLength={18}
                            onChange={(e) => setCompanyForm({ ...companyForm, company_no: e.target.value })}
                            placeholder="Enter company code (e.g., CMP001)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            {editingCompany
                              ? "Company Code cannot be changed while editing."
                              : "Enter company code"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.company_name ? "text-red-500" : ""}>Company Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.company_name}
                            onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                            placeholder="Enter company name (e.g., ABC Fitness Pvt Ltd)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter company name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.short_name}
                            onChange={(e) => setCompanyForm({ ...companyForm, short_name: e.target.value })}
                            placeholder="Enter short name (e.g., ABC)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter short name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.address1 ? "text-red-500" : ""}>Address 1*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.address1}
                            onChange={(e) => setCompanyForm({ ...companyForm, address1: e.target.value })}
                            placeholder="Enter address line 1"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 1</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.address2 ? "text-red-500" : ""}>Address 2*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.address2}
                            onChange={(e) => setCompanyForm({ ...companyForm, address2: e.target.value })}
                            placeholder="Enter address line 2"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 2</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.address3}
                            onChange={(e) => setCompanyForm({ ...companyForm, address3: e.target.value })}
                            placeholder="Enter address line 3 (optional)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 3</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className={submittedCompany && !companyForm.city ? "text-red-500" : ""}>City*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyForm.city} onValueChange={(value) => setCompanyForm({ ...companyForm, city: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city: any) => (
                                  <SelectItem
                                    key={city.attributedetails_name}
                                    value={city.attributedetails_name}
                                  >
                                    {city.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the city</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className={submittedCompany && !companyForm.state ? "text-red-500" : ""}>State*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyForm.state} onValueChange={(value) => setCompanyForm({ ...companyForm, state: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state: any) => (
                                  <SelectItem
                                    key={state.attributedetails_name}
                                    value={state.attributedetails_name}
                                  >
                                    {state.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the state</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.pincode ? "text-red-500" : ""}>Pin Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            maxLength={10}
                            inputMode="numeric"
                            value={companyForm.pincode}
                            onChange={(e) => setCompanyForm({ ...companyForm, pincode: e.target.value.replace(/\D/g, ""), })}
                            placeholder="Enter Pin Code (e.g., 600001)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Pin Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className={submittedCompany && !companyForm.country ? "text-red-500" : ""}>Country*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyForm.country} onValueChange={(value) => setCompanyForm({ ...companyForm, country: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country: any) => (
                                  <SelectItem
                                    key={country.attributedetails_name}
                                    value={country.attributedetails_name}
                                  >
                                    {country.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the country</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.email_id}
                            onChange={(e) => setCompanyForm({ ...companyForm, email_id: e.target.value })}
                            placeholder="Enter email address (e.g., info@company.com)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedCompany && !companyForm.status ? "text-red-500" : ""}>Status*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyForm.status} onValueChange={(value) => setCompanyForm({ ...companyForm, status: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {status.map((status: any) => (
                                  <SelectItem
                                    key={status.attributedetails_name}
                                    value={status.attributedetails_name}
                                  >
                                    {status.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Founded Date</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            type="date"
                            value={companyForm.foundedDate}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setCompanyForm({ ...companyForm, foundedDate: e.target.value })}
                            // max={new Date().toISOString().split("T")[0]}
                            placeholder="Select founded date"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select founded date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Website URL</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.websiteURL}
                            onChange={(e) => setCompanyForm({ ...companyForm, websiteURL: e.target.value })}
                            placeholder="Enter website URL (e.g., https://www.company.com)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter website URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.contact_no ? "text-red-500" : ""}>Contact No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.contact_no}
                            maxLength={13}
                            inputMode="numeric"
                            onChange={(e) => setCompanyForm({ ...companyForm, contact_no: e.target.value.replace(/\D/g, ""), })}
                            placeholder="Enter contact number (e.g.,+91 9876543210)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter contact number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Annual Report URL</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.annualReportURL}
                            onChange={(e) => setCompanyForm({ ...companyForm, annualReportURL: e.target.value })}
                            placeholder="Enter annual report URL"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter annual report URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Identification No</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={companyForm.company_gst_no}
                            onChange={(e) => setCompanyForm({ ...companyForm, company_gst_no: e.target.value })}
                            placeholder="Enter Identification number (e.g., 33ABCDE1234F1Z5)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter GST number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.location_no ? "text-red-500" : ""}>Location No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyForm.location_no} onValueChange={(value) => setCompanyForm({ ...companyForm, location_no: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {location.map((location: any) => (
                                  <SelectItem
                                    key={location.location_no}
                                    value={location.location_no}
                                  >
                                    {location.location_no} - {location.location_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

              <ImageUpload
                label="Company Images"
                images={companyImages}
                onImagesChange={setCompanyImages}
                onFilesChange={handleCompanyFiles}
                maxImages={2}
                tooltips={["Upload Company Logo", "Upload Signature"]}
              />

            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmittedCompany(false);
                        setIsCompanyDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel without saving changes.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSaveCompany}>
                      {editingCompany ? "Update" : "Create"} Company
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update company details"
                        : "Create a company"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Company Mapping Dialog Or Popup*/}
        <Dialog open={isCompanyMappingDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedCompanyMapping(false);
          }
          setIsCompanyMappingDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompanyMapping ? 'Edit Company Mapping' : 'Add New Company Mapping'}</DialogTitle>
              <DialogDescription>
                {editingCompanyMapping ? 'Update the company mapping details' : 'Create a new company mapping'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Mapping Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="user" className={submittedCompanyMapping && !companyMappingForm.user_code ? "text-red-500" : ""}>User Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyMappingForm.user_code} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, user_code: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select User Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {user.map((user: any) => (
                                  <SelectItem
                                    key={user.user_code}
                                    value={user.user_code}
                                  >
                                    {user.user_code} - {user.user_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the user code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className={submittedCompanyMapping && !companyMappingForm.company_no ? "text-red-500" : ""}>Company Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyMappingForm.company_no} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, company_no: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Company Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {company.map((company: any) => (
                                  <SelectItem
                                    key={company.company_no}
                                    value={company.company_no}
                                  >
                                    {company.company_no} - {company.company_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the company code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className={submittedCompanyMapping && !companyMappingForm.location_no ? "text-red-500" : ""}>Location No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyMappingForm.location_no} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, location_no: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Location No" />
                              </SelectTrigger>
                              <SelectContent>
                                {location.map((location: any) => (
                                  <SelectItem
                                    key={location.location_no}
                                    value={location.location_no}
                                  >
                                    {location.location_no} - {location.location_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the location no</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedCompanyMapping && !companyMappingForm.status ? "text-red-500" : ""}>Status*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={companyMappingForm.status} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, status: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {status.map((status: any) => (
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
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Order No</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            inputMode="numeric"
                            maxLength={3}
                            value={companyMappingForm.order_no}
                            onChange={(e) => setCompanyMappingForm({ ...companyMappingForm, order_no: e.target.value })}
                            placeholder="Enter order number (e.g., 001)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter the order number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>


                </div>
              </div>
            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedCompanyMapping(false);
                      setIsCompanyMappingDialogOpen(false);
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
                    <Button onClick={handleSaveCompanyMapping}>{editingCompanyMapping ? 'Update' : 'Create'} Company Mapping</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompanyMapping
                        ? "Update company mapping"
                        : "Create a company mapping"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Location Dialog Or Popup*/}
        <Dialog open={isLocationDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedLocation(false);
          }
          setIsLocationDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
              <DialogDescription>
                {editingLocation ? 'Update the location details' : 'Create a new location'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Location Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.location_no ? "text-red-500" : ""}>Location No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            maxLength={18}
                            readOnly={!!editingLocation}
                            value={locationForm.location_no}
                            onChange={(e) => setLocationForm({ ...locationForm, location_no: e.target.value })}
                            placeholder="Enter location number (e.g., LOC001)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            {editingLocation
                              ? "Location No cannot be changed while editing."
                              : "Enter location number"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.location_name ? "text-red-500" : ""}>Location Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.location_name}
                            onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                            placeholder="Enter location name (e.g., Chennai Branch)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter location name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.short_name ? "text-red-500" : ""}>Short Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.short_name}
                            onChange={(e) => setLocationForm({ ...locationForm, short_name: e.target.value })}
                            placeholder="Enter short name (e.g., CHN)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter short name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.address1 ? "text-red-500" : ""}>Address 1*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.address1}
                            onChange={(e) => setLocationForm({ ...locationForm, address1: e.target.value })}
                            placeholder="Enter address line 1"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 1</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.address2 ? "text-red-500" : ""}>Address 2*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.address2}
                            onChange={(e) => setLocationForm({ ...locationForm, address2: e.target.value })}
                            placeholder="Enter address line 2"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 2</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.address3}
                            onChange={(e) => setLocationForm({ ...locationForm, address3: e.target.value })}
                            placeholder="Enter address line 3 (optional)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter address line 3</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className={submittedLocation && !locationForm.city ? "text-red-500" : ""}>City*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={locationForm.city} onValueChange={(value) => setLocationForm({ ...locationForm, city: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city: any) => (
                                  <SelectItem
                                    key={city.attributedetails_name}
                                    value={city.attributedetails_name}
                                  >
                                    {city.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the city</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className={submittedLocation && !locationForm.state ? "text-red-500" : ""}>State*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={locationForm.state} onValueChange={(value) => setLocationForm({ ...locationForm, state: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((city: any) => (
                                  <SelectItem
                                    key={city.attributedetails_name}
                                    value={city.attributedetails_name}
                                  >
                                    {city.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the state</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.pincode ? "text-red-500" : ""}>Pin Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            inputMode="numeric"
                            maxLength={10}
                            value={locationForm.pincode}
                            onChange={(e) => setLocationForm({ ...locationForm, pincode: e.target.value })}
                            placeholder="Enter Pin code (e.g., 600001)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter PIN code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className={submittedLocation && !locationForm.country ? "text-red-500" : ""}>Country*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={locationForm.country} onValueChange={(value) => setLocationForm({ ...locationForm, country: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country: any) => (
                                  <SelectItem
                                    key={country.attributedetails_name}
                                    value={country.attributedetails_name}
                                  >
                                    {country.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the country</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.email_id}
                            onChange={(e) => setLocationForm({ ...locationForm, email_id: e.target.value })}
                            placeholder="Enter email address (e.g., branch@example.com)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedLocation && !locationForm.status ? "text-red-500" : ""}>Status*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={locationForm.status} onValueChange={(value) => setLocationForm({ ...locationForm, status: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {status.map((status: any) => (
                                  <SelectItem
                                    key={status.attributedetails_name}
                                    value={status.attributedetails_name}
                                  >
                                    {status.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.contact_no ? "text-red-500" : ""}>Contact No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={locationForm.contact_no}
                            maxLength={100}
                            inputMode="numeric"
                            onChange={(e) => setLocationForm({ ...locationForm, contact_no: e.target.value.replace(/\D/g, ""), })}
                            placeholder="Enter contact number (e.g., +91 9876543210)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter contact number</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedLocation(false);
                      setIsLocationDialogOpen(false);
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
                    <Button onClick={handleSaveLocation}>{editingLocation ? 'Update' : 'Create'} Location</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update location details"
                        : "Create a location"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Dialog Or Popup*/}
        <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedRole(false);
          }
          setIsRoleDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update the role details' : 'Create a new role'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Role Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedRole && !roleForm.role_id ? "text-red-500" : ""}>Role ID*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            readOnly={!!editingRole}
                            value={roleForm.role_id}
                            onChange={(e) => setRoleForm({ ...roleForm, role_id: e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""), })}
                            placeholder="Enter the role id (e.g., ADMIN)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter the role id</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedRole && !roleForm.role_name ? "text-red-500" : ""}>Role Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="name"
                            value={roleForm.role_name}
                            onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""), })}
                            placeholder="Enter the role name (e.g., Administrator)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter the role name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Description</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Textarea
                          id="name"
                          value={roleForm.description}
                          onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                          placeholder="Enter a brief description of the role and its responsibilities"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter the description of the role</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>
            </div>

            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedRole(false);
                      setIsRoleDialogOpen(false);
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
                    <Button onClick={handleSaveRole}>{editingRole ? 'Update' : 'Create'} Role</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update the role"
                        : "Create a role"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Mapping Dialog Or Popup*/}
        <Dialog open={isRoleMappingDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedRoleMapping(false);
          }
          setIsRoleMappingDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoleMapping ? 'Edit Role Mapping' : 'Add New Role Mapping'}</DialogTitle>
              <DialogDescription>
                {editingRoleMapping ? 'Update the role mapping details' : 'Create a new role mapping'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Role Mapping Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="user" className={submittedRoleMapping && !roleMappingForm.user_code ? "text-red-500" : ""}>User Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={roleMappingForm.user_code} onValueChange={(value) => setRoleMappingForm({ ...roleMappingForm, user_code: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select User Code" />
                              </SelectTrigger>
                              <SelectContent>
                                {user.map((user: any) => (
                                  <SelectItem
                                    key={user.user_code}
                                    value={user.user_code}
                                  >
                                    {user.user_code} - {user.user_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the user code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className={submittedRoleMapping && !roleMappingForm.role_id ? "text-red-500" : ""}>Role ID*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={roleMappingForm.role_id} onValueChange={(value) => setRoleMappingForm({ ...roleMappingForm, role_id: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role ID" />
                              </SelectTrigger>
                              <SelectContent>
                                {role.map((role: any) => (
                                  <SelectItem
                                    key={role.role_id}
                                    value={role.role_id}
                                  >
                                    {role.role_id} - {role.role_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the role id</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedRoleMapping(false);
                      setIsRoleMappingDialogOpen(false)
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
                    <Button onClick={handleSaveRoleMapping}>{editingRoleMapping ? 'Update' : 'Create'} Role Mapping</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update role mapping"
                        : "Create a role mapping"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Rights Dialog Or Popup*/}
        <Dialog open={isRoleRightsDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedRoleRights(false);
          }
          setIsRoleRightsDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoleRight ? 'Edit Role Rights' : 'Add New Role Rights'}</DialogTitle>
              <DialogDescription>
                {editingRoleRight ? 'Update the role rights details' : 'Create a new role rights'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Role Rights Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="role" className={submittedRoleRights && !roleRightsForm.role_id ? "text-red-500" : ""}>Role ID*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={roleRightsForm.role_id} onValueChange={(value) => setRoleRightsForm({ ...roleRightsForm, role_id: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role ID" />
                              </SelectTrigger>
                              <SelectContent>
                                {roleRight.map((roleRight: any) => (
                                  <SelectItem
                                    key={roleRight.role_id}
                                    value={roleRight.role_id}
                                  >
                                    {roleRight.role_id} - {roleRight.role_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the role id</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screen" className={submittedRoleRights && !roleRightsForm.screen_type ? "text-red-500" : ""}>Screen Type*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={roleRightsForm.screen_type} onValueChange={(value) => setRoleRightsForm({ ...roleRightsForm, screen_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Screen Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {screen.map((screen: any) => (
                                  <SelectItem
                                    key={screen.attributedetails_code}
                                    value={screen.attributedetails_code}
                                  >
                                    {screen.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the screen type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permission" className={submittedRoleRights && !roleRightsForm.permission_type ? "text-red-500" : ""}>Permission Type*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={roleRightsForm.permission_type} onValueChange={(value) => setRoleRightsForm({ ...roleRightsForm, permission_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Permission Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {permission.map((permission: any) => (
                                  <SelectItem
                                    key={permission.attributedetails_name}
                                    value={permission.attributedetails_name}
                                  >
                                    {permission.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the permission type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>

            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedRoleRights(false);
                      setIsRoleRightsDialogOpen(false);
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
                    <Button onClick={handleSaveRoleRight}>{editingRoleRight ? 'Update' : 'Create'} Role Rights</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update role rights"
                        : "Create a role rights"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit User Dialog Or Popup*/}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update the User details' : 'Create a new User'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">User Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedUser && !userForm.user_code ? "text-red-500" : ""}>User Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="UserCode"
                      readOnly={!!editingUser}
                      value={userForm.user_code}
                      onChange={(e) => setUserForm({ ...userForm, user_code: e.target.value })}
                      placeholder="e.g., User Code"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter User Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="name">User Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_name ? "text-red-500" : ""}>User Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="UserName"
                      value={userForm.user_name}
                      onChange={(e) => setUserForm({ ...userForm, user_name: e.target.value })}
                      placeholder="e.g., User Name"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter User Name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="FirstName">First Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.first_name ? "text-red-500" : ""}>First Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="FirstName"
                      value={userForm.first_name}
                      onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                      placeholder="e.g., First Name"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter First Name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="LastName">Last Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.last_name ? "text-red-500" : ""}>Last Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="LastName"
                      value={userForm.last_name}
                      onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                      placeholder="e.g., Last Name"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Last Name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="name">Password*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_password ? "text-red-500" : ""}>Password*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <div className="relative">
                      <Input
                        id="Password"
                        type={showPassword ? "text" : "password"}
                        value={userForm.user_password}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            user_password: e.target.value,
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

                  <div className="space-y-2">
                    {/* <Label htmlFor="UserCode">Status*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_status ? "text-red-500" : ""}>Status*</Label>
                    <Select
                      value={userForm.user_status}
                      onValueChange={(value) =>
                        setUserForm({ ...userForm, user_status: value })
                      }
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </TooltipTrigger>
                    
                          <TooltipContent>
                            <p>Select the status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    
                      <SelectContent>
                        {status.map((status: any) => (
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={submittedUser && !userForm.role_id ? "text-red-500" : ""}
                    >
                      Role ID*
                    </Label>

                    <Select
                      value={userForm.role_id}
                      onValueChange={(value) =>
                        setUserForm({ ...userForm, role_id: value })
                      }
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Role ID" />
                            </SelectTrigger>
                          </TooltipTrigger>
                    
                          <TooltipContent>
                            <p>Select Role ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    
                      <SelectContent>
                        {role.map((role: any) => (
                          <SelectItem
                            key={role.role_id}
                            value={role.role_id}
                          >
                            {role.role_id} - {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="Email">Email*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="Email"
                      value={userForm.email_id}
                      onChange={(e) => setUserForm({ ...userForm, email_id: e.target.value })}
                      placeholder="e.g., Email"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Email</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="DOB">DOB*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.dob ? "text-red-500" : ""}>DOB*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <Input
                      id="DOB"
                      type='date'
                      value={userForm.dob}
                      onChange={(e) => setUserForm({ ...userForm, dob: e.target.value })}
                      placeholder="e.g., DOB"
                    />
                    </TooltipTrigger>

                        <TooltipContent>
                          <p>Select DOB</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>

                  <Select
                    value={userForm.gender}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, gender: value })
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

                  <div className="space-x-2">
                    <Switch
                      id="isActive"
                      checked={userForm.super_admin}
                      disabled={!["sa", "super admin"].includes(userForm.role_id?.toLowerCase())}
                      onCheckedChange={(checked) => setUserForm({ ...userForm, super_admin: checked })}
                    />
                    <Label htmlFor="isActive">Super Admin</Label>
                  </div>
                </div>
              </div>

              <ImageUpload
                label="User Image"
                images={userImages}
                onImagesChange={setUserImages}
                onFilesChange={handleUserFiles}
                maxImages={1}
              />

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsUserDialogOpen(false);
                setSubmittedUser(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveUser}>{editingUser ? 'Update User' : 'Create User'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Attribute Detail Dialog Or Popup*/}
        <Dialog open={isAttributeDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedAttributeDet(false);
          }
          setIsAttributeDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAttribute ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
              <DialogDescription>
                {editingAttribute ? 'Update the Attribute details' : 'Create a new Attribute'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Attribute Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="attributeheader_code" className={submittedAttributeDet && !attributeForm.attributeheader_code ? "text-red-500" : ""}>Code*</Label>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex-1">
                              <Select
                                value={attributeForm.attributeheader_code}
                                onValueChange={(value) => setAttributeForm({ ...attributeForm, attributeheader_code: value, })}
                                disabled={!!editingAttribute}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Select Code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {attributehdr.map((attributeheader: any) => (
                                    <SelectItem
                                      key={attributeheader.attributeheader_code}
                                      value={attributeheader.attributeheader_code}
                                    >
                                      {attributeheader.attributeheader_code} - {attributeheader.attributeheader_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>
                              {editingAttribute
                                ? "Attribute Header Code cannot be changed while editing."
                                : "Select the attribute header code."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {!editingAttribute && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type="button" variant="outline" onClick={handleAddAttributeHdr}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>Add Attribute Header</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="SubCode" className={submittedAttributeDet && !attributeForm.attributedetails_code ? "text-red-500" : ""}>Sub Code*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="SubCode"
                            value={attributeForm.attributedetails_code}
                            onChange={(e) => setAttributeForm({ ...attributeForm, attributedetails_code: e.target.value })}
                            disabled={!!editingAttribute}
                            placeholder="Enter the sub code (e.g., ACTIVE)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter the sub code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="DetailsName" className={submittedAttributeDet && !attributeForm.attributedetails_name ? "text-red-500" : ""}>Details Name*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="DetailsName"
                            value={attributeForm.attributedetails_name}
                            onChange={(e) => setAttributeForm({ ...attributeForm, attributedetails_name: e.target.value })}
                            placeholder="Enter the details name (e.g., Active)"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter the details name</p>
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
                          value={attributeForm.descriptions}
                          onChange={(e) => setAttributeForm({ ...attributeForm, descriptions: e.target.value })}
                          placeholder="Enter the description"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Enter the description</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </div>
            </div>
            <DialogFooter>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedAttributeDet(false);
                      setIsAttributeDialogOpen(false);
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
                    <Button onClick={handleSaveAttribute}>{editingAttribute ? 'Update' : 'Create'} Attribute Detail</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingCompany
                        ? "Update attribute detail"
                        : "Create a attribute detail"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Attribute Header Dialog  Or Popup*/}
        <Dialog open={isAttributeHdrDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedAttributeHdr(false);
          }
          setIsAttributeHdrDialogOpen(open);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Attribute Hdr</DialogTitle>
              <DialogDescription>Create a new Attribute Header</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">

              <div className="space-y-2">
                <Label htmlFor="code" className={submittedAttributeHdr && !attributeHdrForm.attributeheader_code ? "text-red-500" : ""}>Code*</Label>
                <TooltipProvider>
                  <Tooltip>-
                    <TooltipTrigger asChild>
                      <Input
                        id="Code"
                        value={attributeHdrForm.attributeheader_code}
                        onChange={(e) => setAttributeHdrForm({ ...attributeHdrForm, attributeheader_code: e.target.value, })}
                        placeholder="Enter attribute code (e.g., ACCOUNT_TYPE)"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter attribute code</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className={submittedAttributeHdr && !attributeHdrForm.attributeheader_name ? "text-red-500" : ""}>Name*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="Name"
                        value={attributeHdrForm.attributeheader_name}
                        onChange={(e) => setAttributeHdrForm({ ...attributeHdrForm, attributeheader_name: e.target.value, })}
                        placeholder="Enter attribute name (e.g., Account Type)"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Enter attribute name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className={submittedAttributeHdr && !attributeHdrForm.status ? "text-red-500" : ""}>Status*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select value={attributeHdrForm.status} onValueChange={(value) => setAttributeHdrForm({ ...attributeHdrForm, status: value, })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((status: any) => (
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
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select the status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

            </div>

            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedAttributeHdr(false);
                      setIsAttributeHdrDialogOpen(false);
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
                    <Button onClick={handleCreateAttributeHdr}>Create Attribute Header</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Create a Attribute header</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Numberseries Dialog Or Popup*/}
        <Dialog open={isNumberSeriesDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setSubmittedNumberSeries(false);
          }
          setIsNumberSeriesDialogOpen(open);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNumberSeries ? 'Edit Nunmber Series ' : 'Add Nunmber Series '}</DialogTitle>
              <DialogDescription>
                {editingNumberSeries ? 'Update the Nunmber Series  details' : 'Create a new Nunmber Series '}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Nunmber Series Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="ScreenType" className={submittedNumberSeries && !numberSeriesForm.Screen_Type ? "text-red-500" : ""}>Screen Type*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={numberSeriesForm.Screen_Type} onValueChange={(value) => setNumberSeriesForm({ ...numberSeriesForm, Screen_Type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Screen Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {ScreenType.map((Screen_Type: any) => (
                                  <SelectItem
                                    key={Screen_Type.attributedetails_name}
                                    value={Screen_Type.attributedetails_name}
                                  >
                                    {Screen_Type.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the Screen Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="StartYear" className={submittedNumberSeries && !numberSeriesForm.Start_Year ? "text-red-500" : ""}>Start Year*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="StartYear"
                            type="date"
                            min={fyStart}
                            max={fyEnd}
                            value={numberSeriesForm.Start_Year}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, Start_Year: e.target.value })}
                            placeholder="Select Start Year"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select Start Year</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="EndYear" className={submittedNumberSeries && !numberSeriesForm.End_Year ? "text-red-500" : ""}>End Year*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="EndYear"
                            type="date"
                            min={fyStart}
                            max={fyEnd}
                            value={numberSeriesForm.End_Year}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, End_Year: e.target.value })}
                            placeholder="Select End Year"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select End Year</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Start No" className={submittedNumberSeries && !numberSeriesForm.Start_No ? "text-red-500" : ""}>Start No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="Start No"
                            value={numberSeriesForm.Start_No}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, Start_No: e.target.value })}
                            placeholder="Enter Start No"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Start No</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Running No" className={submittedNumberSeries && !numberSeriesForm.Running_No ? "text-red-500" : ""}>Running No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="Running No"
                            value={numberSeriesForm.Running_No}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, Running_No: e.target.value })}
                            placeholder="Enter Running No"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter Running No</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="End No" className={submittedNumberSeries && !numberSeriesForm.End_No ? "text-red-500" : ""}>End No*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="End No"
                            value={numberSeriesForm.End_No}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, End_No: e.target.value })}
                            placeholder="Enter End No"
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter End No</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Text" className={submittedNumberSeries && !numberSeriesForm.text ? "text-red-500" : ""}>Text*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="text"
                            value={numberSeriesForm.text}
                            onChange={(e) => setNumberSeriesForm({ ...numberSeriesForm, text: e.target.value })}
                            placeholder="Enter text"
                          />

                        </TooltipTrigger>

                        <TooltipContent>
                          <p>text</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Number Prefix" className={submittedNumberSeries && !numberSeriesForm.number_prefix ? "text-red-500" : ""}>Number Prefix*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={numberSeriesForm.number_prefix} onValueChange={(value) => setNumberSeriesForm({ ...numberSeriesForm, number_prefix: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Number Prefix" />
                              </SelectTrigger>
                              <SelectContent>
                                {NumberPrefix.map((Number_Prefix: any) => (
                                  <SelectItem
                                    key={Number_Prefix.attributedetails_name}
                                    value={Number_Prefix.attributedetails_name}
                                  >
                                    {Number_Prefix.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the Number Prefix</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Bill Format" className={submittedNumberSeries && !numberSeriesForm.bill_format ? "text-red-500" : ""}>Bill Format*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={numberSeriesForm.bill_format} onValueChange={(value) => setNumberSeriesForm({ ...numberSeriesForm, bill_format: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Bill Format" />
                              </SelectTrigger>
                              <SelectContent>
                                {BillFormat.map((bill_format: any) => (
                                  <SelectItem
                                    key={bill_format.attributedetails_name}
                                    value={bill_format.attributedetails_name}
                                  >
                                    {bill_format.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the Bill Format</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Status" className={submittedNumberSeries && !numberSeriesForm.Status ? "text-red-500" : ""}>Status*</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select value={numberSeriesForm.Status} onValueChange={(value) => setNumberSeriesForm({ ...numberSeriesForm, Status: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {status.map((status: any) => (
                                  <SelectItem
                                    key={status.attributedetails_name}
                                    value={status.attributedetails_name}
                                  >
                                    {status.attributedetails_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Select the status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => {
                      setSubmittedNumberSeries(false);
                      setIsNumberSeriesDialogOpen(false);
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
                    <Button onClick={handleSaveNumberSeries}>{editingNumberSeries ? 'Update' : 'Create'} Nunmber Series</Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {editingNumberSeries
                        ? "Update Nunmber Series"
                        : "Create a Nunmber Series"}
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
