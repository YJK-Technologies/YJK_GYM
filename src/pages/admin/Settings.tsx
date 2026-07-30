import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "../ApiConfig";
import { ArrowLeft, Settings, User, Building2, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCompany } from "../CompanyContext";

const SettingScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companyCode, locationCode, userCode } = useCompany();

  // Form states matching the image requirements
  const [numberGeneration, setNumberGeneration] = useState<string>("Auto");
  const [expiringDays, setExpiringDays] = useState<string>("");
  const [currency, setCurrency] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedCompanyCode = sessionStorage.getItem("selectedCompanyCode");
    const savedCompanyName = sessionStorage.getItem("selectedCompanyName");
    const savedLocationCode = sessionStorage.getItem("selectedLocationCode");
    const savedLocationName = sessionStorage.getItem("selectedLocationName");
    const savedUserCode =
      sessionStorage.getItem("selectedUserCode") ||
      sessionStorage.getItem("user_code");
    const savedUserName = sessionStorage.getItem("selectedUserName");

    if (savedCompanyCode) {
      const context = {
        userCode: savedUserCode || "JK",
        userName: savedUserName || "JaiKrishnan",
        companyCode: savedCompanyCode,
        companyName: savedCompanyName || "",
        locationCode: savedLocationCode || "",
        locationName: savedLocationName || "",
      };

      getSettingData(context);
    }
  }, []);

  const getSettingData = async (context: any) => {
    try {
      const response = await fetch(`${BASE_URL}/getSettingScreenData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Company_code: context.companyCode,
          Location_code: context.locationCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("NumberGeneration:", data[0].NumberGeneration);

        if (data.length > 0) {
          setNumberGeneration(data[0].NumberGeneration || "Auto");
          setExpiringDays(data[0].MemberExpiredSoon?.toString() || "");
          setCurrency(data[0].Currency || "");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if(!currency)
    {
      setError(true);
      return
    }

    setError(false);

    try {
      // Update this endpoint according to your actual configuration backend API
      const response = await fetch(`${BASE_URL}/settingSaveData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyCode: companyCode,
          locationCode: locationCode,
          NumberGeneration: numberGeneration,
          MemberExpiredSoon: expiringDays,
          Currency: currency,
          created_by: userCode,
        }),
      });
      
        if (!currency) {
    toast({
        title: "Validation",
        description: "Please select a currency.",
        variant: "destructive",
    });
    return;
       }

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings updated successfully.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top sticky navigation bar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/AdminDashboard")}
                className="hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-600" />
                Setting Screen
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Context Parameters Banner (Consistent with app shell) */}
        {/* <Card className="border border-gray-200/80 shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
        {/* User Block */}
        {/* <div className="space-y-3 md:border-r border-gray-100 last:border-0 pr-4">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <User className="h-3.5 w-3.5" /> User Information
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">User Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.userCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">User Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.userName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div> */}

        {/* Company Block */}
        {/* <div className="space-y-3 md:border-r border-gray-100 last:border-0 pr-4">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <Building2 className="h-3.5 w-3.5" /> Active Company
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">Company Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.companyCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">Company Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.companyName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div> */}

        {/* Location Block */}
        {/* <div className="space-y-3">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <MapPin className="h-3.5 w-3.5" /> Zone Deployment
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">Location Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.locationCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 w-32 shrink-0">Location Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate">
                                            {currentContext.locationName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

        {/* Configuration Settings Form */}
        <Card className="border border-gray-200 shadow-sm bg-white p-8">
          <div className="w-full min-h-[100px] flex flex-col">
            <div className="flex-1 space-y-8">
              {/* Number Generation Field */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-bold text-gray-900" >
                  Number Generation
                </label>
                <div className="sm:col-span-2 flex items-center space-x-8">
                  <label className="flex items-center space-x-3 cursor-pointer text-sm font-semibold text-gray-900">
                    <input
                      type="radio"
                      name="numberGeneration"
                      value="Auto"
                      checked={numberGeneration === "Auto"}
                      onChange={(e) => setNumberGeneration(e.target.value)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
                    />
                    <span>Auto</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer text-sm font-semibold text-gray-900">
                    <input
                      type="radio"
                      name="numberGeneration"
                      value="Manual"
                      checked={numberGeneration === "Manual"}
                      onChange={(e) => setNumberGeneration(e.target.value)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
                    />
                    <span>Manual</span>
                  </label>
                </div>
              </div>

              {/* Member Expiring Field */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-bold text-gray-900">
                  Member Expiring Soon
                </label>
                <div className="sm:col-span-2 flex items-center space-x-8">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          value={expiringDays}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setExpiringDays(value);
                          }}
                          placeholder="Enter how many days"
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter how many days before expiration</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/*Code Added by Ramya on 25-07-2026*/}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className={`text-sm font-bold text-gray-900 ${!currency && error ? "text-red-500" : ""}`}>
                  Currency*
                </label>

                <div className="sm:col-span-2">
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Currency</option>
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                  </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the Currency</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </div>
              </div>

              {/*Code Ended by Ramya on 25-07-2026*/}

              {/* Action Footer Controls */}
              <div className="mt-auto pt-6 flex justify-end items-center gap-3 border-t border-gray-100">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/AdminDashboard")}
                        className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-purple-700 rounded-lg font-semibold"
                      >
                        Cancel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel changes and return to Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm rounded-lg"
                      >
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save the current settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SettingScreen;
