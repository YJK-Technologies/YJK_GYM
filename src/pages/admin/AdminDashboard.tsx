import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Calendar, TrendingUp, ChevronDown, Building2, LogOut, Shield, Settings } from 'lucide-react';
import GymFloorActivity from '@/components/admin/GymFloorActivity';
import { showConfirmToast } from "@/components/ui/show-confirm-toast";

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  const allowedScreens = permissions.map((item: any) => item.screen_type);

  const stats = [
    { title: 'Total Members', value: '1,234', icon: Users, color: 'bg-purple-500' },
    { title: 'Monthly Revenue', value: 'BHD 12,500', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Programs', value: '28', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '+15%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const quickActions = [
    { title: 'Member Management', description: 'Add, edit, or remove members', route: '/AdminMembers' },
    { title: 'Workout Programs', description: 'Create and assign workout plans', route: '/AdminPrograms' },
    { title: 'Payment Management', description: 'Process payments (Cash/Online/BenefitPay)', route: '/AdminPayments' },
    { title: 'Coupon Management', description: 'Create discount and offer codes', route: '/AdminCoupons' },
    { title: 'Inventory & Sales', description: 'Manage products and expenses', route: '/AdminInventory' },
    { title: 'Reports', description: 'Generate financial and attendance reports', route: '/AdminReports' },
    { title: 'Notifications', description: 'Send bulk Email, SMS & WhatsApp notifications', route: '/AdminNotification' },
    { title: 'Faculty Management', description: 'Manage personal trainers and staff', route: '/AdminFaculty' },
    { title: 'Diet Plan Management', description: 'Create and assign nutrition programs', route: '/AdminDietPlans' },
    { title: 'Super User Management', description: 'Manage all administrative modules.', route: '/SuperUser' },
  ];

  const filteredQuickActions = quickActions.filter((action) => allowedScreens.includes(action.route.replace("/", "")));

  const performLogout = () => {
    sessionStorage.clear(); // or remove only the required items
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <Button variant="outline" onClick={() => navigate('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header> */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Dynamic Profile/Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full py-1.5 pl-3 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {/* Avatar Icon */}
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Shield className="h-4 w-4" />
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">Welcome</p>
                  <p className="text-xs text-gray-500">Super Administrator</p>
                </div>

                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Overlay */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-semibold text-gray-800">Welcome</p>
                    <p className="text-xs text-gray-500">Super Administrator</p>
                  </div>

                  {/* 1. List of Companies */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/AdminCompanies');
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <Building2 className="h-4 w-4 text-gray-400 group-hover:text-purple-600 mr-3 transition-colors" />
                    <span className="font-medium">List of Companies</span>
                  </button>

                  {/* 2. Settings */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <Settings className="h-4 w-4 text-gray-400 group-hover:text-purple-600 mr-3 transition-colors" />
                    <span className="font-medium">Settings</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  {/* 3. Log out */}
                  {/* <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium group"
                  >
                    <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600 mr-3 transition-colors" />
                    Log out
                  </button> */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      showConfirmToast({
                        title: "Confirm Logout", description: "Are you sure you want to logout?",
                        onConfirm: () => {
                          performLogout();
                        },
                      });
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium group"
                  >
                    <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600 mr-3 transition-colors" />
                    Log out
                  </button>
                </div>
              )}
            </div>

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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your gym operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate(action.route)}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gym Floor Activity - Real-time attendance */}
        <GymFloorActivity />

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New member registration</p>
                  <p className="text-sm text-gray-600">John Doe joined Premium Plan</p>
                </div>
                <Badge>New</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-gray-600">Sarah Wilson - Monthly dues</p>
                </div>
                <Badge variant="secondary">Payment</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Workout program assigned</p>
                  <p className="text-sm text-gray-600">Weight Loss Program to Mike Johnson</p>
                </div>
                <Badge variant="outline">Program</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;