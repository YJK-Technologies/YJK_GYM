
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
import { ArrowLeft, Plus, Search, Dumbbell, Package, Users, Clock, Edit, Trash2, Eye, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from "../ImageUpload";
import { BASE_URL } from '../ApiConfig';


const WorkoutProgramManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
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

  const [isRoleMappingDialogOpen, setIsRoleMappingDialogOpen] = useState(false);
  const [isRoleRightsDialogOpen, setIsRoleRightsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  //Company Dialog States
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
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [authorisedSignature, setAuthorisedSignature] = useState<File | null>(null);

  const handleCompanyFiles = (files: (File | null)[]) => {
    setCompanyLogo(files[0]);
    setAuthorisedSignature(files[1]);
  };

  //Company Mapping Dialog States
  const [companyMappings, setCompanyMappings] = useState([]);
  const [editingCompanyMapping, setEditingCompanyMapping] = useState<any>(null);
  const [isCompanyMappingDialogOpen, setIsCompanyMappingDialogOpen] = useState(false);
  const [companyMappingForm, setCompanyMappingForm] = useState({
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

  //Location Dialog States
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
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const [roleForm, setRoleForm] = useState({
    company_code: "",
    role_id: "",
    role_name: "",
    description: "",
    created_by: "admin",
    modified_by: "admin",
  });

  // Company CRUD Functions
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
    setIsCompanyDialogOpen(true);
  };

  const handleCreateCompany = async () => {
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
        alert(data.message);
        // fetchCompanies();
        setIsCompanyDialogOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompany = async () => {
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
        alert(data);
        // fetchCompanies();
        setEditingCompany(null);
        setIsCompanyDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
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
        alert(data);
        // fetchCompanies();
      }
    } catch (error) {
      console.error(error);
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

  // Company Mapping CRUD Functions
  const handleAddCompanyMapping = () => {
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

  const handleCreateCompanyMapping = async () => {
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
        alert(data.message);
        // fetchCompanyMappings();
        setIsCompanyMappingDialogOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCompanyMapping = async () => {
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
        alert(data);
        // fetchCompanyMappings();
        setEditingCompanyMapping(null);
        setIsCompanyMappingDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCompanyMapping = async (keyfiels: string) => {
    if (!window.confirm("Delete this mapping?")) return;

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
        alert(data);
        // fetchCompanyMappings();
      } else {
        alert(data.message || data);
      }
    } catch (err) {
      console.error(err);
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

  const handleCreateLocation = async () => {
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
        alert(data.message);
        // fetchLocations();
        setIsLocationDialogOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLocation = async () => {
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
        alert(data);
        // fetchLocations();
        setEditingLocation(null);
        setIsLocationDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
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
        alert(data);
        // fetchLocations();
      } else {
        alert(data.message || data);
      }
    } catch (err) {
      console.error(err);
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

  const handleCreateRole = async () => {
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
        alert(data.message);
        // fetchRoles();
        setIsRoleDialogOpen(false);
      } else {
        alert(data.message || "Failed to create role");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async () => {
    try {
      const response = await fetch(`${BASE_URL}/RoleUpdates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data);
        // fetchRoles();
        setEditingRole(null);
        setIsRoleDialogOpen(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRole = async (role_id: string) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      const response = await fetch(`${BASE_URL}/roledelete`, {
        method: "DELETE",
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
        alert(data);
        // fetchRoles();
      } else {
        alert(data.message || data);
      }
    } catch (err) {
      console.error(err);
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

  const handleAddRoleMapping = () => {
    setEditingCompanyMapping(null);
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
    setIsRoleMappingDialogOpen(true);
  };

  const handleAddRoleRights = () => {
    setEditingCompanyMapping(null);
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
    setIsRoleRightsDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingCompanyMapping(null);
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
    setIsUserDialogOpen(true);
  };

  const handleAddAttribute = () => {
    setEditingCompanyMapping(null);
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
    setIsAttributeDialogOpen(true);
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
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies, packages, or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                <CardDescription>Manage all mapping companies and their details</CardDescription>
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
          {/* <TabsContent value="roleMapping">
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
                    {filteredCompanies.map((program) => (
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Role Rights Tab */}
          {/* <TabsContent value="roleRights">
            <Card>
              <CardHeader>
                <CardTitle>Role Rights</CardTitle>
                <CardDescription>Manage all mapping companies and their details</CardDescription>
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
                    {filteredCompanies.map((program) => (
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
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* User Tab */}
          {/* <TabsContent value="user">
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
                    {filteredCompanies.map((program) => (
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
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
                        <TableCell className="text-sm text-gray-600">{program.workingHours}</TableCell>
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
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

          {/* Attribute Tab */}
          {/* <TabsContent value="attribute">
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
                    {filteredCompanies.map((program) => (
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
                        <TableCell>
                          {program.isActive ? (
                            <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          ) : (
                            <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCompany(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(program.id)}>
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

        </Tabs>

        {/* Add/Edit Company Dialog Or Popup*/}
        <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
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
                    <Label htmlFor="name">Company Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.company_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name*</Label>
                    <Input
                      id="name"
                      value={companyForm.company_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name</Label>
                    <Input
                      id="name"
                      value={companyForm.short_name}
                      onChange={(e) => setCompanyForm({ ...companyForm, short_name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 1*</Label>
                    <Input
                      id="name"
                      value={companyForm.address1}
                      onChange={(e) => setCompanyForm({ ...companyForm, address1: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 2*</Label>
                    <Input
                      id="name"
                      value={companyForm.address2}
                      onChange={(e) => setCompanyForm({ ...companyForm, address2: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={companyForm.address3}
                      onChange={(e) => setCompanyForm({ ...companyForm, address3: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">City*</Label>
                    <Select value={companyForm.city} onValueChange={(value) => setCompanyForm({ ...companyForm, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">State*</Label>
                    <Select value={companyForm.state} onValueChange={(value) => setCompanyForm({ ...companyForm, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Pin Code*</Label>
                    <Input
                      id="name"
                      value={companyForm.pincode}
                      onChange={(e) => setCompanyForm({ ...companyForm, pincode: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Country*</Label>
                    <Select value={companyForm.country} onValueChange={(value) => setCompanyForm({ ...companyForm, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Email*</Label>
                    <Input
                      id="name"
                      value={companyForm.email_id}
                      onChange={(e) => setCompanyForm({ ...companyForm, email_id: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={companyForm.status} onValueChange={(value) => setCompanyForm({ ...companyForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Founded Date</Label>
                    <Input
                      id="name"
                      value={companyForm.foundedDate}
                      onChange={(e) => setCompanyForm({ ...companyForm, foundedDate: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Website URL</Label>
                    <Input
                      id="name"
                      value={companyForm.websiteURL}
                      onChange={(e) => setCompanyForm({ ...companyForm, websiteURL: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Contact No*</Label>
                    <Input
                      id="name"
                      value={companyForm.contact_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Annual Report URL</Label>
                    <Input
                      id="name"
                      value={companyForm.annualReportURL}
                      onChange={(e) => setCompanyForm({ ...companyForm, annualReportURL: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">GST No</Label>
                    <Input
                      id="name"
                      value={companyForm.company_gst_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_gst_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Location No*</Label>
                    <Input
                      id="name"
                      value={companyForm.location_no}
                      onChange={(e) => setCompanyForm({ ...companyForm, location_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
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
              <Button variant="outline" onClick={() => setIsCompanyDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCompany}>{editingCompany ? 'Update' : 'Create'} Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Company Mapping Dialog Or Popup*/}
        <Dialog open={isCompanyMappingDialogOpen} onOpenChange={setIsCompanyMappingDialogOpen}>
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
                    <Label htmlFor="category">User Code*</Label>
                    <Select value={companyMappingForm.user_code} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, user_code: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Company Code*</Label>
                    <Select value={companyMappingForm.company_no} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, company_no: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Location No*</Label>
                    <Select value={companyMappingForm.location_no} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, location_no: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={companyMappingForm.status} onValueChange={(value) => setCompanyMappingForm({ ...companyMappingForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
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
              <Button variant="outline" onClick={() => setIsCompanyMappingDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCompanyMapping}>{editingCompanyMapping ? 'Update' : 'Create'} Company Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Location Dialog Or Popup*/}
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
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
                    <Label htmlFor="name">Location No*</Label>
                    <Input
                      id="name"
                      value={locationForm.location_no}
                      onChange={(e) => setLocationForm({ ...locationForm, location_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name*</Label>
                    <Input
                      id="name"
                      value={locationForm.location_name}
                      onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Short Name*</Label>
                    <Input
                      id="name"
                      value={locationForm.short_name}
                      onChange={(e) => setLocationForm({ ...locationForm, short_name: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 1*</Label>
                    <Input
                      id="name"
                      value={locationForm.address1}
                      onChange={(e) => setLocationForm({ ...locationForm, address1: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 2*</Label>
                    <Input
                      id="name"
                      value={locationForm.address2}
                      onChange={(e) => setLocationForm({ ...locationForm, address2: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Address 3</Label>
                    <Input
                      id="name"
                      value={locationForm.address3}
                      onChange={(e) => setLocationForm({ ...locationForm, address3: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">City*</Label>
                    <Select value={locationForm.city} onValueChange={(value) => setLocationForm({ ...locationForm, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">State*</Label>
                    <Select value={locationForm.state} onValueChange={(value) => setLocationForm({ ...locationForm, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Pin Code*</Label>
                    <Input
                      id="name"
                      value={locationForm.pincode}
                      onChange={(e) => setLocationForm({ ...locationForm, pincode: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Country*</Label>
                    <Select value={locationForm.country} onValueChange={(value) => setLocationForm({ ...locationForm, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Email*</Label>
                    <Input
                      id="name"
                      value={locationForm.email_id}
                      onChange={(e) => setLocationForm({ ...locationForm, email_id: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Status*</Label>
                    <Select value={locationForm.status} onValueChange={(value) => setLocationForm({ ...locationForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Contact No*</Label>
                    <Input
                      id="name"
                      value={locationForm.contact_no}
                      onChange={(e) => setLocationForm({ ...locationForm, contact_no: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveLocation}>{editingLocation ? 'Update' : 'Create'} Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Dialog Or Popup*/}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
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
                    <Label htmlFor="name">Role ID*</Label>
                    <Input
                      id="name"
                      value={roleForm.role_id}
                      onChange={(e) => setRoleForm({ ...roleForm, role_id: e.target.value })}
                      placeholder="e.g., Weight Loss Transformation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name*</Label>
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
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRole}>{editingRole ? 'Update' : 'Create'} Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Role Mapping Dialog Or Popup*/}
        {/* <Dialog open={isRoleMappingDialogOpen} onOpenChange={setIsRoleMappingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Role Mapping' : 'Add New Role Mapping'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the role mapping details' : 'Create a new role mapping'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="category">User Code*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Role ID*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleMappingDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Role Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Add/Edit Role Rights Dialog Or Popup*/}
        {/* <Dialog open={isRoleRightsDialogOpen} onOpenChange={setIsRoleRightsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Role Right' : 'Add New Role Right'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the role right details' : 'Create a new role right'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Company Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="category">Role ID*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Screen Type*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Permission Type*</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleRightsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Role Right</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Add/Edit User Dialog Or Popup*/}
        {/* <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the User details' : 'Create a new User'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">User Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="UserCode">User Code</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select User Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">User Name</Label>
                    <Input
                      id="UserName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., User Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="FirstName">First Name</Label>
                    <Input
                      id="FirstName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="LastName">Last Name</Label>
                    <Input
                      id="LastName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., LastName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Password</Label>
                    <Input
                      id="Password"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="UserCode">Status</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Log">Log in/out</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Log in Or out" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="RoleID">Role ID</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DOB">DOB</Label>
                    <Input
                      id="DOB"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., DOB"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="SelectGender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-x-2">
                    <Switch
                      id="isActive"
                      checked={companyForm.isActive}
                      onCheckedChange={(checked) => setCompanyForm({ ...companyForm, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Super Admin</Label>
                  </div>
                </div>
              </div>

              <ImageUpload
                label="User Image"
                images={images}
                onImagesChange={setImages}
                maxImages={1}
              />

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Add/Edit Attribute Dialog Or Popup*/}
        {/* <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the Attribute details' : 'Create a new Attribute'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Attribute Details</h4>
                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="Code">Code</Label>
                    <Select value={companyForm.category} onValueChange={(value) => setCompanyForm({ ...companyForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="HIIT">HIIT</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="CrossFit">CrossFit</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="SubCode">Sub Code</Label>
                    <Input
                      id="SubCode"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., SubCode"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DetailsName">Details Name</Label>
                    <Input
                      id="DetailsName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="e.g., Details Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    placeholder="Description..."
                  />
                </div>

              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveProgram}>{editingCompany ? 'Update' : 'Create'} Program</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

      </main>
    </div>
  );
};

export default WorkoutProgramManagement;
