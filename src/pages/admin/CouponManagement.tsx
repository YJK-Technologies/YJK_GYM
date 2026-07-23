
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from '../ApiConfig';
import AgGridTable from "@/components/ui/ag-grid-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { showConfirmToast } from '../../components/ui/show-confirm-toast';
import { useCompany } from "../CompanyContext";
import { ArrowLeft, Plus, Pencil, Trash2, Tag, Percent, DollarSign, Calendar, CheckCircle, XCircle, Clock, Copy, RefreshCw, RotateCcw, Search } from 'lucide-react';
import ReactMultiSelect, { MultiSelectOption, } from "@/components/ui/react-multi-select";
// Types
interface Coupon {
  id: string;
  CouponID: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minimumPurchase: number;
  validFrom: string;
  validUntil: string;
  maxUses: number | null;
  currentUses: number;
  // applicablePackages: string;
  applicablePackages: { label: string; value: string }[];
  status: string;
  KeyField: string;
}


const CouponManagement = () => {
  const { companyCode, locationCode, userCode } = useCompany();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [DiscountType, setDiscountType] = useState<any[]>([]);
  const [AppPackages, setAppPackages] = useState<any[]>([]);


  const fetchDiscountType = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDisType`, {
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
        setDiscountType(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchAppPackages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAppPackages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_Code: companyCode,
          Location_Code: locationCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAppPackages(data);
      } else {
        console.error("Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const packageOptions = AppPackages.map((item: any) => ({
    label: `${item.package_ID} - ${item.package_Name}`,
    value: item.package_ID,
  }));


  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDiscountType(),
        fetchAppPackages(),
      ]);
    };

    loadData();
  }, []);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
  
  

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [dashboardStats, setDashboardStats] = useState({ totalCoupons: 0, activeCoupons: 0, totalDiscountGiven: 0, mostUsedCoupon: "", mostUsedCount: 0, });

  // Form state
  const [formData, setFormData] = useState({
    CouponID: '',
    code: '',
    description: '',
    discountType: '',
    discountValue: 0,
    minimumPurchase: 0,
    validFrom: '',
    validUntil: '',
    maxUses: null as number | null,
    // applicablePackages: "",
    applicablePackages: [] as { label: string; value: string }[],
    isActive: true,
    KeyField: ""
  });

  const [submittedCoupon, setSubmittedCoupon] = useState(false);

  const [CouponSearchForm, setCouponSearchForm] = useState({
    CouponID: "",
    Coupon_Code: "",
    Description: "",
    Discount_Type: "",
    Discount_Value: "0",
    Applicable_Packages: "",
    Status: "",
    Valid_From: "",
    Valid_Until: ""
  });

  // Stats
  // const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  // const totalDiscountGiven = 1765.5; // Sample calculation
  // const mostUsedCoupon = coupons.reduce((prev, curr) => 
  //   prev.currentUses > curr.currentUses ? prev : curr
  // );

  // Filter coupons

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        CouponID: coupon.CouponID,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchase: coupon.minimumPurchase,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        maxUses: coupon.maxUses,
        applicablePackages: coupon.applicablePackages,
        isActive: coupon.status === 'Active',
        KeyField: coupon.KeyField
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        CouponID: '',
        code: '',
        description: '',
        discountType: '',
        discountValue: 0,
        minimumPurchase: 0,
        validFrom: '',
        validUntil: '',
        maxUses: null,
        applicablePackages: [],
        isActive: true,
        KeyField: ''
      });
    }
    setIsDialogOpen(true);
  };

  const CouponColumnDefs = [
    {
      headerName: "Coupon ID",
      field: "CouponID",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Coupon Code",
      field: "Coupon_Code",
      minWidth: 150,
      cellStyle: { fontWeight: 600 },
    },
    {
      headerName: "Description",
      field: "Description",
      minWidth: 220,
    },
    {
      headerName: "Discount Type",
      field: "Discount_Type",
      minWidth: 150,
    },
    {
      headerName: "Discount Value",
      field: "Discount_Value",
      minWidth: 140,
    },
    {
      headerName: "Valid From",
      field: "Valid_From",
      minWidth: 140,
    },
    {
      headerName: "Valid Until",
      field: "Valid_Until",
      minWidth: 140,
    },
    {
      headerName: "Current Uses",
      field: "CurrentUses",
      hide: true,
      minWidth: 130,
    },
    {
      headerName: "Max Uses",
      field: "Max_Uses",
      minWidth: 130,
    },
    {
      headerName: "Applicable Packages",
      field: "Applicable_Packages",
      minWidth: 130,
    },
    {
      headerName: "KeyField",
      field: "KeyField",
      hide: true,
      minWidth: 130,
    },
    {
      headerName: "Status",
      field: "Status",
      minWidth: 120,
      cellRenderer: (params: any) => (
        <Badge variant={params.value === "Active" ? "default" : "secondary"}>
          {params.value}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCoupon(params.data)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCoupon(params.data.KeyField)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Added for date fetiching in update screen
  const formatDateForInput = (date: any) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);

    setFormData({
      CouponID: coupon.CouponID ?? "",
      code: coupon.Coupon_Code ?? "",
      description: coupon.Description ?? "",
      discountType: coupon.Discount_Type ?? "",
      discountValue: Number(coupon.Discount_Value) || 0,
      minimumPurchase: Number(coupon.Minimum_Purchase) || 0,
      validFrom: formatDateForInput(coupon.Valid_From),
      validUntil: formatDateForInput(coupon.Valid_Until),
      maxUses: coupon.Max_Uses != null ? Number(coupon.Max_Uses) : null,
      // applicablePackages: coupon.Applicable_Packages ?? "",
      applicablePackages: coupon.Applicable_Packages
        ? coupon.Applicable_Packages.split(",").map((id: string) => {
          const pkg = AppPackages.find(
            (item: any) => item.package_ID === id
          );
          return {
            value: id,
            label: pkg
              ? `${pkg.package_ID} - ${pkg.package_Name}`
              : id,
          };
        })
        : [],
      isActive:
        coupon.Status === "Active" ||
        coupon.Status === true ||
        coupon.Status === 1,
      KeyField: coupon.KeyField ?? "",
    });


    setIsDialogOpen(true);
  };

  const validateCoupon = () => {
    if (!formData.code || !formData.discountType || !formData.maxUses
      || !formData.validFrom || !formData.validUntil || formData.applicablePackages.length === 0
    ) {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const validFrom = new Date(formData.validFrom);
    const validUntil = new Date(formData.validUntil);

    if (validUntil < validFrom) {
      toast({
        title: "Validation Error",
        description: "Valid Until date cannot be earlier than Valid From date.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateCoupon = async () => {
    setSubmittedCoupon(true);

    if (!validateCoupon()) return;

    try {
      const response = await fetch(`${BASE_URL}/couponInsertData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CouponID: formData.CouponID,
          Coupon_Code: formData.code.toUpperCase(),
          Description: formData.description,
          Discount_Type: formData.discountType,
          Discount_Value: formData.discountValue || 0,
          Minimum_Purchase: formData.minimumPurchase || 0,
          Valid_From: formData.validFrom,
          Valid_Until: formData.validUntil,
          Max_Uses: formData.maxUses || 0,
          Current_Uses: 0,
          // Applicable_Packages: formData.applicablePackages,
          Applicable_Packages: formData.applicablePackages
            .map((item: any) => item.value).join(","),
          Status: formData.isActive ? "Active" : "Inactive",
          Company_Code: companyCode,
          Location_Code: locationCode,
          created_by: userCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Coupon created successfully.",
          variant: "success",
        });

        setEditingCoupon(null);
        setIsDialogOpen(false);
        setSubmittedCoupon(false);

        handleCouponSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create coupon.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Server Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCoupon = () => {
    showConfirmToast({
      title: "Update Coupon",
      description: "Do you want to update these changes?",
      onConfirm: updateCoupon,
    });
  };

  const updateCoupon = async () => {
    setSubmittedCoupon(true);

    if (!validateCoupon()) return;

    try {
      const response = await fetch(`${BASE_URL}/couponUpdateData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CouponID: formData.CouponID,
          Coupon_Code: formData.code.toUpperCase(),
          Description: formData.description,
          Discount_Type: formData.discountType,
          Discount_Value: formData.discountValue || 0,
          Minimum_Purchase: formData.minimumPurchase || 0,
          Valid_From: formData.validFrom,
          Valid_Until: formData.validUntil,
          Max_Uses: formData.maxUses || 0,
          // Applicable_Packages: formData.applicablePackages,
          Applicable_Packages: formData.applicablePackages
            .map((item) => item.value).join(","),
          Status: formData.isActive ? "Active" : "Inactive",
          Company_Code: companyCode,
          Location_Code: locationCode,
          modified_by: userCode,
          KeyField: formData.KeyField
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Coupon updated successfully.",
          variant: "success",
        });

        setEditingCoupon(null);
        setIsDialogOpen(false);
        setSubmittedCoupon(false);

        handleCouponSearch();
        await getCouponDashboard();

      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update coupon.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Server Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCoupon = async () => {
    if (editingCoupon) {
      await handleUpdateCoupon();
    } else {
      await handleCreateCoupon();
    }
  };

  const handleDeleteCoupon = (couponID: string) => {
    showConfirmToast({
      title: "Delete Coupon",
      description: "Are you sure you want to delete this coupon?",
      onConfirm: () => deleteCoupon(couponID),
    });
  };

  const deleteCoupon = async (KeyField: string) => {
    try {
      const response = await fetch(`${BASE_URL}/couponDeleteData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          company_code: companyCode,
          location_code: locationCode,
          "modified-by": userCode,
        },
        body: JSON.stringify({
          CouponIDs: [KeyField],

        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Coupon deleted successfully.",
          variant: "success",
        });
        handleCouponSearch();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete coupon.",
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

  useEffect(() => {
    getCouponDashboard();
  }, []);

  const getCouponDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/couponDashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_Code: companyCode,
          Location_Code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.length > 0) {
        const item = data[0];

        setDashboardStats({
          totalCoupons: item.TotalCoupons,
          activeCoupons: item.ActiveCoupons,
          totalDiscountGiven: item.TotalDiscountGiven,
          mostUsedCoupon: item.MostUsedCoupon || "-",
          mostUsedCount: item.MostUsedCount || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCouponSearch = async () => {

    try {
      const response = await fetch(`${BASE_URL}/couponSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_Code: companyCode,
          Location_Code: locationCode,
          CouponID: CouponSearchForm.CouponID,
          Coupon_Code: CouponSearchForm.Coupon_Code,
          Description: CouponSearchForm.Description,
          Discount_Type: CouponSearchForm.Discount_Type,
          Discount_Value: CouponSearchForm.Discount_Value ? CouponSearchForm.Discount_Value : 0,
          Applicable_Packages: CouponSearchForm.Applicable_Packages,
          Status: CouponSearchForm.Status,
          Valid_From: CouponSearchForm.Valid_From,
          Valid_Until: CouponSearchForm.Valid_Until,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCoupons(data);
      }
      else if (response.status === 404) {
        setCoupons([]);

        toast({
          title: "Data Not Found",
          description: data?.message || "No matching coupons found.",
          variant: "destructive",
        });
      }
      else {
        setCoupons([]);

        toast({
          title: "Search Failed",
          description: data?.message || "Something went wrong while searching.",
          variant: "destructive",
        });
      }

    } catch (error) {

      console.error("Search Error:", error);

      setCoupons([]);

      toast({
        title: "Server Error",
        description:
          error?.message ||
          "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });

    }

  };

  const handleReset = () => {
    setCouponSearchForm({
      CouponID: "",
      Coupon_Code: "",
      Description: "",
      Discount_Type: "",
      Discount_Value: "",
      Applicable_Packages: "",
      Status: "",
      Valid_From: "",
      Valid_Until: ""
    });

    setCoupons([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                onClick={() => navigate('/AdminDashboard')}
                className="flex items-center px-2 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Coupon Management</h1>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="shrink-0 px-2 sm:px-4"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                Add Coupon
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Active Coupons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                  <Tag className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Coupons
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.activeCoupons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Discount Given */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-500 text-white mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Discounts Given
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {/*BHD*/} {Number(dashboardStats.totalDiscountGiven).toFixed(3)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Used Coupon */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500 text-white mr-4">
                  <Percent className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Most Used Coupon
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.mostUsedCoupon}
                  </p>

                  <p className="text-sm text-gray-500">
                    {dashboardStats.mostUsedCount} uses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Search and Filters  */}
        <Card className="mb-6">

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">

              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code </Label>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="code"
                          value={CouponSearchForm.CouponID}
                          onChange={(e) => setCouponSearchForm({ ...CouponSearchForm, CouponID: e.target.value.toUpperCase() })}
                          placeholder="Coupon Code"
                          className="font-mono"
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Select Coupon Code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={CouponSearchForm.Discount_Type}
                          onValueChange={(value) => setCouponSearchForm({ ...CouponSearchForm, Discount_Type: value, })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Discount Type" />
                          </SelectTrigger>

                          <SelectContent>
                            {DiscountType.map((DiscountType: any) => (
                              <SelectItem
                                key={DiscountType.attributedetails_name}
                                value={DiscountType.attributedetails_name}
                              >
                                {DiscountType.attributedetails_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Discount Type</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="description"
                        value={CouponSearchForm.Description}
                        onChange={(e) => setCouponSearchForm({ ...CouponSearchForm, Description: e.target.value })}
                        placeholder="Enter coupon description..."
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Description</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value {/*({CouponSearchForm.Discount_Type === 'Percentage' ? '%' : 'BHD'})*/}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="discountValue"
                        type="number"
                        value={CouponSearchForm.Discount_Value}
                        onChange={(e) =>
                          setCouponSearchForm({
                            ...CouponSearchForm,
                            Discount_Value: e.target.value,
                          })
                        }
                        min={0}
                        max={CouponSearchForm.Discount_Type === "Percentage" ? 100 : undefined}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Discount Value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="validFrom"
                        type="date"
                        value={CouponSearchForm.Valid_From}
                        onChange={(e) => setCouponSearchForm({ ...CouponSearchForm, Valid_From: e.target.value })}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Valid From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="validUntil"
                        type="date"
                        value={CouponSearchForm.Valid_Until}
                        onChange={(e) => setCouponSearchForm({ ...CouponSearchForm, Valid_Until: e.target.value })}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Valid Until</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label>Applicable Packages</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={CouponSearchForm.Applicable_Packages}
                          onValueChange={(value) => setCouponSearchForm({ ...CouponSearchForm, Applicable_Packages: value, })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Applicable Packages" />
                          </SelectTrigger>

                          <SelectContent>
                            {AppPackages.map((item: any) => (
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
                      <p>Select Applicable Packages</p>
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
                      onClick={handleCouponSearch}
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

        {/*Coupon Table */}
        <Card>
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
            <CardDescription>Manage coupon details</CardDescription>
          </CardHeader>

          <CardContent>
            <AgGridTable
              rowData={coupons}
              columnDefs={CouponColumnDefs}
              pagination={true}
              paginationPageSize={10}
              height="400px"
            />
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setSubmittedCoupon(false);
        }
        setIsDialogOpen(open)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update coupon details' : 'Add a new discount or offer code'}
            </DialogDescription>
          </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="couponId">Coupon ID</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          id="couponId"
                          value={formData.CouponID}
                          readOnly={!!editingCoupon || numberGeneration === "Auto"}
                          className={
                            !!editingCoupon || numberGeneration === "Auto"
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }
                          placeholder={
                            numberGeneration === "Auto"
                              ? "Auto Generated"
                              : "Enter Coupon ID"
                          }
                          maxLength={20}
                          onChange={(e) => {
                            if (!editingCoupon && numberGeneration === "Manual") {
                              const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                              setFormData({
                                ...formData,
                                CouponID: value,
                              });
                            }
                          }}
                        />
                      </TooltipTrigger>
                        
                      <TooltipContent>
                        <p>
                          {!!editingCoupon
                            ? "Coupon ID cannot be edited"
                            : numberGeneration === "Auto"
                            ? "Coupon ID is Auto Generated"
                            : "Enter Coupon ID"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className={submittedCoupon && !formData.code ? "text-red-500" : ""}>Coupon Code*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex space-x-2">
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          placeholder="SAVE20"
                          className="font-mono"
                        />
                        <Button variant="outline" type="button" onClick={generateCouponCode}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Coupon Code</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType" className={submittedCoupon && !formData.discountType ? "text-red-500" : ""}>Discount Type*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={formData.discountType}
                          onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Discount Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {DiscountType.map((DiscountType: any) => (
                              <SelectItem
                                key={DiscountType.attributedetails_code}
                                value={DiscountType.attributedetails_code}
                              >
                                {DiscountType.attributedetails_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p> Select Discount Type </p>
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
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter coupon description..."
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Select Description</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue" className={submittedCoupon && !formData.discountValue ? "text-red-500" : ""}>
                  Discount Value* {/*({formData.discountType === 'percentage' ? '%' : 'BHD'})*/}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                        min={0}
                        max={formData.discountType === 'percentage' ? 100 : undefined}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Discount Value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumPurchase">Minimum Purchase</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="minimumPurchase"
                        type="number"
                        value={formData.minimumPurchase}
                        onChange={(e) => setFormData({ ...formData, minimumPurchase: parseFloat(e.target.value) || 0 })}
                        min={0}
                        step={0.001}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Minimum Purchase</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom" className={submittedCoupon && !formData.validFrom ? "text-red-500" : ""}>Valid From*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Valid From</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil" className={submittedCoupon && !formData.validUntil ? "text-red-500" : ""}>Valid Until*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Valid Until </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses" className={submittedCoupon && !formData.maxUses ? "text-red-500" : ""}>Maximum Uses*</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="maxUses"
                        type="number"
                        value={formData.maxUses || ''}
                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : null })}
                        min={1}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Select Maximum Uses (leave empty for unlimited)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packages" className={submittedCoupon && formData.applicablePackages.length === 0 ? "text-red-500" : ""}>
                  Applicable Packages*</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ReactMultiSelect
                          options={packageOptions}
                          value={formData.applicablePackages}
                          placeholder="Select Applicable Packages"
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              applicablePackages: selected,
                            })
                          }
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Applicable Packages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => { setIsDialogOpen(false); setSubmittedCoupon(false); }}>
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
                  <Button onClick={handleSaveCoupon}>
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    {editingCoupon ? "Update Coupon" : "Create a Coupon"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;