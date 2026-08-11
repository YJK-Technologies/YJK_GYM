import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Settings, Building2, Monitor, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "../ApiConfig";

const SettingsPage = () => {
  const navigate = useNavigate();
    const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);

  // States for Company and Screen
  const [companyDrop, setCompanyDrop] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyValue, setCompanyValue] = useState("");

  const [screenDrop, setScreenDrop] = useState([]);
  const [screen, setScreen] = useState(null);
  const [screenValue, setScreenValue] = useState("");

  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [errors, setErrors] = useState(false);

  // 1. Fetch Screen Dropdown (/getScreens)
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getScreens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });
        const data = await response.json();
        setScreenDrop(data);
      } catch (error) {
        console.error("Error fetching screen options:", error);
      }
    };
    fetchScreens();
  }, []);

  // 2. Fetch User Companies
  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const userCode = sessionStorage.getItem("selectedUserCode");

        const response = await fetch(`${BASE_URL}/getusercompany`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_code: userCode }),
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyDrop(data);
        } else {
          setCompanyDrop([]);
        }
      } catch (error) {
        console.error("Error fetching user company data:", error);
        setCompanyDrop([]);
      }
    };

    fetchUserCompanies();
  }, []);

  // 3. Fetch Default Screens (/getDefaultScreens)
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getDefaultScreens`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role_id: sessionStorage.getItem("role_id"),
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();
        setScreenDrop(data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  // Filter options mapping
  const filteredOptionCompany = Array.isArray(companyDrop)
    ? companyDrop.map((option) => ({
        value: option?.keyfiels,
        label: `${option?.company_no} - ${option?.company_name} - ${option?.location_no} - ${option?.location_name}`,
        company_no: option?.company_no,
        company_name: option?.company_name,
        location_no: option?.location_no,
        location_name: option?.location_name,
        keyfiels: option?.keyfiels,
      }))
    : [];

  const filteredOptionScreen = Array.isArray(screenDrop)
    ? screenDrop.map((option) => ({
        value: option.screen_type,
        label: option.screen_type,
      }))
    : [];

  // Handlers
  const handleChangeCompany = (selected) => {
    setCompany(selected);
    setCompanyValue(selected ? selected.value : "");
  };

  const handleChangeScreen = (selected) => {
    setScreen(selected);
    setScreenValue(selected ? selected.value : "");
  };

  // 4. Fetch User Settings
  useEffect(() => {
    if (
      settingsLoaded ||
      filteredOptionCompany.length === 0 ||
      filteredOptionScreen.length === 0
    ) {
      return;
    }

    const fetchUserSettings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getUserSettings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            User_Code: sessionStorage.getItem("selectedUserCode"),
          }),
        });

        const data = await response.json();

        if (data.length > 0) {
          const settings = data[0];

          const selectedComp = filteredOptionCompany.find(
            (x) => x.value === settings.DefaultCompanyId
          );

          if (selectedComp) {
            setCompany(selectedComp);
            setCompanyValue(selectedComp.value);
          }

          const selectedScr = filteredOptionScreen.find(
            (x) => x.value === settings.DefaultScreenId
          );

          if (selectedScr) {
            setScreen(selectedScr);
            setScreenValue(selectedScr.value);
          }
        }

        setSettingsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserSettings();
  }, [filteredOptionCompany, filteredOptionScreen, settingsLoaded]);

  // Custom react-select styles matching Tailwind/Shadcn theme
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#9333ea" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #9333ea" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#9333ea" : "#9ca3af",
      },
      borderRadius: "0.375rem",
      paddingTop: "2px",
      paddingBottom: "2px",
      fontSize: "0.875rem",
    }),
  };

  const handleSave = async () => {
    if (!companyValue || !screenValue) {
      setErrors(true);
      toast({
        title: "Validation",
        description: "Please select all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrors(false);

    try {
      const payload = {
        User_Code: sessionStorage.getItem("selectedUserCode"),
        Status: "Active",
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem("selectedLocationCode"),
        DefaultCompanyId: companyValue,
        DefaultScreenId: screenValue,
        role_id: sessionStorage.getItem("role_id"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const response = await fetch(`${BASE_URL}/userSettingsInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "User Settings saved successfully!",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save settings.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error saving User Settings:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-purple-600" />
                  User Settings
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your preferences and dashboard configurations
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="border border-gray-200 shadow-sm bg-white p-8">
          <div className="w-full min-h-[100px] flex flex-col">
            <div className="flex-1 space-y-8">
              
              {/* Select Default Company */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  Select Default Company
                </label>
                <div className="sm:col-span-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={company}
                            onChange={handleChangeCompany}
                            options={filteredOptionCompany}
                            placeholder="Select Company"
                            isClearable
                            styles={customSelectStyles}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select your default active company</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Select Default Screen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-purple-600" />
                  Select Default Screen
                </label>
                <div className="sm:col-span-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={screen}
                            onChange={handleChangeScreen}
                            options={filteredOptionScreen}
                            placeholder="Select Screen"
                            isClearable
                            styles={customSelectStyles}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select your default landing screen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Action Footer Controls */}
              <div className="mt-auto pt-6 flex justify-end items-center gap-3 border-t border-gray-100">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
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
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm rounded-lg flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save user settings</p>
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

export default SettingsPage;