
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
import { ArrowLeft, Plus, Search, RotateCcw, Dumbbell, Package, Users, Clock, Edit, Trash2, Eye, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from "../ImageUpload";
import { BASE_URL } from '../ApiConfig';


const WorkoutProgramManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [searchTerm, setSearchTerm] = useState('');
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

  //Attribute Detail Screen
  const [attributehdr, setAttributeHdr] = useState<any[]>([]);


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

  // Added by Dinesh Gokul - 23-06-2026 for User
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
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [authorisedSignature, setAuthorisedSignature] = useState<File | null>(null);

  const handleCompanyFiles = (files: (File | null)[]) => {
    setCompanyLogo(files[0]);
    setAuthorisedSignature(files[1]);
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

  //User Dialog States
  const [submittedUser, setSubmittedUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userCodeNameDrop, setUserCodeNameDrop] = useState([]);
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
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [userImages, setUserImages] = useState<(File | null)[]>([]);

  const handleUserFiles = (file: (File | null)[]) => {
    setUserImages(file);
  };

  //Attribute Dialog States
  const [submittedAttributeDet, setSubmittedAttributeDet] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [editingAttribute, setEditingAttribute] = useState<any>(null);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [attributeForm, setAttributeForm] = useState({
    company_code: "COMP001",
    attributeheader_code: "",
    attributedetails_code: "",
    attributedetails_name: "",
    descriptions: "",
    created_by: "admin",
    modified_by: "admin",
  });

  //Add Attribute Header Dialog States
  const [submittedAttributeHdr, setSubmittedAttributeHdr] = useState(false);
  const [isAttributeHdrDialogOpen, setIsAttributeHdrDialogOpen] = useState(false);
  const [attributeHdrForm, setAttributeHdrForm] = useState({
    company_code: "COMP001", attributeheader_code: "", attributeheader_name: "", status: "Active", created_by: "admin", modified_by: "admin", tempstr1: "", tempstr2: "",
    tempstr3: "", tempstr4: "", datetime1: "", datetime2: "", datetime3: "", datetime4: "",
  });


  //Company CRUD Functions
  const handleAddCompany = () => {
    fetchCities();
    fetchStates();
    fetchCountries();
    fetchStatus();
    fetchLocation();
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

      if (companyLogo) {
        formData.append("company_logo", companyLogo);
      }

      if (authorisedSignature) {
        formData.append("authorisedSignatur", authorisedSignature);
      }

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

        // fetchCompanies();
        setIsCompanyDialogOpen(false);
        setSubmittedCompany(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create company.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompany = async () => {
    setSubmittedCompany(true);

    if (!validateCompany()) return;

    try {
      const formData = new FormData();

      Object.keys(companyForm).forEach((key) => {
        formData.append(key, companyForm[key as keyof typeof companyForm]);
      });

      if (companyLogo) {
        formData.append("company_logo", companyLogo);
      }

      if (authorisedSignature) {
        formData.append("authorisedSignatur", authorisedSignature);
      }

      const response = await fetch(`${BASE_URL}/CompanyUpdate`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Company updated successfully.",
        });

        // fetchCompanies();
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
          method: "DELETE",
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

        // fetchCompanies();
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
        // Update your table/grid data
        setCompanies(data);

        // or if your state is named differently:
        // setCompanyData(data);
      } else {
        alert(data);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  //Company Mapping CRUD Functions
  const handleAddCompanyMapping = () => {
    fetchUsers();
    fetchCompanies();
    fetchStatus();
    fetchLocation();
    setEditingCompanyMapping(null);
    setCompanyMappingForm({
      company_code: "",
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

        // fetchCompanyMappings();
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
          method: "PUT",
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

        // fetchCompanyMappings();
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
          method: "DELETE",
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

        // fetchCompanyMappings();
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

  const handleEditCompanyMapping = (mapping: any) => {
    setEditingCompanyMapping(mapping);

    setCompanyMappingForm({
      company_code: mapping.company_code,
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
    fetchCities();
    fetchStates();
    fetchCountries();
    fetchStatus();
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

        // fetchLocations();
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
          method: "PUT",
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

        // fetchLocations();
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
    if (!window.confirm("Delete this location?")) return;

    try {
      const response = await fetch(`${BASE_URL}/deletelocation`,
        {
          method: "DELETE",
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

        // fetchLocations();
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
      company_code: "",
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

        // fetchRoles();
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

        // fetchRoles();
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

        // fetchRoles();
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

  const handleEditRole = (role: any) => {
    setEditingRole(role);

    setRoleForm({
      company_code: role.company_code,
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
    fetchUsers();
    fetchRole();
    setEditingRoleMapping(null);
    setRoleMappingForm({
      company_code: "",
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

        // fetchRoleMappings();
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

        // fetchRoleMappings();
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

        // fetchRoleMappings();
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

  const handleEditRoleMapping = (mapping: any) => {
    setEditingRoleMapping(mapping);

    setRoleMappingForm({
      company_code: mapping.company_code,
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
    fetchPermission();
    fetchRoleRight();
    fetchScreen();
    setEditingRoleRight(null);
    setRoleRightsForm({
      company_code: "",
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

        // fetchRoleRights();
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
        method: "PUT",
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

        // fetchRoleRights();
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
        method: "DELETE",
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

        // fetchRoleRights();
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

  const handleEditRoleRight = (item: any) => {
    setEditingRoleRight(item);

    setRoleRightsForm({
      company_code: item.company_code,
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
    fetchStatus();
    fetchLogInLogOut();
    fetchGender();
    fetchRole();
    setEditingUser(null);
    setUserForm({
      company_code: "YJKT",
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
    setImages([]);
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

      Object.entries(userForm).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (userImages?.length > 0 && userImages[0]) {
        formData.append("user_img", userImages[0]);
      }

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

        // fetchUsers();
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

  // const handleUpdateUser = async () => {
  //   setSubmittedUser(true);

  //   if (!validateUser()) return;
  //   try {
  //     const formData = new FormData();

  //     Object.entries(userForm).forEach(([key, value]) => {
  //       formData.append(key, value as string);
  //     });

  //     if (userImages.length > 0) {
  //       formData.append("user_images", userImages[0]);
  //     }

  //     const response = await fetch(`${BASE_URL}/UserUpdates`, {
  //       method: "PUT",
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert(data);
  //       setEditingUser(null);
  //       setIsUserDialogOpen(false);
  //       setSubmittedUser(false);
  //       // fetchUsers();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleUpdateUser = async () => {
    setSubmittedUser(true);

    if (!validateUser()) return;

    try {
      const formData = new FormData();

      Object.entries(userForm).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (userImages.length > 0) {
        formData.append("user_images", userImages[0]);
      }

      const response = await fetch(`${BASE_URL}/UserUpdates`, {
        method: "PUT",
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

        // fetchUsers();
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

  // const handleDeleteUser = async (user_code: string) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this company?"
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     const response = await fetch(`${BASE_URL}/userdelete`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "modified-by": "admin",
  //         "company_code": "COMP001",
  //       },
  //       body: JSON.stringify({
  //         user_codes: [user_code],
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert(data);
  //       // fetchUsers();
  //     } else {
  //       alert(data.message || data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleDeleteUser = async (user_code: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/userdelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
          "company_code": "COMP001",
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

        // fetchUsers();
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

  const handleEditUser = (user: any) => {
    setEditingUser(user);

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
      super_admin: user.super_admin,
      created_by: user.created_by,
      modified_by: user.modified_by,
    });

    // setImages([]);
    setIsUserDialogOpen(true);
  };

  //Attribute Detail CRUD Functions
  const handleAddAttribute = () => {
    fetchAttributeHdr();
    setEditingAttribute(null);
    setAttributeForm({
      company_code: "",
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

        // fetchAttributes();

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
        method: "PUT",
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

        // fetchAttributes();
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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "modified-by": "admin",
          "company_code": "COMP001",
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

        // fetchAttributes();
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
    fetchStatus();
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
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Company No */}
              <div className="space-y-2">
                <Label>Company No</Label>
                <Input
                  placeholder="Enter Company No"
                  value={companySearchForm.company_no}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, company_no: e.target.value, })} />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="Enter Company Name"
                  value={companySearchForm.company_name}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, company_name: e.target.value, })} />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Enter City"
                  value={companySearchForm.city}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, city: e.target.value, })} />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  placeholder="Enter State"
                  value={companySearchForm.state}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, state: e.target.value, })} />
              </div>

              {/* Pin Code */}
              <div className="space-y-2">
                <Label>Pin Code</Label>
                <Input
                  placeholder="Enter Pin Code"
                  value={companySearchForm.pincode}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, pincode: e.target.value, })} />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  placeholder="Enter Country"
                  value={companySearchForm.country}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, country: e.target.value, })} />
              </div>

              {/* GST No */}
              <div className="space-y-2">
                <Label>GST No</Label>
                <Input
                  placeholder="Enter GST No"
                  value={companySearchForm.gst_no}
                  onChange={(e) => setCompanySearchForm({ ...companySearchForm, gst_no: e.target.value, })} />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={companySearchForm.status}
                  onValueChange={(value) => setCompanySearchForm({ ...companySearchForm, status: value, })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button size="icon" className="rounded-full" onClick={handleCompanySearch}>
                <Search className="h-5 w-5" />
              </Button>

              <Button size="icon" variant="secondary" className="rounded-full"
              // onClick={handleReset}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
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
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.company_no}>
                        <TableCell>{company.company_no}</TableCell>
                        <TableCell>{company.company_name}</TableCell>
                        <TableCell>{company.short_name}</TableCell>
                        <TableCell>{company.address1}</TableCell>
                        <TableCell>{company.address2}</TableCell>
                        <TableCell>{company.address3}</TableCell>
                        <TableCell>{company.city}</TableCell>
                        <TableCell>{company.state}</TableCell>
                        <TableCell>{company.pincode}</TableCell>
                        <TableCell>{company.country}</TableCell>
                        <TableCell>{company.email_id}</TableCell>
                        <TableCell>{company.status}</TableCell>
                        <TableCell>{company.foundedDate}</TableCell>
                        <TableCell>{company.websiteURL}</TableCell>
                        <TableCell>{company.contact_no}</TableCell>
                        <TableCell>{company.annualReportURL}</TableCell>
                        <TableCell>{company.location_no}</TableCell>
                        <TableCell>{company.company_gst_no}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCompany(company)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCompany(company.company_no)}
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
                    {companyMappings.map((mapping: any) => (
                      <TableRow key={mapping.keyfiels}>
                        <TableCell>{mapping.user_code}</TableCell>
                        <TableCell>{mapping.company_no}</TableCell>
                        <TableCell>{mapping.location_no}</TableCell>
                        <TableCell>{mapping.status}</TableCell>
                        <TableCell>{mapping.order_no}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCompanyMapping(mapping)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteCompanyMapping(mapping.keyfiels)
                              }
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
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Manage all locations and their details</CardDescription>
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
                    {locations.map((location) => (
                      <TableRow key={location.location_no}>
                        <TableCell>{location.location_no}</TableCell>
                        <TableCell>{location.location_name}</TableCell>
                        <TableCell>{location.short_name}</TableCell>
                        <TableCell>{location.address1}</TableCell>
                        <TableCell>{location.address2}</TableCell>
                        <TableCell>{location.address3}</TableCell>
                        <TableCell>{location.city}</TableCell>
                        <TableCell>{location.state}</TableCell>
                        <TableCell>{location.pincode}</TableCell>
                        <TableCell>{location.country}</TableCell>
                        <TableCell>{location.email_id}</TableCell>
                        <TableCell>{location.status}</TableCell>
                        <TableCell>{location.contact_no}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLocation(location)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteLocation(location.location_no)
                              }
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
          </TabsContent>

          {/* Role Tab */}
          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle>Role</CardTitle>
                <CardDescription>
                  Manage all roles and their details
                </CardDescription>
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
                    {roles.map((role: any) => (
                      <TableRow key={role.role_id}>
                        <TableCell className="font-medium">
                          {role.role_id}
                        </TableCell>

                        <TableCell>{role.role_name}</TableCell>

                        <TableCell>{role.description}</TableCell>

                        <TableCell>{role.keyfield}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(role.role_id)}
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
                    {roleMappings.map((item: any) => (
                      <TableRow key={item.keyfield}>
                        <TableCell>{item.user_code}</TableCell>
                        <TableCell>{item.user_name}</TableCell>
                        <TableCell>{item.role_id}</TableCell>
                        <TableCell>{item.role_name}</TableCell>
                        <TableCell>{item.keyfield}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRoleMapping(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteRoleMapping(item.keyfield)
                              }
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
          </TabsContent>

          {/* Role Rights Tab */}
          <TabsContent value="roleRights">
            <Card>
              <CardHeader>
                <CardTitle>Role Rights</CardTitle>
                <CardDescription>Manage all role and their rights detail</CardDescription>
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
                    {roleRights.map((item: any) => (
                      <TableRow key={item.keyfield}>
                        <TableCell>{item.role_id}</TableCell>
                        <TableCell>{item.screen_type}</TableCell>
                        <TableCell>{item.permission_type}</TableCell>
                        <TableCell>{item.keyfield}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRoleRight(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteRoleRight(item.keyfield)
                              }
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
                    {users.map((user: any) => (
                      <TableRow key={user.user_code}>
                        <TableCell>{user.user_code}</TableCell>
                        <TableCell>{user.user_name}</TableCell>
                        <TableCell>{user.first_name}</TableCell>
                        <TableCell>{user.last_name}</TableCell>
                        <TableCell>{user.user_status}</TableCell>
                        <TableCell>{user.dob}</TableCell>
                        <TableCell>{user.gender}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.user_code)}
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
                    {attributes.map((attribute: any) => (
                      <TableRow
                        key={`${attribute.attributeheader_code}-${attribute.attributedetails_code}`}
                      >
                        <TableCell>{attribute.attributeheader_code}</TableCell>
                        <TableCell>{attribute.attributedetails_code}</TableCell>
                        <TableCell>{attribute.attributedetails_name}</TableCell>
                        <TableCell>{attribute.descriptions}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAttribute(attribute)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteAttribute(
                                  attribute.attributeheader_code,
                                  attribute.attributedetails_code
                                )
                              }
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
                    <Input
                      id="name"
                      value={companyForm.company_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_no: e.target.value })}
                      placeholder="Enter company code (e.g., CMP001)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.company_name ? "text-red-500" : ""}>Company Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.company_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                      placeholder="Enter company name (e.g., ABC Fitness Pvt Ltd)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name</Label>
                    <Input
                      id="name"
                      value={companyForm.short_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, short_name: e.target.value })}
                      placeholder="Enter short name (e.g., ABC)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.address1 ? "text-red-500" : ""}>Address 1*</Label>
                    <Input
                      id="name"
                      value={companyForm.address1}
                      onChange={(e) => setCompanyForm({ ...companyForm, address1: e.target.value })}
                      placeholder="Enter address line 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.address2 ? "text-red-500" : ""}>Address 2*</Label>
                    <Input
                      id="name"
                      value={companyForm.address2}
                      onChange={(e) => setCompanyForm({ ...companyForm, address2: e.target.value })}
                      placeholder="Enter address line 2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={companyForm.address3}
                      onChange={(e) => setCompanyForm({ ...companyForm, address3: e.target.value })}
                      placeholder="Enter address line 3 (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className={submittedCompany && !companyForm.city ? "text-red-500" : ""}>City*</Label>
                    <Select value={companyForm.city} onValueChange={(value) => setCompanyForm({ ...companyForm, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city: any) => (
                          <SelectItem
                            key={city.attributedetails_code}
                            value={city.attributedetails_code}
                          >
                            {city.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className={submittedCompany && !companyForm.state ? "text-red-500" : ""}>State*</Label>
                    <Select value={companyForm.state} onValueChange={(value) => setCompanyForm({ ...companyForm, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state: any) => (
                          <SelectItem
                            key={state.attributedetails_code}
                            value={state.attributedetails_code}
                          >
                            {state.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.pincode ? "text-red-500" : ""}>Pin Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.pincode}
                      onChange={(e) => setCompanyForm({ ...companyForm, pincode: e.target.value })}
                      placeholder="Enter PIN code (e.g., 600001)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className={submittedCompany && !companyForm.country ? "text-red-500" : ""}>Country*</Label>
                    <Select value={companyForm.country} onValueChange={(value) => setCompanyForm({ ...companyForm, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country: any) => (
                          <SelectItem
                            key={country.attributedetails_code}
                            value={country.attributedetails_code}
                          >
                            {country.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <Input
                      id="name"
                      value={companyForm.email_id}
                      onChange={(e) => setCompanyForm({ ...companyForm, email_id: e.target.value })}
                      placeholder="Enter email address (e.g., info@company.com)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedCompany && !companyForm.status ? "text-red-500" : ""}>Status*</Label>
                    <Select value={companyForm.status} onValueChange={(value) => setCompanyForm({ ...companyForm, status: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="name">Founded Date</Label>
                    <Input
                      id="name"
                      type="date"
                      value={companyForm.foundedDate}
                      onChange={(e) => setCompanyForm({ ...companyForm, foundedDate: e.target.value })}
                      placeholder="Select founded date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Website URL</Label>
                    <Input
                      id="name"
                      value={companyForm.websiteURL}
                      onChange={(e) => setCompanyForm({ ...companyForm, websiteURL: e.target.value })}
                      placeholder="Enter website URL (e.g., https://www.company.com)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.contact_no ? "text-red-500" : ""}>Contact No*</Label>
                    <Input
                      id="name"
                      value={companyForm.contact_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_no: e.target.value })}
                      placeholder="Enter contact number (e.g., +91 9876543210)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Annual Report URL</Label>
                    <Input
                      id="name"
                      value={companyForm.annualReportURL}
                      onChange={(e) => setCompanyForm({ ...companyForm, annualReportURL: e.target.value })}
                      placeholder="Enter annual report URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">GST No</Label>
                    <Input
                      id="name"
                      value={companyForm.company_gst_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_gst_no: e.target.value })}
                      placeholder="Enter GST number (e.g., 33ABCDE1234F1Z5)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedCompany && !companyForm.location_no ? "text-red-500" : ""}>Location No*</Label>
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

                </div>
              </div>

              <ImageUpload
                label="Company Images"
                images={images}
                onImagesChange={setImages}
                onFilesChange={handleCompanyFiles}
                maxImages={2}
              />

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedCompany(false);
                setIsCompanyDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveCompany}>{editingCompany ? 'Update' : 'Create'} Company</Button>
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

                  <div className="space-y-2">
                    <Label htmlFor="company" className={submittedCompanyMapping && !companyMappingForm.company_no ? "text-red-500" : ""}>Company Code*</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="location" className={submittedCompanyMapping && !companyMappingForm.location_no ? "text-red-500" : ""}>Location No*</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedCompanyMapping && !companyMappingForm.status ? "text-red-500" : ""}>Status*</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="name">Order No</Label>
                    <Input
                      id="name"
                      value={companyMappingForm.order_no}
                      onChange={(e) => setCompanyMappingForm({ ...companyMappingForm, order_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedCompanyMapping(false);
                setIsCompanyMappingDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveCompanyMapping}>{editingCompanyMapping ? 'Update' : 'Create'} Company Mapping</Button>
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
                    <Input
                      id="name"
                      value={locationForm.location_no}
                      onChange={(e) => setLocationForm({ ...locationForm, location_no: e.target.value })}
                      placeholder="Enter location number (e.g., LOC001)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.location_name ? "text-red-500" : ""}>Location Name*</Label>
                    <Input
                      id="name"
                      value={locationForm.location_name}
                      onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                      placeholder="Enter location name (e.g., Chennai Branch)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.short_name ? "text-red-500" : ""}>Short Name*</Label>
                    <Input
                      id="name"
                      value={locationForm.short_name}
                      onChange={(e) => setLocationForm({ ...locationForm, short_name: e.target.value })}
                      placeholder="Enter short name (e.g., CHN)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.address1 ? "text-red-500" : ""}>Address 1*</Label>
                    <Input
                      id="name"
                      value={locationForm.address1}
                      onChange={(e) => setLocationForm({ ...locationForm, address1: e.target.value })}
                      placeholder="Enter address line 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.address2 ? "text-red-500" : ""}>Address 2*</Label>
                    <Input
                      id="name"
                      value={locationForm.address2}
                      onChange={(e) => setLocationForm({ ...locationForm, address2: e.target.value })}
                      placeholder="Enter address line 2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={locationForm.address3}
                      onChange={(e) => setLocationForm({ ...locationForm, address3: e.target.value })}
                      placeholder="Enter address line 3 (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className={submittedLocation && !locationForm.city ? "text-red-500" : ""}>City*</Label>
                    <Select value={locationForm.city} onValueChange={(value) => setLocationForm({ ...locationForm, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city: any) => (
                          <SelectItem
                            key={city.attributedetails_code}
                            value={city.attributedetails_code}
                          >
                            {city.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className={submittedLocation && !locationForm.state ? "text-red-500" : ""}>State*</Label>
                    <Select value={locationForm.state} onValueChange={(value) => setLocationForm({ ...locationForm, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((city: any) => (
                          <SelectItem
                            key={city.attributedetails_code}
                            value={city.attributedetails_code}
                          >
                            {city.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.pincode ? "text-red-500" : ""}>Pin Code*</Label>
                    <Input
                      id="name"
                      value={locationForm.pincode}
                      onChange={(e) => setLocationForm({ ...locationForm, pincode: e.target.value })}
                      placeholder="Enter PIN code (e.g., 600001)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className={submittedLocation && !locationForm.country ? "text-red-500" : ""}>Country*</Label>
                    <Select value={locationForm.country} onValueChange={(value) => setLocationForm({ ...locationForm, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((city: any) => (
                          <SelectItem
                            key={city.attributedetails_code}
                            value={city.attributedetails_code}
                          >
                            {city.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <Input
                      id="name"
                      value={locationForm.email_id}
                      onChange={(e) => setLocationForm({ ...locationForm, email_id: e.target.value })}
                      placeholder="Enter email address (e.g., branch@example.com)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className={submittedLocation && !locationForm.status ? "text-red-500" : ""}>Status*</Label>
                    <Select value={locationForm.status} onValueChange={(value) => setLocationForm({ ...locationForm, status: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedLocation && !locationForm.contact_no ? "text-red-500" : ""}>Contact No*</Label>
                    <Input
                      id="name"
                      value={locationForm.contact_no}
                      onChange={(e) => setLocationForm({ ...locationForm, contact_no: e.target.value.replace(/\D/g, ""), })}
                      placeholder="Enter contact number (e.g., +91 9876543210)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedLocation(false);
                setIsLocationDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveLocation}>{editingLocation ? 'Update' : 'Create'} Location</Button>
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
                    <Input
                      id="name"
                      value={roleForm.role_id}
                      onChange={(e) => setRoleForm({ ...roleForm, role_id: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className={submittedRole && !roleForm.role_name ? "text-red-500" : ""}>Role Name*</Label>
                    <Input
                      id="name"
                      value={roleForm.role_name}
                      onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Description</Label>
                  <Textarea
                    id="name"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="e.g., Weight Loss Transformation"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedRole(false);
                setIsRoleDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveRole}>{editingRole ? 'Update' : 'Create'} Role</Button>
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

                  <div className="space-y-2">
                    <Label htmlFor="role" className={submittedRoleMapping && !roleMappingForm.role_id ? "text-red-500" : ""}>Role ID*</Label>
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
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedRoleMapping(false);
                setIsRoleMappingDialogOpen(false)
              }}>Cancel</Button>
              <Button onClick={handleSaveRoleMapping}>{editingRoleMapping ? 'Update' : 'Create'} Role Mapping</Button>
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

                  <div className="space-y-2">
                    <Label htmlFor="screen" className={submittedRoleRights && !roleRightsForm.screen_type ? "text-red-500" : ""}>Screen Type*</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="permission" className={submittedRoleRights && !roleRightsForm.permission_type ? "text-red-500" : ""}>Permission Type*</Label>
                    <Select value={roleRightsForm.permission_type} onValueChange={(value) => setRoleRightsForm({ ...roleRightsForm, permission_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Permission Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {permission.map((permission: any) => (
                          <SelectItem
                            key={permission.attributedetails_code}
                            value={permission.attributedetails_code}
                          >
                            {permission.attributedetails_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedRoleRights(false);
                setIsRoleRightsDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveRoleRight}>{editingRoleRight ? 'Update' : 'Create'} Role Rights</Button>
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

                  {/* <div className="space-y-2"> */}
                  {/* <Label htmlFor="UserCode">User Code*</Label> */}
                  {/* <Label htmlFor="city" className={submittedUser && !userForm.user_code ? "text-red-500" : ""}>User Code*</Label> */}
                  {/* <Select value={userForm.user_code} onValueChange={(value) => setUserForm({ ...userForm, user_code: value })}> */}
                  {/* <SelectTrigger>
                        <SelectValue placeholder="Select User Code" />
                      </SelectTrigger> */}
                  {/* <SelectContent> */}
                  {/* {userCodeNameDrop.map((item: any) => (
                          <SelectItem
                            key={item.user_code}
                            value={item.user_code}
                          >
                            {item.user_code} - {item.user_name}
                          </SelectItem>
                        ))} */}
                  {/* <SelectItem value="User1">User 1</SelectItem>
                        <SelectItem value="User2">User 2</SelectItem>
                        <SelectItem value="User3">User 3</SelectItem>
                        <SelectItem value="User4">User 4</SelectItem>
                        <SelectItem value="User5">User 5</SelectItem>
                        <SelectItem value="User6">User 6</SelectItem> */}
                  {/* </SelectContent> */}
                  {/* </Select> */}
                  {/* </div> */}

                  <div className="space-y-2">
                    {/* <Label htmlFor="LastName">Last Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_code ? "text-red-500" : ""}>User Code*</Label>
                    <Input
                      id="UserCode"
                      value={userForm.user_code}
                      onChange={(e) => setUserForm({ ...userForm, user_code: e.target.value })}
                      placeholder="e.g., Last Name"
                    />
                  </div>

                  <div className="space-y-2">
                    {/* <Label htmlFor="name">User Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_name ? "text-red-500" : ""}>User Name*</Label>
                    <Input
                      id="UserName"
                      value={userForm.user_name}
                      onChange={(e) => setUserForm({ ...userForm, user_name: e.target.value })}
                      placeholder="e.g., User Name"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="FirstName">First Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.first_name ? "text-red-500" : ""}>First Name*</Label>
                    <Input
                      id="FirstName"
                      value={userForm.first_name}
                      onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                      placeholder="e.g., First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="LastName">Last Name*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.last_name ? "text-red-500" : ""}>Last Name*</Label>
                    <Input
                      id="LastName"
                      value={userForm.last_name}
                      onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                      placeholder="e.g., Last Name"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="name">Password*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_password ? "text-red-500" : ""}>Password*</Label>
                    <Input
                      id="Password"
                      value={userForm.user_password}
                      onChange={(e) => setUserForm({ ...userForm, user_password: e.target.value })}
                      placeholder="e.g., Password"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="UserCode">Status*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.user_status ? "text-red-500" : ""}>Status*</Label>
                    <Select value={userForm.user_status} onValueChange={(value) => setUserForm({ ...userForm, user_status: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="Log">Log in/out</Label>
                    <Select value={userForm.log_in_out} onValueChange={(value) => setUserForm({ ...userForm, log_in_out: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Log in Or out" />
                      </SelectTrigger>
                      <SelectContent>
                        {logInLogOut.map((status: any) => (
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
                    {/* <Label htmlFor="RoleID">Role ID*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.role_id ? "text-red-500" : ""}>Role ID*</Label>
                    <Select value={userForm.role_id} onValueChange={(value) => setUserForm({ ...userForm, role_id: value })}>
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

                  <div className="space-y-2">
                    {/* <Label htmlFor="Email">Email*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.email_id ? "text-red-500" : ""}>Email*</Label>
                    <Input
                      id="Email"
                      value={userForm.email_id}
                      onChange={(e) => setUserForm({ ...userForm, email_id: e.target.value })}
                      placeholder="e.g., Email"
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="DOB">DOB*</Label> */}
                    <Label htmlFor="name" className={submittedUser && !userForm.dob ? "text-red-500" : ""}>DOB*</Label>
                    <Input
                      id="DOB"
                      value={userForm.dob}
                      onChange={(e) => setUserForm({ ...userForm, dob: e.target.value })}
                      placeholder="e.g., DOB"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>
                    <Select value={userForm.gender} onValueChange={(value) => setUserForm({ ...userForm, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="SelectGender" />
                      </SelectTrigger>
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
                      onCheckedChange={(checked) => setUserForm({ ...userForm, super_admin: checked })}
                    />
                    <Label htmlFor="isActive">Super Admin</Label>
                  </div>
                </div>
              </div>

              <ImageUpload
                label="User Image"
                images={images}
                onImagesChange={setImages}
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
                      <Select
                        value={attributeForm.attributeheader_code}
                        onValueChange={(value) => setAttributeForm({ ...attributeForm, attributeheader_code: value, })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {attributehdr.map((status: any) => (
                            <SelectItem
                              key={status.attributeheader_code}
                              value={status.attributeheader_code}
                            >
                              {status.attributeheader_code} - {status.attributeheader_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" onClick={handleAddAttributeHdr}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="SubCode" className={submittedAttributeDet && !attributeForm.attributedetails_code ? "text-red-500" : ""}>Sub Code*</Label>
                    <Input
                      id="SubCode"
                      value={attributeForm.attributedetails_code}
                      onChange={(e) => setAttributeForm({ ...attributeForm, attributedetails_code: e.target.value })}
                      placeholder="e.g., SubCode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="DetailsName" className={submittedAttributeDet && !attributeForm.attributedetails_name ? "text-red-500" : ""}>Details Name*</Label>
                    <Input
                      id="DetailsName"
                      value={attributeForm.attributedetails_name}
                      onChange={(e) => setAttributeForm({ ...attributeForm, attributedetails_name: e.target.value })}
                      placeholder="e.g., Details Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={attributeForm.descriptions}
                    onChange={(e) => setAttributeForm({ ...attributeForm, descriptions: e.target.value })}
                    placeholder="Description..."
                  />
                </div>

              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedAttributeDet(false);
                setIsAttributeDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleSaveAttribute}>{editingAttribute ? 'Update' : 'Create'} Attribute Detail</Button>
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
                <Input
                  id="Code"
                  value={attributeHdrForm.attributeheader_code}
                  onChange={(e) => setAttributeHdrForm({ ...attributeHdrForm, attributeheader_code: e.target.value, })}
                  placeholder="Enter attribute code (e.g., ACCOUNT_TYPE)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className={submittedAttributeHdr && !attributeHdrForm.attributeheader_name ? "text-red-500" : ""}>Name*</Label>
                <Input
                  id="Name"
                  value={attributeHdrForm.attributeheader_name}
                  onChange={(e) => setAttributeHdrForm({ ...attributeHdrForm, attributeheader_name: e.target.value, })}
                  placeholder="Enter attribute name (e.g., Account Type)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className={submittedAttributeHdr && !attributeHdrForm.status ? "text-red-500" : ""}>Status*</Label>
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSubmittedAttributeHdr(false);
                setIsAttributeHdrDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleCreateAttributeHdr}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default WorkoutProgramManagement;
