
import React, { useState } from 'react';
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
import { 
  ArrowLeft, Users, UserCheck, UserX, Clock, Search, Plus, 
  Eye, Pencil, Trash2, CalendarIcon, Phone, Mail, MapPin, 
  AlertCircle, Bell, Megaphone 
} from 'lucide-react';

interface Member {
  cpr: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  bahrainMobile: string;
  whatsappNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  joinedDate: Date;
  planExpiryDate: Date;
  membershipType: 'Premium' | 'Standard' | 'Basic';
  isActive: boolean;
  receivePromotions: boolean;
  receiveNotifications: boolean;
  photo?: string;
}

const sampleMembers: Member[] = [
  {
    cpr: '810234567',
    fullName: 'Fatima Al-Mahmoud',
    dateOfBirth: new Date(1995, 2, 15),
    gender: 'Female',
    bahrainMobile: '+973 3456 7890',
    whatsappNumber: '+973 3456 7890',
    email: 'fatima.m@gmail.com',
    address: 'Flat 12, Building 456, Road 789, Block 321, Manama',
    emergencyContactName: 'Ahmed Al-Mahmoud',
    emergencyContactPhone: '+973 1234 5678',
    emergencyContactRelation: 'Father',
    joinedDate: new Date(2024, 0, 1),
    planExpiryDate: new Date(2024, 11, 31),
    membershipType: 'Premium',
    isActive: true,
    receivePromotions: true,
    receiveNotifications: true,
  },
  {
    cpr: '820345678',
    fullName: 'Mohammed Al-Khalifa',
    dateOfBirth: new Date(1990, 6, 22),
    gender: 'Male',
    bahrainMobile: '+973 3567 8901',
    whatsappNumber: '+973 3567 8901',
    email: 'mohammed.k@gmail.com',
    address: 'Villa 23, Road 456, Block 123, Riffa',
    emergencyContactName: 'Sara Al-Khalifa',
    emergencyContactPhone: '+973 2345 6789',
    emergencyContactRelation: 'Wife',
    joinedDate: new Date(2023, 5, 15),
    planExpiryDate: new Date(2025, 5, 14),
    membershipType: 'Standard',
    isActive: true,
    receivePromotions: false,
    receiveNotifications: true,
  },
  {
    cpr: '830456789',
    fullName: 'Aisha Al-Doseri',
    dateOfBirth: new Date(1988, 10, 8),
    gender: 'Female',
    bahrainMobile: '+973 3678 9012',
    whatsappNumber: '+973 3678 9012',
    email: 'aisha.d@gmail.com',
    address: 'Apartment 5, Building 789, Road 123, Block 456, Muharraq',
    emergencyContactName: 'Khalid Al-Doseri',
    emergencyContactPhone: '+973 3456 7890',
    emergencyContactRelation: 'Brother',
    joinedDate: new Date(2024, 2, 1),
    planExpiryDate: new Date(2024, 7, 31),
    membershipType: 'Basic',
    isActive: false,
    receivePromotions: true,
    receiveNotifications: false,
  },
];

const emptyMember: Omit<Member, 'cpr'> & { cpr: string } = {
  cpr: '',
  fullName: '',
  dateOfBirth: new Date(),
  gender: 'Male',
  bahrainMobile: '',
  whatsappNumber: '',
  email: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  joinedDate: new Date(),
  planExpiryDate: new Date(),
  membershipType: 'Standard',
  isActive: true,
  receivePromotions: false,
  receiveNotifications: false,
};

const MemberManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Member>(emptyMember as Member);

  const stats = [
    { title: 'Total Members', value: members.length, icon: Users, color: 'bg-blue-500' },
    { title: 'Active', value: members.filter(m => m.isActive).length, icon: UserCheck, color: 'bg-green-500' },
    { title: 'Inactive', value: members.filter(m => !m.isActive).length, icon: UserX, color: 'bg-red-500' },
    { 
      title: 'Expiring Soon', 
      value: members.filter(m => {
        const daysUntilExpiry = Math.ceil((m.planExpiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      }).length, 
      icon: Clock, 
      color: 'bg-orange-500' 
    },
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cpr.includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bahrainMobile.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && member.isActive) ||
      (statusFilter === 'inactive' && !member.isActive);
    
    const matchesMembership = 
      membershipFilter === 'all' || member.membershipType === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setFormData(emptyMember as Member);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsDialogOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setViewingMember(member);
    setIsViewDialogOpen(true);
  };

  const handleDeleteMember = (cpr: string) => {
    setMembers(members.filter(m => m.cpr !== cpr));
    toast({
      title: 'Member Deleted',
      description: 'Member has been removed successfully.',
    });
  };

  const handleSaveMember = () => {
    if (!formData.cpr || formData.cpr.length !== 9 || !/^\d{9}$/.test(formData.cpr)) {
      toast({
        title: 'Invalid CPR',
        description: 'CPR must be exactly 9 digits.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.fullName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter the member\'s full name.',
        variant: 'destructive',
      });
      return;
    }

    if (editingMember) {
      setMembers(members.map(m => m.cpr === editingMember.cpr ? formData : m));
      toast({
        title: 'Member Updated',
        description: 'Member information has been updated successfully.',
      });
    } else {
      if (members.some(m => m.cpr === formData.cpr)) {
        toast({
          title: 'Duplicate CPR',
          description: 'A member with this CPR already exists.',
          variant: 'destructive',
        });
        return;
      }
      setMembers([...members, formData]);
      toast({
        title: 'Member Added',
        description: 'New member has been added successfully.',
      });
    }
    setIsDialogOpen(false);
  };

  const toggleMemberStatus = (cpr: string) => {
    setMembers(members.map(m => 
      m.cpr === cpr ? { ...m, isActive: !m.isActive } : m
    ));
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
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
        </Card>

        {/* Members Table */}
        <Card>
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
        </Card>

        {/* Add/Edit Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Update member information' : 'Enter member details. CPR number is the primary identifier.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpr">CPR Number *</Label>
                    <Input
                      id="cpr"
                      placeholder="9-digit CPR number"
                      value={formData.cpr}
                      onChange={(e) => setFormData({ ...formData, cpr: e.target.value })}
                      maxLength={9}
                      disabled={!!editingMember}
                    />
                    {editingMember && (
                      <p className="text-xs text-gray-500">CPR cannot be changed after creation</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth ? format(formData.dateOfBirth, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={(date) => date && setFormData({ ...formData, dateOfBirth: date })}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value: 'Male' | 'Female') => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bahrainMobile">Bahrain Mobile</Label>
                    <Input
                      id="bahrainMobile"
                      placeholder="+973 XXXX XXXX"
                      value={formData.bahrainMobile}
                      onChange={(e) => setFormData({ ...formData, bahrainMobile: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="+973 XXXX XXXX"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Flat/Villa, Building, Road, Block, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Emergency contact name"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      placeholder="+973 XXXX XXXX"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship</Label>
                    <Input
                      id="emergencyContactRelation"
                      placeholder="e.g., Father, Spouse"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="membershipType">Membership Type</Label>
                    <Select 
                      value={formData.membershipType} 
                      onValueChange={(value: 'Premium' | 'Standard' | 'Basic') => setFormData({ ...formData, membershipType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Basic">Basic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Joined Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.joinedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.joinedDate ? format(formData.joinedDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.joinedDate}
                          onSelect={(date) => date && setFormData({ ...formData, joinedDate: date })}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Plan Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.planExpiryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.planExpiryDate ? format(formData.planExpiryDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.planExpiryDate}
                          onSelect={(date) => date && setFormData({ ...formData, planExpiryDate: date })}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label>{formData.isActive ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Communication Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="receivePromotions"
                      checked={formData.receivePromotions}
                      onCheckedChange={(checked) => setFormData({ ...formData, receivePromotions: checked === true })}
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
                      checked={formData.receiveNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, receiveNotifications: checked === true })}
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMember}>
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Member Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>
                CPR: {viewingMember?.cpr}
              </DialogDescription>
            </DialogHeader>

            {viewingMember && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{viewingMember.fullName}</h2>
                    <Badge variant={viewingMember.isActive ? 'default' : 'secondary'} className="mt-2">
                      {viewingMember.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {viewingMember.membershipType}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Personal Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">CPR:</span> {viewingMember.cpr}</p>
                      <p><span className="font-medium">DOB:</span> {format(viewingMember.dateOfBirth, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Gender:</span> {viewingMember.gender}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Membership</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Joined:</span> {format(viewingMember.joinedDate, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Expiry:</span> {format(viewingMember.planExpiryDate, 'dd MMM yyyy')}</p>
                      <p><span className="font-medium">Type:</span> {viewingMember.membershipType}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {viewingMember.bahrainMobile}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> WhatsApp: {viewingMember.whatsappNumber}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {viewingMember.email}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1" /> {viewingMember.address}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {viewingMember.emergencyContactName}
                      </p>
                      <p><span className="font-medium">Phone:</span> {viewingMember.emergencyContactPhone}</p>
                      <p><span className="font-medium">Relation:</span> {viewingMember.emergencyContactRelation}</p>
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
                        <Badge variant={viewingMember.receivePromotions ? 'default' : 'secondary'}>
                          {viewingMember.receivePromotions ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications:</span>
                        <Badge variant={viewingMember.receiveNotifications ? 'default' : 'secondary'}>
                          {viewingMember.receiveNotifications ? 'Yes' : 'No'}
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
