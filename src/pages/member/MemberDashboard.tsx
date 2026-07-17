
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, TrendingUp, Bell, Activity } from 'lucide-react';
import { showConfirmToast } from "@/components/ui/show-confirm-toast";

const MemberDashboard = () => {
  const navigate = useNavigate();

  const memberInfo = {
    name: "John Doe",
    membershipType: "Premium",
    validUntil: "Dec 31, 2024",
    lastLogin: "Yesterday at 6:30 PM",
    currentWorkouts: 3,
    completedWorkouts: 8
  };

  const quickStats = [
    { title: 'Workouts This Week', value: '4/5', icon: Activity, progress: 80 },
    { title: 'Weight Progress', value: '-2.5 kg', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Membership Days Left', value: '45', icon: Calendar, color: 'text-purple-600' },
    { title: 'Pending Dues', value: 'BHD 0', icon: DollarSign, color: 'text-green-600' },
  ];

  const quickActions = [
    {
      title: "Payment History",
      description: "View all payments and receipts",
      route: "/MemberPayments",
      screenType: "MemberPayments",
    },
    {
      title: "Daily Workouts",
      description: "Check your personalized workout plan",
      route: "/MemberWorkouts",
      screenType: "MemberWorkouts",
    },
    {
      title: "Workout Programs",
      description: "Browse available programs and packages",
      route: "/MemberPrograms",
      screenType: "MemberPrograms",
    },
    {
      title: "Body Progress",
      description: "Track your fitness journey",
      route: "/MemberProgress",
      screenType: "MemberProgress",
    },
    {
      title: "Attendance",
      description: "View your gym check-in history",
      route: "/MemberAttendance",
      screenType: "MemberAttendance",
    },
  ];

  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  const permittedActions = quickActions.filter((action) =>
    permissions.some(
      (permission: any) =>
        permission.screen_type === action.screenType
    )
  );

  const recentAlerts = [
    { type: 'reminder', message: 'Membership renewal due in 15 days', time: '2 hours ago' },
    { type: 'workout', message: 'Missed chest workout yesterday', time: '1 day ago' },
    { type: 'achievement', message: 'Congratulations! 10 workouts completed this month', time: '2 days ago' },
  ];

  const performLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {memberInfo.name}!</h1>
              <p className="text-gray-600">{memberInfo.membershipType} Member • Valid until {memberInfo.validUntil}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge>{memberInfo.membershipType}</Badge>
              <Button variant="outline"
                onClick={() => {
                  showConfirmToast({
                    title: "Confirm Logout",
                    description: "Are you sure you want to logout?",
                    onConfirm: () => {
                      performLogout();
                    },
                  });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Member Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Summary</CardTitle>
            <CardDescription>Last login: {memberInfo.lastLogin}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color || 'text-gray-600'}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  {stat.progress && (
                    <Progress value={stat.progress} className="mt-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Manage your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permittedActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(action.route)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Alerts & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Workout Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Today's Workout</CardTitle>
            <CardDescription>Your personalized exercise schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Chest & Triceps</h3>
                <p className="text-sm text-gray-600">4 exercises • 45 min</p>
                <Badge variant="outline" className="mt-2">Pending</Badge>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium">Cardio Warm-up</h3>
                <p className="text-sm text-gray-600">15 min treadmill</p>
                <Badge className="mt-2 bg-green-500">Completed</Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Cool Down</h3>
                <p className="text-sm text-gray-600">10 min stretching</p>
                <Badge variant="outline" className="mt-2">Pending</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => navigate('/MemberWorkouts')}>
              View Full Workout Plan
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberDashboard;
