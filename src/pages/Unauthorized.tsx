import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  // Prefer loginType, fallback to role_id if stored as a string name
  const storedLoginType = sessionStorage.getItem("role_id");

  const handleGoToDashboard = () => {
    const normalizedLoginType = storedLoginType?.toString().trim().toLowerCase();

    if (normalizedLoginType === "member" || normalizedLoginType === "2") {
      navigate("/MemberDashboard", { replace: true });
    } else {
      navigate("/AdminDashboard", { replace: true });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center bg-card p-8 rounded-2xl shadow-xl border border-border">
        
        {/* Inline "4 [Shield] 3" Design */}
        <div className="flex items-center justify-center space-x-1 mb-6">
          <span className="text-8xl font-extrabold text-muted-foreground/20 leading-none select-none">
            4
          </span>
          
          {/* Shield Icon in place of "0" */}
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 shadow-sm mx-1">
            <ShieldAlert className="h-10 w-10" />
          </div>

          <span className="text-8xl font-extrabold text-muted-foreground/20 leading-none select-none">
            3
          </span>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Access Denied
        </h1>

        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          You don't have permission to access this screen. Please switch to an account with proper privileges or head back to your dashboard.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full h-11 text-sm font-medium"
            variant="default"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full h-11 text-sm font-medium"
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;