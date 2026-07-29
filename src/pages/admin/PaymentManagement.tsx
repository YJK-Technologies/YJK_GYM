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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Receipt,
  Tag,
  Users,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { LayoutDashboard, History, FileBarChart2 } from "lucide-react";
import { BASE_URL } from "../ApiConfig";
import { useCompany } from "../CompanyContext";
import AgGridTable from "@/components/ui/ag-grid-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface Payment {
  id: string;
  memberCpr: string;
  memberName: string;
  packageId: string;
  packageName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: "Cash" | "Online" | "BenefitPay";
  couponCode: string | null;
  status: "Completed" | "Pending" | "Failed";
  paymentDate: string;
  receiptNumber: string;
  notes: string;
  postedToExternal: boolean;
}

interface Member {
  cpr: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: string;
}

interface PackageOption {
  package_ID: string;
  package_Name: string;
  MemberShipType_Name: string;
  ProgramName: string;
  Duration: string;
  Amount: number;
}

const PaymentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companyCode, locationCode, userCode } = useCompany();

  const tabs = [
    {
      value: "paymentDashboard",
      label: "Dashboard",
      screenType: "PaymentDashboard",
      icon: LayoutDashboard,
    },
    {
      value: "newPayment",
      label: "New Payment",
      screenType: "NewPayment",
      icon: CreditCard,
    },
    {
      value: "paymentHistory",
      label: "Payment History",
      screenType: "PaymentHistory",
      icon: History,
    },
    {
      value: "paymentReports",
      label: "Reports",
      screenType: "PaymentReports",
      icon: FileBarChart2,
    },
  ];

  const [activeTab, setActiveTab] = useState("");

  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  const allowedScreens = permissions.map((p: any) => p.screen_type);

  const allowedTabs = tabs.filter((tab) =>
    allowedScreens.includes(tab.screenType),
  );

  useEffect(() => {
    if (allowedTabs.length > 0) {
      setActiveTab(allowedTabs[0].value);
    }
  }, []);

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
        console.error(err);
        setNumberGeneration("Auto");
      }
    };

    if (companyCode && locationCode) {
      getSettingData();
    }
  }, [companyCode, locationCode]);

  const tabPermissions = [
    "PaymentDashboard",
    "NewPayment",
    "PaymentHistory",
    "PaymentReports",
  ];

  const hasAnyTabPermission = tabPermissions.some((tab) =>
    allowedScreens.includes(tab),
  );

  if (!hasAnyTabPermission) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-gray-300">404</h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            No Permission Available
          </h2>

          <p className="mt-2 text-gray-500">
            You don't have permission to access any module in Payment
            Management.
          </p>

          <Button className="mt-6" onClick={() => navigate("/AdminDashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }


  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  // New Payment Form State
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearchResults, setMemberSearchResults] = useState<any[]>([]);
  const resetMemberSearch = () => {
    setMemberSearch({
      MemberID: "",
      Full_name: "",
      Gender: "",
      Mobile: "",
      Email: "",
      Address: "",
      Membership_type: "",
      is_active: "",
    });

    setMemberSearchResults([]);
  };
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [memberHelpOpen, setMemberHelpOpen] = useState(false);
  // For member search
  const [memberSearch, setMemberSearch] = useState({
    MemberID: "",
    Full_name: "",
    Gender: "",
    Mobile: "",
    Email: "",
    Address: "",
    Membership_type: "",
    is_active: "Active",
  });

  const [gender, setGender] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);

  const [memberSearchTerm, setMemberSearchTerm] = useState("");

  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    Coupon_Code: string;
    discount: number;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Online" | "BenefitPay" | null
  >(null);
  const [paymentNotes, setPaymentNotes] = useState("");

  // Dialogs
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  // New
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [payments, setPayments] = useState([]);

  const [packageRevenueData, setPackageRevenueData] = useState([]);

  const [packageDetails, setPackageDetails] = useState<any[]>([]);

  const [paymentID, setPaymentID] = useState("");
  const [numberGeneration, setNumberGeneration] = useState("Auto");

const [todayTotal, setTodayTotal] = useState(0);
const [monthlyTotal, setMonthlyTotal] = useState(0);
const [pendingCount, setPendingCount] = useState(0);
const [totalTransactions, setTotalTransactions] = useState(0);


const getDashboardKPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getDashboardKPI`, {
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

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.length > 0) {
      setTodayTotal(Number(data[0].TodayCollections));
      setMonthlyTotal(Number(data[0].MonthlyRevenue));
      setPendingCount(Number(data[0].PendingPayments));
      setTotalTransactions(Number(data[0].TotalTransactions));
    }
  } catch (err) {
    console.error("Dashboard KPI Error :", err);
  }
};

useEffect(() => {
  if (companyCode && locationCode) {
    getDashboardKPI();
  }
}, [companyCode, locationCode]);


const getRevenueTrend = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getRevenueTrend`, {
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

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Revenue Trend");
    }

    const chartData = data.map((item: any) => ({
      day: new Date(item.PaymentDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      revenue: Number(item.Revenue),
    }));

    setRevenueChartData(chartData);
  } catch (err) {
    console.error("Revenue Trend Error:", err);
  }
};

useEffect(() => {
  if (companyCode && locationCode) {
    getRevenueTrend();
  }
}, [companyCode, locationCode]);

const getPaymentMethodDistribution = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getPaymentMethodDistribution`, {
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

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch Payment Method Distribution"
      );
    }

    const colors = [
      "#3b82f6",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ];

    const totalAmount = data.reduce(
      (sum: number, item: any) => sum + Number(item.TotalAmount),
      0
    );

    const chartData = data.map((item: any, index: number) => ({
      name: item.payment_method,
      value: Number(((item.TotalAmount / totalAmount) * 100).toFixed(1)),
      color: colors[index % colors.length],
    }));

    setPaymentMethodData(chartData);
  } catch (err) {
    console.error("Payment Method Distribution Error:", err);
  }
};

useEffect(() => {
  if (companyCode && locationCode) {
    getPaymentMethodDistribution();
  }
}, [companyCode, locationCode]);


const getRecentPayments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getRecentPayments`, {
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

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Recent Payments");
    }

    const paymentData = data.map((item: any) => ({
      id: item.payment_id,
      memberName: item.MemberID,
      finalAmount: Number(item.final_amount),
      paymentMethod: item.payment_method,
      status: item.status,
    }));

    setPayments(paymentData);
  } catch (err) {
    console.error("Recent Payments Error:", err);
  }
};


useEffect(() => {
  if (companyCode && locationCode) {
    getRecentPayments();
  }
}, [companyCode, locationCode]);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.memberCpr.includes(searchTerm) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Filter members for search
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      member.cpr.includes(memberSearchTerm),
  );

  // For search dropdown
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
        setStatusList(data);
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

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMeberShipPackages`, {
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
        setPackages(data);

        console.log(data);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const MembersColumnDefs = [
    {
      headerName: "Member ID",
      field: "MemberID",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Name",
      field: "Full_name",
      flex: 2,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Gender",
      field: "Gender",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Mobile",
      field: "Mobile",
      flex: 1.3,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "Email",
      flex: 2,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Membership",
      field: "Membership_type",
      flex: 1.5,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "is_active",
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge
          className={params.value === "Active" ? "bg-green-500" : "bg-red-500"}
        >
          {params.value}
        </Badge>
      ),
    },
    {
      headerName: "Action",
      field: "action",
      flex: 1,
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => (
        <Button
          size="sm"
          onClick={() => {
            const member = {
              cpr: params.data.MemberID,
              name: params.data.Full_name,
              email: params.data.Email,
              phone: params.data.Mobile,
              membershipStatus: params.data.Membership_type,
            };

            setSelectedMember(member);

            // Fetch packages linked to this member
            fetchMemberPackages(member.cpr);

            // Clear previously selected package
            setSelectedPackage(null);
            setAppliedCoupon(null);

            resetMemberSearch();
            setMemberHelpOpen(false);
          }}
        >
          Select
        </Button>
      ),
    },
  ];

  const handleSearchMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/searchMemberData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MemberID: memberSearch.MemberID,
          Identity_No: "",
          Full_name: memberSearch.Full_name,
          Gender: memberSearch.Gender,
          Mobile: memberSearch.Mobile,
          Email: memberSearch.Email,
          Membership_type: memberSearch.Membership_type,
          is_active: memberSearch.is_active,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMemberSearchResults(data);
      } else {
        setMemberSearchResults([]);

        toast({
          title: "No Members Found",
          description: "No matching members were found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Unable to fetch member details.",
        variant: "destructive",
      });
    }
  };

  const fetchMemberPackages = async (memberId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/getPaymentPackageDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MemberID: memberId,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPackages(data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error(error);
      setPackages([]);
    }
  };

  const fetchPaymentProgramDetails = async (packageID: string) => {
    try {
      const response = await fetch(`${BASE_URL}/getPaymentProgramDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_ID: packageID,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPackageDetails(data);
      } else {
        setPackageDetails([]);
      }
    } catch (error) {
      console.error(error);
      setPackageDetails([]);
    }
  };

  const validateCoupon = async (couponCode: string) => {
    try {
      const response = await fetch(`${BASE_URL}/applyCouponPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          package_ID: selectedPackage?.package_ID,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const savePayment = async () => {
    try {
      if (!selectedMember) {
        toast({
          title: "Member Required",
          description: "Please select a member.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedPackage) {
        toast({
          title: "Package Required",
          description: "Please select a package.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${BASE_URL}/PaymentTransactionInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: paymentID,
          MemberID: selectedMember.cpr,
          MemberShipType_id: packageDetails[0]?.MemberShipType_id,
          package_ID: selectedPackage.package_ID,

          original_amount: Number(packageDetails[0]?.Amount),
          discount_amount: appliedCoupon?.discount || 0,
          final_amount: calculateTotal(),

          payment_method: paymentMethod,

          Coupon_Code: appliedCoupon?.Coupon_Code || "",

          status: "Completed",

          payment_date: new Date(),

          notes: paymentNotes,

          keyfield: "",

          company_code: companyCode,
          location_code: locationCode,

          created_by: userCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Success",
        description: "Payment saved successfully.",
      });

      // Clear screen
      setSelectedMember(null);
      setSelectedPackage(null);
      setPackages([]);
      setPackageDetails([]);
      setAppliedCoupon(null);
      setCouponCode("");
      setPaymentNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // const handleApplyCoupon = () => {
  //   // Sample coupon validation
  //   const validCoupons: Record<
  //     string,
  //     { discount: number; type: "percentage" | "fixed" }
  //   > = {
  //     SAVE10: { discount: 10, type: "percentage" },
  //     NEWMEMBER: { discount: 5, type: "fixed" },
  //     HALFYEAR20: { discount: 20, type: "percentage" },
  //   };

  //   const coupon = validCoupons[couponCode.toUpperCase()];
  //   if (coupon && selectedPackage) {
  //     const discountAmount =
  //       coupon.type === "percentage"
  //         ? (packageDetails[0].Amount * coupon.discount) / 100
  //         : coupon.discount;
  //     setAppliedCoupon({
  //       code: couponCode.toUpperCase(),
  //       discount: discountAmount,
  //     });
  //     toast({
  //       title: "Coupon Applied!",
  //       // description: `Discount of BHD ${discountAmount.toFixed(3)} applied`,
  //       description: `Discount of ${discountAmount.toFixed(3)} applied`,
  //     });
  //   } else {
  //     toast({
  //       title: "Invalid Coupon",
  //       description: "The coupon code is invalid or expired",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleApplyCoupon = async () => {
    if (!selectedPackage || packageDetails.length === 0) return;

    try {
      const couponData = await validateCoupon(couponCode);

      if (!couponData || couponData.length === 0) {
        // Clear previously applied coupon
        setAppliedCoupon(null);

        return;
      }

      const coupon = couponData[0];

      const packageAmount = Number(packageDetails[0].Amount);

      if (
        coupon.Minimum_Purchase &&
        packageAmount < Number(coupon.Minimum_Purchase)
      ) {
        toast({
          title: "Coupon Not Applicable",
          description: `Minimum purchase should be ${coupon.Minimum_Purchase}.`,
          variant: "destructive",
        });
        return;
      }

      const discountAmount = Number(coupon.Discount_Value);

      setAppliedCoupon({
        Coupon_Code: coupon.Coupon_Code,
        discount: discountAmount,
      });

      toast({
        title: "Coupon Applied!",
        description: `Discount of ${discountAmount.toFixed(3)} applied`,
      });
    } catch (error: any) {
      // Clear previously applied coupon
      setAppliedCoupon(null);

      toast({
        title: "Coupon Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;

    if (!packageDetails || packageDetails.length === 0) {
      return 0;
    }

    return (
      Number(packageDetails[0]?.Amount || 0) - (appliedCoupon?.discount || 0)
    );
  };

  const handleProcessPayment = () => {
    if (!selectedMember || !selectedPackage || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPayment: Payment = {
      id: `PAY-2024-${String(payments.length + 1).padStart(3, "0")}`,
      memberCpr: selectedMember.cpr,
      memberName: selectedMember.name,
      packageId: selectedPackage.package_ID,
      packageName: selectedPackage.package_Name,

      originalAmount: Number(packageDetails[0].Amount),
      discountAmount: appliedCoupon?.discount || 0,
      finalAmount: calculateTotal(),
      paymentMethod,
      couponCode: appliedCoupon?.Coupon_Code || null,
      status: "Completed",
      paymentDate: new Date().toISOString().split("T")[0],
      receiptNumber: `REC-2024-${String(payments.length + 1).padStart(3, "0")}`,
      notes: paymentNotes,
      postedToExternal: false,
    };

    setPayments([newPayment, ...payments]);

    // Reset form
    setSelectedMember(null);
    setMemberSearchTerm("");
    setSelectedPackage(null);
    setCouponCode("");
    setAppliedCoupon(null);
    setPaymentMethod(null);
    setPaymentNotes("");

    toast({
      title: "Payment Processed!",
      description: `Receipt ${newPayment.receiptNumber} generated successfully`,
    });
  };

  const handlePostToExternal = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId ? { ...p, postedToExternal: true } : p,
      ),
    );
    toast({
      title: "Posted to External System",
      description: `Payment ${paymentId} has been synced`,
    });
  };

  const handleBulkPost = () => {
    const unpostedPayments = payments.filter(
      (p) => !p.postedToExternal && p.status === "Completed",
    );
    setPayments(
      payments.map((p) =>
        !p.postedToExternal && p.status === "Completed"
          ? { ...p, postedToExternal: true }
          : p,
      ),
    );
    toast({
      title: "Bulk Post Complete",
      description: `${unpostedPayments.length} payments synced to external system`,
    });
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "Cash":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Banknote className="h-3 w-3 mr-1" /> Cash
          </Badge>
        );
      case "Online":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <CreditCard className="h-3 w-3 mr-1" /> Online
          </Badge>
        );
      case "BenefitPay":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <Smartphone className="h-3 w-3 mr-1" /> BenefitPay
          </Badge>
        );
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
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
                Payment Management
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setWebhookDialogOpen(true)}
                className="shrink-0 px-2 sm:px-4"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Integration Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="mb-4 w-full overflow-x-auto scrollbar-thin">
            <TabsList className=" inline-flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-4">
              {allowedTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center whitespace-nowrap px-4 py-2 min-w-[160px] sm:min-w-0"
                  >
                    <Icon className="h-4 w-4 mr-2 shrink-0" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="paymentDashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Today's Collections
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {/*BHD*/}  {todayTotal.toFixed(3)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Monthly Revenue
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {/*BHD*/} {monthlyTotal.toFixed(3)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-yellow-500 text-white mr-4">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending Payments
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pendingCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Transactions
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalTransactions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip
                          formatter={(value: number) => [`${value}`, "Revenue"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice(0, 5).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.id}
                        </TableCell>
                        <TableCell>{payment.memberName}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {/*BHD*/} {payment.finalAmount.toFixed(3)}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Payment Tab */}
          <TabsContent value="newPayment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Selection */}
              <Card className="h-[360px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Select Member
                  </CardTitle>
                  <CardDescription>Search by CPR or name</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  <div className="space-y-2">
                    <Label htmlFor="paymentID">Payment ID</Label>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="paymentID"
                            value={paymentID}
                            readOnly={numberGeneration === "Auto"}
                            className={
                              numberGeneration === "Auto"
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                            }
                            placeholder={
                              numberGeneration === "Auto"
                                ? "Auto Generated"
                                : "Enter Payment ID"
                            }
                            maxLength={20}
                            onChange={(e) => {
                              if (numberGeneration === "Manual") {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9]/g,
                                  "",
                                );

                                setPaymentID(value);
                              }
                            }}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            {numberGeneration === "Auto"
                              ? "Payment ID is Auto Generated"
                              : "Enter Payment ID"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            fetchGender();
                            fetchStatus();
                            setMemberHelpOpen(true);
                          }}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Select Member
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Click to search and select a member</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {selectedMember && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">
                            {selectedMember.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Member ID: {selectedMember.cpr}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {selectedMember.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            Mobile: {selectedMember.phone}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(null);

                            // Clear package also
                            setPackages([]);
                            setSelectedPackage(null);
                            setAppliedCoupon(null);

                            fetchGender();
                            fetchStatus();

                            setMemberHelpOpen(true);
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Package Selection */}
              <Card className="h-[360px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Select Package
                  </CardTitle>
                  <CardDescription>Choose a membership package</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  <Select
                    open={selectedMember ? undefined : false}
                    value={selectedPackage?.package_ID || ""}
                    onValueChange={(value) => {
                      const pkg = packages.find(
                        (p: any) => p.package_ID === value,
                      );

                      setSelectedPackage(pkg || null);
                      setAppliedCoupon(null);

                      if (pkg) {
                        fetchPaymentProgramDetails(pkg.package_ID);
                      }
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectTrigger
                            onClick={() => {
                              if (!selectedMember) {
                                toast({
                                  title: "Select Member",
                                  description:
                                    "Please select a member before selecting a package.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <SelectValue placeholder="Select a package" />
                          </SelectTrigger>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            {selectedMember
                              ? "Select a membership package"
                              : "Please select a member first"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <SelectContent>
                      {packages.map((pkg: any) => (
                        <SelectItem key={pkg.package_ID} value={pkg.package_ID}>
                          {pkg.package_ID} - {pkg.package_Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPackage && packageDetails.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                      <p className="font-semibold">
                        {selectedPackage.package_ID} -{" "}
                        {selectedPackage.package_Name}
                      </p>

                      <p className="text-sm text-gray-600">
                        Membership :{" "}
                        {[
                          ...new Set(
                            packageDetails.map(
                              (x: any) => x.MemberShipType_Name,
                            ),
                          ),
                        ].join(", ")}
                      </p>

                      <p className="text-sm text-gray-600">
                        Program :{" "}
                        {[
                          ...new Set(
                            packageDetails.map((x: any) => x.programname),
                          ),
                        ].join(", ")}
                      </p>

                      <p className="text-sm text-gray-600">
                        Duration : {packageDetails[0]?.Duration}
                      </p>

                      <p className="text-lg font-bold text-green-600">
                        {packageDetails[0]?.Amount}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Apply Coupon
                  </CardTitle>
                  <CardDescription>
                    Enter discount or offer code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            // disabled={!selectedPackage}
                            onClick={() => {
                              if (!selectedPackage) {
                                toast({
                                  title: "Select Package",
                                  description:
                                    "Please select a package before applying a coupon.",
                                  variant: "destructive",
                                });
                              }
                            }}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Enter a valid Coupon Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      onClick={() => {
                        // Validate Coupon Code
                        if (!couponCode.trim()) {
                          toast({
                            title: "Enter Coupon Code",
                            description:
                              "Please enter a coupon code before applying.",
                            variant: "destructive",
                          });
                          return;
                        }

                        // Validate Package Selection
                        if (!selectedPackage) {
                          toast({
                            title: "Select Package",
                            description:
                              "Please select a package before applying a coupon.",
                            variant: "destructive",
                          });
                          return;
                        }

                        handleApplyCoupon();
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-green-700">
                          {appliedCoupon.Coupon_Code}
                        </p>
                        <p className="text-sm text-green-600">
                          -{/*BHD*/} {appliedCoupon.discount.toFixed(3)}{" "}
                          discount
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedCoupon(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Select payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={paymentMethod === "Cash" ? "default" : "outline"}
                      className={`h-20 flex flex-col ${paymentMethod === "Cash" ? "bg-green-500 hover:bg-green-600" : ""}`}
                      onClick={() => setPaymentMethod("Cash")}
                    >
                      <Banknote className="h-6 w-6 mb-2" />
                      Cash
                    </Button>
                    <Button
                      variant={
                        paymentMethod === "Online" ? "default" : "outline"
                      }
                      className={`h-20 flex flex-col ${paymentMethod === "Online" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                      onClick={() => setPaymentMethod("Online")}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      Online
                    </Button>
                    <Button
                      variant={
                        paymentMethod === "BenefitPay" ? "default" : "outline"
                      }
                      className={`h-20 flex flex-col ${paymentMethod === "BenefitPay" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                      onClick={() => setPaymentMethod("BenefitPay")}
                    >
                      <Smartphone className="h-6 w-6 mb-2" />
                      BenefitPay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amount Summary & Process */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Notes (Optional)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Add payment notes..."
                                value={paymentNotes}
                                maxLength={500}
                                onChange={(e) =>
                                  setPaymentNotes(e.target.value)
                                }
                              />
                              <div className="text-xs text-gray-500 text-right">
                                {paymentNotes.length}/500 characters
                              </div>
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>Enter the Notes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span>
                        {/*BHD*/}{" "}
                        {packageDetails.length > 0
                          ? Number(packageDetails[0].Amount).toFixed(3)
                          : "0.000"}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({appliedCoupon.Coupon_Code}):</span>
                        <span>
                          -{/*BHD*/} {appliedCoupon.discount.toFixed(3)}
                        </span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between text-xl font-bold text-green-600">
                      <span>Total Payable:</span>
                      <span>
                        {/*BHD*/} {calculateTotal().toFixed(3)}
                      </span>
                    </div>
                    <Button
                      className="w-full mt-4"
                      size="lg"
                      onClick={savePayment}
                      disabled={
                        !selectedMember || !selectedPackage || !paymentMethod
                      }
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="paymentHistory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                      View and manage all payment records
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkPost}>
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Post
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by ID, name, or CPR..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="BenefitPay">BenefitPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Coupon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Synced</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.id}
                        </TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.memberName}</p>
                            <p className="text-sm text-gray-500">
                              {payment.memberCpr}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.packageName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-green-600">
                              {/*BHD*/} {payment.finalAmount.toFixed(3)}
                            </p>
                            {payment.discountAmount > 0 && (
                              <p className="text-xs text-red-500">
                                -{payment.discountAmount.toFixed(3)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell>{payment.couponCode || "-"}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.postedToExternal ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Posted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Not Posted
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                            {!payment.postedToExternal &&
                              payment.status === "Completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handlePostToExternal(payment.id)
                                  }
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="paymentReports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Daily Average
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {/*BHD*/} 308.000
                    </p>
                    <p className="text-sm text-green-600">+12% vs last week</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Weekly Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {/*BHD*/} 2,155.000
                    </p>
                    <p className="text-sm text-green-600">+8% vs last week</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Total Discounts Given
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {/*BHD*/} 156.500
                    </p>
                    <p className="text-sm text-gray-500">
                      From 23 coupons used
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Package Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={packageRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value, name) => [
                          // name === "revenue" ? `BHD ${value}` : value,
                          name === "revenue" ? `${value}` : value,
                          name === "revenue" ? "Revenue" : "Count",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        // name="Revenue (BHD)"
                        name="Revenue"
                      />
                      <Bar dataKey="count" fill="#22c55e" name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Coupon Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">SAVE10</p>
                        <p className="text-sm text-gray-500">
                          10% off all packages
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">45 uses</p>
                        <p className="text-sm text-red-600">
                          -{/*BHD*/} 450.000
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">NEWMEMBER</p>
                        <p className="text-sm text-gray-500">
                          {/*BHD*/} 5 off for new members
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">23 uses</p>
                        <p className="text-sm text-red-600">
                          -{/*BHD*/} 115.000
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">HALFYEAR20</p>
                        <p className="text-sm text-gray-500">
                          20% off Half-Yearly
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">50 uses</p>
                        <p className="text-sm text-red-600">
                          -{/*BHD*/} 1,200.000
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Member Search Dialog */}
      <Dialog
        open={memberHelpOpen}
        onOpenChange={(open) => {
          setMemberHelpOpen(open);

          if (!open) {
            resetMemberSearch();
          }
        }}
      >
        <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Member</DialogTitle>
            <DialogDescription>Search and select a member</DialogDescription>
          </DialogHeader>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Member ID</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Member ID"
                      maxLength={50}
                      value={memberSearch.MemberID}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          MemberID: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Member ID</p>
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
                      placeholder="Full Name"
                      maxLength={50}
                      value={memberSearch.Full_name}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          Full_name: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Full Name</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={memberSearch.Gender}
                onValueChange={(value) =>
                  setMemberSearch({
                    ...memberSearch,
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
                      <p>Select the Gender</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectContent>
                  {gender.map((item: any) => (
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

            <div className="space-y-2">
              <Label>Mobile</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Mobile"
                      maxLength={15}
                      value={memberSearch.Mobile}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          Mobile: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Mobile</p>
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
                      placeholder="Email"
                      maxLength={250}
                      value={memberSearch.Email}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          Email: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Email</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Address"
                      maxLength={250}
                      value={memberSearch.Address}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          Address: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>Membership Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Membership Type"
                      maxLength={100}
                      value={memberSearch.Membership_type}
                      onChange={(e) =>
                        setMemberSearch({
                          ...memberSearch,
                          Membership_type: e.target.value,
                        })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the Address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={memberSearch.is_active}
                onValueChange={(value) =>
                  setMemberSearch({
                    ...memberSearch,
                    is_active: value,
                  })
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
                      <p>Select the Status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <SelectContent>
                  {statusList.map((item: any) => (
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
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={handleSearchMembers}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Members Table */}
          <div className="mt-4 flex-1">
            <AgGridTable
              rowData={memberSearchResults}
              columnDefs={MembersColumnDefs}
              pagination={true}
              paginationPageSize={10}
              height="100%"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberHelpOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhook Configuration Dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Integration Settings</DialogTitle>
            <DialogDescription>
              Configure webhook URL for posting payments to external systems
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-external-system.com/api/payments"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Payments will be posted to this URL when you click "Post to
              External" or use bulk posting.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWebhookDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Webhook URL has been configured",
                });
                setWebhookDialogOpen(false);
              }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
