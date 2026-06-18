
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Tag, 
  Percent, 
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  RefreshCw
} from 'lucide-react';

// Types
interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchase: number;
  validFrom: string;
  validUntil: string;
  maxUses: number | null;
  currentUses: number;
  applicablePackages: string[];
  status: 'Active' | 'Inactive' | 'Expired';
}

// Sample data
const sampleCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'SAVE10',
    description: '10% off all packages',
    discountType: 'percentage',
    discountValue: 10,
    minimumPurchase: 20,
    validFrom: '2024-01-01',
    validUntil: '2024-03-31',
    maxUses: 100,
    currentUses: 45,
    applicablePackages: ['all'],
    status: 'Active'
  },
  {
    id: 'coup-2',
    code: 'NEWMEMBER',
    description: 'BHD 5 off for new members',
    discountType: 'fixed',
    discountValue: 5,
    minimumPurchase: 25,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    maxUses: null,
    currentUses: 23,
    applicablePackages: ['Monthly'],
    status: 'Active'
  },
  {
    id: 'coup-3',
    code: 'HALFYEAR20',
    description: '20% off Half-Yearly packages',
    discountType: 'percentage',
    discountValue: 20,
    minimumPurchase: 100,
    validFrom: '2024-02-01',
    validUntil: '2024-02-28',
    maxUses: 50,
    currentUses: 50,
    applicablePackages: ['Half-Yearly'],
    status: 'Expired'
  },
  {
    id: 'coup-4',
    code: 'SUMMER25',
    description: '25% off quarterly packages for summer',
    discountType: 'percentage',
    discountValue: 25,
    minimumPurchase: 50,
    validFrom: '2024-06-01',
    validUntil: '2024-08-31',
    maxUses: 200,
    currentUses: 0,
    applicablePackages: ['Quarterly'],
    status: 'Inactive'
  }
];

const CouponManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minimumPurchase: 0,
    validFrom: '',
    validUntil: '',
    maxUses: null as number | null,
    applicablePackages: ['all'] as string[],
    isActive: true
  });

  // Stats
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const totalDiscountGiven = 1765.5; // Sample calculation
  const mostUsedCoupon = coupons.reduce((prev, curr) => 
    prev.currentUses > curr.currentUses ? prev : curr
  );

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchase: coupon.minimumPurchase,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        maxUses: coupon.maxUses,
        applicablePackages: coupon.applicablePackages,
        isActive: coupon.status === 'Active'
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minimumPurchase: 0,
        validFrom: '',
        validUntil: '',
        maxUses: null,
        applicablePackages: ['all'],
        isActive: true
      });
    }
    setDialogOpen(true);
  };

  const handleSaveCoupon = () => {
    if (!formData.code || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const couponData: Coupon = {
      id: editingCoupon?.id || `coup-${Date.now()}`,
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minimumPurchase: formData.minimumPurchase,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      maxUses: formData.maxUses,
      currentUses: editingCoupon?.currentUses || 0,
      applicablePackages: formData.applicablePackages,
      status: formData.isActive ? 'Active' : 'Inactive'
    };

    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? couponData : c));
      toast({ title: "Coupon Updated", description: `${couponData.code} has been updated` });
    } else {
      setCoupons([couponData, ...coupons]);
      toast({ title: "Coupon Created", description: `${couponData.code} has been created` });
    }

    setDialogOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast({ title: "Coupon Deleted", description: "The coupon has been removed" });
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(coupons.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        return { ...c, status: newStatus as 'Active' | 'Inactive' | 'Expired' };
      }
      return c;
    }));
    toast({ title: "Status Updated", description: "Coupon status has been changed" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Inactive</Badge>;
      case 'Expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Expired</Badge>;
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
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                  <Tag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCoupons}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-500 text-white mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Discounts Given</p>
                  <p className="text-2xl font-bold text-gray-900">BHD {totalDiscountGiven.toFixed(3)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500 text-white mr-4">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Used Coupon</p>
                  <p className="text-2xl font-bold text-gray-900">{mostUsedCoupon.code}</p>
                  <p className="text-sm text-gray-500">{mostUsedCoupon.currentUses} uses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>All Coupons</CardTitle>
                <CardDescription>Manage discount and offer codes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">{coupon.code}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyCode(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{coupon.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {coupon.discountType === 'percentage' ? (
                          <><Percent className="h-3 w-3 mr-1" />{coupon.discountValue}%</>
                        ) : (
                          <>BHD {coupon.discountValue.toFixed(3)}</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{coupon.validFrom}</p>
                        <p className="text-gray-500">to {coupon.validUntil}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{coupon.currentUses}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</p>
                        {coupon.maxUses && (
                          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-blue-500 rounded-full" 
                              style={{ width: `${Math.min((coupon.currentUses / coupon.maxUses) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {coupon.applicablePackages.includes('all') ? 'All' : coupon.applicablePackages.join(', ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(coupon)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {coupon.status !== 'Expired' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleStatus(coupon.id)}
                          >
                            {coupon.status === 'Active' ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCoupon(coupon.id)}
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
      </main>

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update coupon details' : 'Add a new discount or offer code'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (BHD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter coupon description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value ({formData.discountType === 'percentage' ? '%' : 'BHD'}) *
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumPurchase">Minimum Purchase (BHD)</Label>
                <Input
                  id="minimumPurchase"
                  type="number"
                  value={formData.minimumPurchase}
                  onChange={(e) => setFormData({ ...formData, minimumPurchase: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.001}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Maximum Uses (leave empty for unlimited)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : null })}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packages">Applicable Packages</Label>
                <Select 
                  value={formData.applicablePackages[0]} 
                  onValueChange={(value) => setFormData({ ...formData, applicablePackages: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Packages</SelectItem>
                    <SelectItem value="Monthly">Monthly Only</SelectItem>
                    <SelectItem value="Quarterly">Quarterly Only</SelectItem>
                    <SelectItem value="Half-Yearly">Half-Yearly Only</SelectItem>
                  </SelectContent>
                </Select>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;
