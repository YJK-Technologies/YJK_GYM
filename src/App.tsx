
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperUserManagement from "./pages/admin/SuperUserManagement";
import FacultyManagement from "./pages/admin/FacultyManagement";
import DietPlanManagement from "./pages/admin/DietPlanManagement";
import MemberManagement from "./pages/admin/MemberManagement";
import WorkoutProgramManagement from "./pages/admin/WorkoutProgramManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberWorkouts from "./pages/member/MemberWorkouts";
import Trainers from "./pages/member/Trainers";
import DietPlans from "./pages/member/DietPlans";
import WorkoutPrograms from "./pages/member/WorkoutPrograms";
import NotFound from "./pages/NotFound";
import Quotation from "./pages/Quotation";
import CompaniesList from "./pages/admin/CompaniesList";
import SettingScreen from "./pages/admin/Settings";

const queryClient = new QueryClient();

const PermissionRoute = ({
  screenType,
  element,
}: {
  screenType: string;
  element: JSX.Element;
}) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const permissions = JSON.parse(
    sessionStorage.getItem("permissions") || "[]"
  );

  const hasPermission = permissions.some(
    (item: any) => item.screen_type === screenType
  );

  return hasPermission ? element : <Navigate to="/AdminDashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quotation" element={<Quotation />} />

          <Route
            path="/AdminDashboard"
            element={
              <PermissionRoute
                screenType="AdminDashboard"
                element={<AdminDashboard />}
              />
            }
          />

          <Route
            path="/SuperUser"
            element={
              <PermissionRoute
                screenType="SuperUser"
                element={<SuperUserManagement />}
              />
            }
          />

          <Route
            path="/AdminMembers"
            element={
              <PermissionRoute
                screenType="AdminMembers"
                element={<MemberManagement />}
              />
            }
          />

          <Route
            path="/AdminFaculty"
            element={
              <PermissionRoute
                screenType="AdminFaculty"
                element={<FacultyManagement />}
              />
            }
          />

          <Route
            path="/AdminDietPlans"
            element={
              <PermissionRoute
                screenType="AdminDietPlans"
                element={<DietPlanManagement />}
              />
            }
          />

          <Route
            path="/AdminPrograms"
            element={
              <PermissionRoute
                screenType="AdminPrograms"
                element={<WorkoutProgramManagement />}
              />
            }
          />

          <Route
            path="/AdminPayments"
            element={
              <PermissionRoute
                screenType="AdminPayments"
                element={<PaymentManagement />}
              />
            }
          />

          <Route
            path="/AdminCoupons"
            element={
              <PermissionRoute
                screenType="AdminCoupons"
                element={<CouponManagement />}
              />
            }
          />

          <Route
            path="/AdminNotification"
            element={
              <PermissionRoute
                screenType="AdminNotification"
                element={<NotificationManagement />}
              />
            }
          />

          <Route
            path="/Member"
            element={
              <PermissionRoute
                screenType="Member"
                element={<MemberDashboard />}
              />
            }
          />

          <Route
            path="/MemberWorkouts"
            element={
              <PermissionRoute
                screenType="MemberWorkouts"
                element={<MemberWorkouts />}
              />
            }
          />

          <Route
            path="/MemberTrainers"
            element={
              <PermissionRoute
                screenType="MemberTrainers"
                element={<Trainers />}
              />
            }
          />

          <Route
            path="/MemberDietPlans"
            element={
              <PermissionRoute
                screenType="MemberDietPlans"
                element={<DietPlans />}
              />
            }
          />

          <Route
            path="/MemberPrograms"
            element={
              <PermissionRoute
                screenType="MemberPrograms"
                element={<WorkoutPrograms />}
              />
            }
          />

          <Route
            path="/AdminCompanies"
            element={
              <PermissionRoute
                screenType="AdminCompanies"
                element={<CompaniesList />}
              />
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PermissionRoute
                screenType="AdminCompanies"
                element={<SettingScreen />}
              />
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
