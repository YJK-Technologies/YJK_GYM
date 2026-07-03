
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/super-user" element={<SuperUserManagement />} />
          <Route path="/admin/members" element={<MemberManagement />} />
          <Route path="/admin/faculty" element={<FacultyManagement />} />
          <Route path="/admin/diet-plans" element={<DietPlanManagement />} />
          <Route path="/admin/programs" element={<WorkoutProgramManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/coupons" element={<CouponManagement />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/workouts" element={<MemberWorkouts />} />
          <Route path="/member/trainers" element={<Trainers />} />
          <Route path="/member/diet-plans" element={<DietPlans />} />
          <Route path="/member/programs" element={<WorkoutPrograms />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/admin/companies" element={<CompaniesList />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
