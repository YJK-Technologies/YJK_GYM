import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import yjkLogo from '@/assets/yjk-logo.png';
import CryptoJS from "crypto-js";
import { BASE_URL } from "./ApiConfig";
import { useCompany } from "./CompanyContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { setCompanyData } = useCompany();

  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const secretKey = "yjk26012024";
  const navigate = useNavigate();

  const arrayBufferToBase64 = (buf) => {
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++)
      binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  const handleLogin = async (loginType: "admin" | "member") => {
    setLoading(true);
    setLoginError("");

    if (!email.trim()) {
      setLoginError("Email ID is required.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setLoginError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();

      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        secretKey,
      ).toString();

      const encryptedLoginType = CryptoJS.AES.encrypt(loginType, secretKey).toString();

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_id: encryptedEmail,
          user_password: encryptedPassword,
          loginType: encryptedLoginType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const [{
          user_code,
          role_id,
          user_images,
          membershipType,
          planExpiryDate,
        }] = data;

        if (user_images?.data) {
          sessionStorage.setItem(
            "user_image",
            arrayBufferToBase64(user_images.data),
          );
        }

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user_code", user_code);
        sessionStorage.setItem("role_id", role_id);
        sessionStorage.setItem("loginType", loginType);

        if (membershipType) {
          sessionStorage.setItem("membershipType", membershipType);
        }

        if (planExpiryDate) {
          sessionStorage.setItem("planExpiryDate", planExpiryDate);
        }

        await UserPermission(role_id);
        // await fetchUserData(user_code);
        await fetchUserData(user_code, loginType);

        // if (loginType === "member") {
        //   navigate("/MemberDashboard", { replace: true });
        // } else {
        //   navigate("/AdminDashboard", { replace: true });
        // }

      } else {
        setLoginError(data.message || "Invalid Email ID or Password");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for both email and password fields
  const handleEnterKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    loginType: "admin" | "member"
  ) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(loginType);
    }
  };

  const UserPermission = async (role_id: any) => {
    try {
      const response = await fetch(`${BASE_URL}/getUserPermission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem("permissions", JSON.stringify(data));

        window.dispatchEvent(new Event("permissionsUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const fetchUserData = async (userCode: string) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/getusercompany`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         user_code: userCode,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       if (data.length > 0) {
  //         const company = data[0];

  //         setCompanyData({
  //           companyCode: company.company_no,
  //           companyName: company.company_name,
  //           locationCode: company.location_no,
  //           locationName: company.location_name,
  //           userCode: company.user_code,
  //           userName: company.user_name,
  //           shortName: company.short_name,
  //         });

  //         handleSave(company);
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

// const fetchUserData = async (userCode) => {
//   try {
//     const response = await fetch(`${BASE_URL}/getDefaultUserCompany`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_code: userCode,
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();

//       if (data.length > 0) {
//         const company = data[0];

//         // Set Company Context
//         setCompanyData({
//           companyCode: company.company_no,
//           companyName: company.company_name,
//           locationCode: company.location_no,
//           locationName: company.location_name,
//           userCode: company.user_code,
//           userName: company.user_name,
//           shortName: company.short_name,
//         });

//         // Save company details in sessionStorage
//         handleSave(company);

//         // Get Default Screen
//         const defaultScreen = company.DefaultScreenId?.trim();

//         // Navigate to Default Screen
//         if (defaultScreen) {
//           navigate(`/${defaultScreen}`, { replace: true });
//         } else {
//           navigate("/AccountInformation", { replace: true });
//         }
//       } else {
//         console.log("Default company mapping not found.");
//         navigate("/AccountInformation", { replace: true });
//       }
//     } else {
//       console.log("Failed to fetch default company mapping.");
//       navigate("/AccountInformation", { replace: true });
//     }
//   } catch (err) {
//     console.error("Error fetching default user company:", err);
//     navigate("/AccountInformation", { replace: true });
//   }
// };


const fetchUserData = async (userCode, loginType) => {
  try {
    const response = await fetch(`${BASE_URL}/getDefaultUserCompany`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_code: userCode,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) {
        const company = data[0];

        // Set Company Context
        setCompanyData({
          companyCode: company.company_no,
          companyName: company.company_name,
          locationCode: company.location_no,
          locationName: company.location_name,
          userCode: company.user_code,
          userName: company.user_name,
          shortName: company.short_name,
        });

        // Save Company Details
        handleSave(company);

        // Get Default Screen
        const defaultScreen = company.DefaultScreenId?.trim();

        if (defaultScreen) {
          // If DefaultScreenId has value
          navigate(`/${defaultScreen}`, { replace: true });
        } else {
          // If DefaultScreenId is empty
          if (loginType === "admin") {
            navigate("/AdminDashboard", { replace: true });
          } else if (loginType === "member") {
            navigate("/MemberDashboard", { replace: true });
          }
        }
      } else {
        // No company data found
        if (loginType === "admin") {
          navigate("/AdminDashboard", { replace: true });
        } else if (loginType === "member") {
          navigate("/MemberDashboard", { replace: true });
        }
      }
    } else {
      // API failed
      if (loginType === "admin") {
        navigate("/AdminDashboard", { replace: true });
      } else if (loginType === "member") {
        navigate("/MemberDashboard", { replace: true });
      }
    }
  } catch (err) {
    console.error("Error fetching default user company:", err);

    // Error fallback
    if (loginType === "admin") {
      navigate("/AdminDashboard", { replace: true });
    } else if (loginType === "member") {
      navigate("/MemberDashboard", { replace: true });
    }
  }
};
  const handleSave = (data: any) => {
    if (!data) return;

    sessionStorage.setItem("selectedCompanyCode", data.company_no);
    sessionStorage.setItem("selectedCompanyName", data.company_name);
    sessionStorage.setItem("selectedLocationCode", data.location_no);
    sessionStorage.setItem("selectedLocationName", data.location_name);
    sessionStorage.setItem("selectedShortName", data.short_name);
    sessionStorage.setItem("selectedUserName", data.user_name);
    sessionStorage.setItem("selectedUserCode", data.user_code);
    sessionStorage.setItem("DefaultScreenId",data.DefaultScreenId || "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src={yjkLogo}
              alt="Royal University for Women Logo"
              className="h-20"
            />
          </div>
          <CardTitle className="text-2xl font-bold">YJK FitnessPro</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member">Member</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="member" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member-email">Email ID</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="Enter your Email ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError("");
                    }}
                    onKeyDown={(e) => handleEnterKey(e, "member")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-password">Password</Label>

                  <div className="relative">
                    <Input
                      id="member-password"
                      type={showMemberPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError("");
                      }}
                      onKeyDown={(e) => handleEnterKey(e, "member")}
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowMemberPassword(!showMemberPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showMemberPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => handleLogin("member")}
                >
                  {loading ? "Signing In..." : "Sign In as Member"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email ID</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter Admin Email ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError("");
                    }}
                    onKeyDown={(e) => handleEnterKey(e, "admin")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>

                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError("");
                      }}
                      onKeyDown={(e) => handleEnterKey(e, "admin")}
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showAdminPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={loading}
                  onClick={() => handleLogin("admin")}
                >
                  {loading ? "Signing In..." : "Sign In as Admin"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
