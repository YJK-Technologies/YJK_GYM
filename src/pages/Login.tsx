import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import ruwLogo from "@/assets/ruw-logo-full.png";
import CryptoJS from "crypto-js";
import { BASE_URL } from "./ApiConfig";
import { useCompany } from "./CompanyContext";

const Login = () => {
  const { setCompanyData } = useCompany();

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

  const handleLogin = async (role: "admin" | "member") => {
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

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_id: encryptedEmail,
          user_password: encryptedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const [{ user_code, role_id, user_images }] = data;

        if (user_images?.data) {
          sessionStorage.setItem(
            "user_image",
            arrayBufferToBase64(user_images.data),
          );
        }

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user_code", user_code);
        sessionStorage.setItem("role_id", role_id);

        await UserPermission(role_id);
        await fetchUserData(user_code);

        if (role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/Member");
        }
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

  const fetchUserData = async (userCode: string) => {
    try {
      const response = await fetch(`${BASE_URL}/getusercompany`, {
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

          setCompanyData({
            companyCode: company.company_no,
            companyName: company.company_name,
            locationCode: company.location_no,
            locationName: company.location_name,
            userCode: company.user_code,
            userName: company.user_name,
            shortName: company.short_name,
          });

          handleSave(company);

          navigate("/AccountInformation");
        }
      }
    } catch (err) {
      console.error(err);
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src={ruwLogo}
              alt="Royal University for Women Logo"
              className="h-20"
            />
          </div>
          <CardTitle className="text-2xl font-bold">RUW FitnessPro</CardTitle>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-password">Password</Label>
                  <Input
                    id="member-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                  />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                  />
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
