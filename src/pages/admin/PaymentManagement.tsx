
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
  Package
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

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
  paymentMethod: 'Cash' | 'Online' | 'BenefitPay';
  couponCode: string | null;
  status: 'Completed' | 'Pending' | 'Failed';
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
  id: string;
  name: string;
  price: number;
  duration: string;
  programName: string;
}

// Sample data
const samplePayments: Payment[] = [
  {
    id: 'PAY-2024-001',
    memberCpr: '810234567',
    memberName: 'Fatima Al-Mahmoud',
    packageId: 'pkg-1',
    packageName: 'Weight Loss - Quarterly',
    originalAmount: 65.000,
    discountAmount: 6.500,
    finalAmount: 58.500,
    paymentMethod: 'BenefitPay',
    couponCode: 'SAVE10',
    status: 'Completed',
    paymentDate: '2024-01-15',
    receiptNumber: 'REC-2024-001',
    notes: '',
    postedToExternal: true
  },
  {
    id: 'PAY-2024-002',
    memberCpr: '820345678',
    memberName: 'Mohammed Al-Khalifa',
    packageId: 'pkg-2',
    packageName: 'Muscle Building - Monthly',
    originalAmount: 30.000,
    discountAmount: 0,
    finalAmount: 30.000,
    paymentMethod: 'Cash',
    couponCode: null,
    status: 'Completed',
    paymentDate: '2024-01-16',
    receiptNumber: 'REC-2024-002',
    notes: '',
    postedToExternal: false
  },
  {
    id: 'PAY-2024-003',
    memberCpr: '830456789',
    memberName: 'Sara Al-Dosari',
    packageId: 'pkg-3',
    packageName: 'Yoga Wellness - Half-Yearly',
    originalAmount: 120.000,
    discountAmount: 24.000,
    finalAmount: 96.000,
    paymentMethod: 'Online',
    couponCode: 'HALFYEAR20',
    status: 'Completed',
    paymentDate: '2024-01-17',
    receiptNumber: 'REC-2024-003',
    notes: 'First-time member discount applied',
    postedToExternal: true
  },
  {
    id: 'PAY-2024-004',
    memberCpr: '840567890',
    memberName: 'Ahmed Al-Farsi',
    packageId: 'pkg-4',
    packageName: 'CrossFit - Monthly',
    originalAmount: 35.000,
    discountAmount: 0,
    finalAmount: 35.000,
    paymentMethod: 'BenefitPay',
    couponCode: null,
    status: 'Pending',
    paymentDate: '2024-01-18',
    receiptNumber: 'REC-2024-004',
    notes: 'Awaiting confirmation',
    postedToExternal: false
  }
];

const sampleMembers: Member[] = [
  { cpr: '810234567', name: 'Fatima Al-Mahmoud', email: 'fatima@email.com', phone: '+973 3456 7890', membershipStatus: 'Active' },
  { cpr: '820345678', name: 'Mohammed Al-Khalifa', email: 'mohammed@email.com', phone: '+973 3567 8901', membershipStatus: 'Active' },
  { cpr: '830456789', name: 'Sara Al-Dosari', email: 'sara@email.com', phone: '+973 3678 9012', membershipStatus: 'Active' },
  { cpr: '840567890', name: 'Ahmed Al-Farsi', email: 'ahmed@email.com', phone: '+973 3789 0123', membershipStatus: 'Pending' },
];

const samplePackages: PackageOption[] = [
  { id: 'pkg-1', name: 'Weight Loss - Monthly', price: 25.000, duration: '30 Days', programName: 'Weight Loss Transformation' },
  { id: 'pkg-2', name: 'Weight Loss - Quarterly', price: 65.000, duration: '90 Days', programName: 'Weight Loss Transformation' },
  { id: 'pkg-3', name: 'Weight Loss - Half-Yearly', price: 120.000, duration: '180 Days', programName: 'Weight Loss Transformation' },
  { id: 'pkg-4', name: 'Muscle Building - Monthly', price: 30.000, duration: '30 Days', programName: 'Muscle Building Pro' },
  { id: 'pkg-5', name: 'Muscle Building - Quarterly', price: 80.000, duration: '90 Days', programName: 'Muscle Building Pro' },
  { id: 'pkg-6', name: 'CrossFit - Monthly', price: 35.000, duration: '30 Days', programName: 'CrossFit Extreme' },
];

const revenueChartData = [
  { day: 'Mon', revenue: 245 },
  { day: 'Tue', revenue: 320 },
  { day: 'Wed', revenue: 185 },
  { day: 'Thu', revenue: 410 },
  { day: 'Fri', revenue: 295 },
  { day: 'Sat', revenue: 520 },
  { day: 'Sun', revenue: 180 },
];

const paymentMethodData = [
  { name: 'Cash', value: 35, color: '#22c55e' },
  { name: 'Online', value: 40, color: '#3b82f6' },
  { name: 'BenefitPay', value: 25, color: '#f97316' },
];

const packageRevenueData = [
  { name: 'Monthly', revenue: 850, count: 28 },
  { name: 'Quarterly', revenue: 1200, count: 15 },
  { name: 'Half-Yearly', revenue: 960, count: 8 },
];

const PaymentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  
  // New Payment Form State
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'BenefitPay' | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  
  // Dialogs
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  // Stats calculation
  const todayTotal = payments
    .filter(p => p.paymentDate === new Date().toISOString().split('T')[0] && p.status === 'Completed')
    .reduce((sum, p) => sum + p.finalAmount, 0);
  
  const monthlyTotal = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.finalAmount, 0);
  
  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const totalTransactions = payments.length;

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.memberCpr.includes(searchTerm) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Filter members for search
  const filteredMembers = sampleMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.cpr.includes(memberSearchTerm)
  );

  const handleApplyCoupon = () => {
    // Sample coupon validation
    const validCoupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'SAVE10': { discount: 10, type: 'percentage' },
      'NEWMEMBER': { discount: 5, type: 'fixed' },
      'HALFYEAR20': { discount: 20, type: 'percentage' },
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon && selectedPackage) {
      const discountAmount = coupon.type === 'percentage' 
        ? (selectedPackage.price * coupon.discount / 100)
        : coupon.discount;
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: discountAmount });
      toast({
        title: "Coupon Applied!",
        description: `Discount of BHD ${discountAmount.toFixed(3)} applied`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code is invalid or expired",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price - (appliedCoupon?.discount || 0);
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
      id: `PAY-2024-${String(payments.length + 1).padStart(3, '0')}`,
      memberCpr: selectedMember.cpr,
      memberName: selectedMember.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      originalAmount: selectedPackage.price,
      discountAmount: appliedCoupon?.discount || 0,
      finalAmount: calculateTotal(),
      paymentMethod,
      couponCode: appliedCoupon?.code || null,
      status: 'Completed',
      paymentDate: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-2024-${String(payments.length + 1).padStart(3, '0')}`,
      notes: paymentNotes,
      postedToExternal: false,
    };

    setPayments([newPayment, ...payments]);
    
    // Reset form
    setSelectedMember(null);
    setMemberSearchTerm('');
    setSelectedPackage(null);
    setCouponCode('');
    setAppliedCoupon(null);
    setPaymentMethod(null);
    setPaymentNotes('');

    toast({
      title: "Payment Processed!",
      description: `Receipt ${newPayment.receiptNumber} generated successfully`,
    });
  };

  const handlePostToExternal = (paymentId: string) => {
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, postedToExternal: true } : p
    ));
    toast({
      title: "Posted to External System",
      description: `Payment ${paymentId} has been synced`,
    });
  };

  const handleBulkPost = () => {
    const unpostedPayments = payments.filter(p => !p.postedToExternal && p.status === 'Completed');
    setPayments(payments.map(p => 
      !p.postedToExternal && p.status === 'Completed' ? { ...p, postedToExternal: true } : p
    ));
    toast({
      title: "Bulk Post Complete",
      description: `${unpostedPayments.length} payments synced to external system`,
    });
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'Cash':
        return <Badge className="bg-green-500 hover:bg-green-600"><Banknote className="h-3 w-3 mr-1" /> Cash</Badge>;
      case 'Online':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><CreditCard className="h-3 w-3 mr-1" /> Online</Badge>;
      case 'BenefitPay':
        return <Badge className="bg-orange-500 hover:bg-orange-600"><Smartphone className="h-3 w-3 mr-1" /> BenefitPay</Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'Failed':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/AdminDashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setWebhookDialogOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Integration Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="new-payment">New Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Collections</p>
                      <p className="text-2xl font-bold text-gray-900">BHD {todayTotal.toFixed(3)}</p>
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
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">BHD {monthlyTotal.toFixed(3)}</p>
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
                      <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
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
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
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
                      <Tooltip formatter={(value) => [`BHD ${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
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
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.memberName}</TableCell>
                        <TableCell className="font-semibold text-green-600">BHD {payment.finalAmount.toFixed(3)}</TableCell>
                        <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Payment Tab */}
          <TabsContent value="new-payment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Select Member
                  </CardTitle>
                  <CardDescription>Search by CPR or name</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search member..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {memberSearchTerm && !selectedMember && (
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.cpr}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setSelectedMember(member);
                            setMemberSearchTerm('');
                          }}
                        >
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">CPR: {member.cpr}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedMember && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{selectedMember.name}</p>
                          <p className="text-sm text-gray-600">CPR: {selectedMember.cpr}</p>
                          <p className="text-sm text-gray-600">{selectedMember.email}</p>
                          <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Package Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Select Package
                  </CardTitle>
                  <CardDescription>Choose a membership package</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedPackage?.id || ''}
                    onValueChange={(value) => {
                      const pkg = samplePackages.find(p => p.id === value);
                      setSelectedPackage(pkg || null);
                      setAppliedCoupon(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {samplePackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - BHD {pkg.price.toFixed(3)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPackage && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold">{selectedPackage.name}</p>
                      <p className="text-sm text-gray-600">Program: {selectedPackage.programName}</p>
                      <p className="text-sm text-gray-600">Duration: {selectedPackage.duration}</p>
                      <p className="text-lg font-bold text-green-600 mt-2">BHD {selectedPackage.price.toFixed(3)}</p>
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
                  <CardDescription>Enter discount or offer code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!selectedPackage}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode || !selectedPackage}>
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-green-700">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">-BHD {appliedCoupon.discount.toFixed(3)} discount</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setAppliedCoupon(null)}>
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
                      variant={paymentMethod === 'Cash' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col ${paymentMethod === 'Cash' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      onClick={() => setPaymentMethod('Cash')}
                    >
                      <Banknote className="h-6 w-6 mb-2" />
                      Cash
                    </Button>
                    <Button
                      variant={paymentMethod === 'Online' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col ${paymentMethod === 'Online' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                      onClick={() => setPaymentMethod('Online')}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      Online
                    </Button>
                    <Button
                      variant={paymentMethod === 'BenefitPay' ? 'default' : 'outline'}
                      className={`h-20 flex flex-col ${paymentMethod === 'BenefitPay' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                      onClick={() => setPaymentMethod('BenefitPay')}
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
                      <Textarea
                        placeholder="Add payment notes..."
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span>BHD {selectedPackage?.price.toFixed(3) || '0.000'}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>-BHD {appliedCoupon.discount.toFixed(3)}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between text-xl font-bold text-green-600">
                      <span>Total Payable:</span>
                      <span>BHD {calculateTotal().toFixed(3)}</span>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={handleProcessPayment}
                      disabled={!selectedMember || !selectedPackage || !paymentMethod}
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
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View and manage all payment records</CardDescription>
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
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.memberName}</p>
                            <p className="text-sm text-gray-500">{payment.memberCpr}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.packageName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-green-600">BHD {payment.finalAmount.toFixed(3)}</p>
                            {payment.discountAmount > 0 && (
                              <p className="text-xs text-red-500">-{payment.discountAmount.toFixed(3)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                        <TableCell>{payment.couponCode || '-'}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.postedToExternal ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
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
                            {!payment.postedToExternal && payment.status === 'Completed' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePostToExternal(payment.id)}
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
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Daily Average</p>
                    <p className="text-3xl font-bold text-gray-900">BHD 308.000</p>
                    <p className="text-sm text-green-600">+12% vs last week</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">BHD 2,155.000</p>
                    <p className="text-sm text-green-600">+8% vs last week</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Total Discounts Given</p>
                    <p className="text-3xl font-bold text-red-600">BHD 156.500</p>
                    <p className="text-sm text-gray-500">From 23 coupons used</p>
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
                      <Tooltip formatter={(value, name) => [name === 'revenue' ? `BHD ${value}` : value, name === 'revenue' ? 'Revenue' : 'Count']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (BHD)" />
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
                        <p className="text-sm text-gray-500">10% off all packages</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">45 uses</p>
                        <p className="text-sm text-red-600">-BHD 450.000</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">NEWMEMBER</p>
                        <p className="text-sm text-gray-500">BHD 5 off for new members</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">23 uses</p>
                        <p className="text-sm text-red-600">-BHD 115.000</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">HALFYEAR20</p>
                        <p className="text-sm text-gray-500">20% off Half-Yearly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">50 uses</p>
                        <p className="text-sm text-red-600">-BHD 1,200.000</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

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
              Payments will be posted to this URL when you click "Post to External" or use bulk posting.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({ title: "Settings Saved", description: "Webhook URL has been configured" });
              setWebhookDialogOpen(false);
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
