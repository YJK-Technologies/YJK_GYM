
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import GymFloorActivity from '@/components/admin/GymFloorActivity';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Members', value: '1,234', icon: Users, color: 'bg-purple-500' },
    { title: 'Monthly Revenue', value: 'BHD 12,500', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Programs', value: '28', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '+15%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const quickActions = [
    { title: 'Member Management', description: 'Add, edit, or remove members', route: '/admin/members' },
    { title: 'Workout Programs', description: 'Create and assign workout plans', route: '/admin/programs' },
    { title: 'Payment Management', description: 'Process payments (Cash/Online/BenefitPay)', route: '/admin/payments' },
    { title: 'Coupon Management', description: 'Create discount and offer codes', route: '/admin/coupons' },
    { title: 'Inventory & Sales', description: 'Manage products and expenses', route: '/admin/inventory' },
    { title: 'Reports', description: 'Generate financial and attendance reports', route: '/admin/reports' },
    { title: 'Notifications', description: 'Send bulk Email, SMS & WhatsApp notifications', route: '/admin/notifications' },
    { title: 'Faculty Management', description: 'Manage personal trainers and staff', route: '/admin/faculty' },
    { title: 'Diet Plan Management', description: 'Create and assign nutrition programs', route: '/admin/diet-plans' },
    { title: 'Super User Management', description: 'Add, edit, or remove members', route: '/admin/super-user' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
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
              {quickActions.map((action, index) => (
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
