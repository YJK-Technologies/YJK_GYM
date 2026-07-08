import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from '../ApiConfig';
import { ArrowLeft, Building2, User, MapPin, ShieldCheck, Search } from 'lucide-react';

// Mock data based strictly on image_cfcd9e.png fields
// const currentContext = {
//   userCode: 'jk',
//   userName: 'JaiKrishnan',
//   companyCode: 'AKP001007',
//   companyName: 'YJK Technologies USA',
//   locationCode: 'North zoon',
//   locationName: 'North zoon'
// };

// const companiesData = [
//   { id: 1, code: 'AKP001007', name: 'YJK Technologies USA', locationCode: 'North zoon', locationName: 'North zoon' },
//   { id: 2, code: 'AKP001008', name: 'YJK Technologies Middle East', locationCode: 'East zoon', locationName: 'East zoon' },
//   { id: 3, code: 'AKP001009', name: 'YJK Technologies India', locationCode: 'South zoon', locationName: 'South zoon' },
// ];

const CompaniesList = () => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const user_code = sessionStorage.getItem("user_code");

    const { toast } = useToast();

    const [currentContext, setCurrentContext] = useState({
        userCode: "JK",
        userName: "JaiKrishnan",
        companyCode: "AKPON007",
        companyName: "YJK Technologies USA",
        locationCode: "North Zoon",
        locationName: "North Zoon",
    });

    const [companiesData, setCompaniesData] = useState<any[]>([]);

    useEffect(() => {
        fetchUserCompany();
    }, []);

    const fetchUserCompany = async () => {
        try {
            const response = await fetch(`${BASE_URL}/getusercompany`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_code,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                const companyList = data.map((item: any, index: number) => ({
                    id: index + 1,
                    code: item.company_no,
                    name: item.company_name,
                    locationCode: item.location_no,
                    locationName: item.location_name,
                    shortName: item.short_name,
                    userCode: item.user_code,
                    userName: item.user_name,
                }));

                setCompaniesData(companyList);

                const selected = companyList[0];

                setCurrentContext({
                    userCode: selected.userCode,
                    userName: selected.userName,
                    companyCode: selected.code,
                    companyName: selected.name,
                    locationCode: selected.locationCode,
                    locationName: selected.locationName,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Company data not found.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);

            toast({
                title: "Error",
                description: "Failed to fetch company data.",
                variant: "destructive",
            });
        }
    };

    const toggleRow = (id: number) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
            setSelectedRows([id]);

            const selected = companiesData.find((x) => x.id === id);

            if (selected) {
                setCurrentContext({
                    userCode: selected.userCode,
                    userName: selected.userName,
                    companyCode: selected.code,
                    companyName: selected.name,
                    locationCode: selected.locationCode,
                    locationName: selected.locationName,
                });
            }
        }
    };

    const handleSave = async () => {
        if (selectedRows.length === 0) {
            toast({
                title: "Warning",
                description: "Please select a company.",
                variant: "destructive",
            });
            return;
        }

        const selected = companiesData.find(
            (x) => x.id === selectedRows[0]
        );

        if (!selected) return;

        sessionStorage.setItem("selectedCompanyCode", selected.code);
        sessionStorage.setItem("selectedCompanyName", selected.name);
        sessionStorage.setItem("selectedLocationCode", selected.locationCode);
        sessionStorage.setItem("selectedLocationName", selected.locationName);
        sessionStorage.setItem("selectedShortName", selected.shortName);
        sessionStorage.setItem("selectedUserCode", selected.userCode);
        sessionStorage.setItem("selectedUserName", selected.userName);

        window.dispatchEvent(new Event("storageUpdate"));

        toast({
            title: "Success",
            description: "Company selected successfully.",
        });

        // Optional: Refresh permissions after company selection
        // await UserPermission();
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
                                onClick={() => navigate('/AdminDashboard')}
                                className="hover:bg-gray-100 rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-purple-600" />
                                List of Companies
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={handleSave}
                                // disabled={selectedRows.length === 0}
                                className={`px-6 py-2 font-semibold shadow-sm transition-all duration-200 rounded-lg text-white
                            ${selectedRows.length === 0
                                        ? 'bg-purple-700 cursor-not-allowed  shadow-none'
                                        : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98]'}`}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Context Parameters Banner (Label adjacent left-aligned layout) */}
                <Card className="border border-gray-200/80 shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* User Block */}
                            <div className="space-y-3 md:border-r border-gray-100 last:border-0 pr-4">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <User className="h-3.5 w-3.5" /> User Information
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">User Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.userCode}>
                                            {currentContext.userCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">User Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.userName}>
                                            {currentContext.userName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Company Block */}
                            <div className="space-y-3 md:border-r border-gray-100 last:border-0 pr-4">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <Building2 className="h-3.5 w-3.5" /> Active Company
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">Company Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.companyCode}>
                                            {currentContext.companyCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">Company Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.companyName}>
                                            {currentContext.companyName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Block */}
                            <div className="space-y-3">
                                <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider gap-1.5 mb-2">
                                    <MapPin className="h-3.5 w-3.5" /> Zone Deployment
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">Location Code:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.locationCode}>
                                            {currentContext.locationCode || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold text-gray-900 truncate max-w-[180px] text-left w-32 shrink-0">Location Name:</span>
                                        <span className="font-semibold text-purple-700 bg-purple-50/50 px-1.5 py-0.5 rounded truncate max-w-[180px] md:max-w-[200px] text-left" title={currentContext.locationName}>
                                            {currentContext.locationName || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Dynamic Data Table Segment */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                {/* Premium layout matching your app's core signature colors but utilizing the exact purple banner structure from image_cfcd9e.png */}
                                <tr className="bg-purple-600 text-white text-sm font-medium tracking-wide">
                                    <th className="p-4 w-16 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-white/40 text-purple-600 focus:ring-offset-0 focus:ring-purple-500 h-4 w-4 accent-purple-800"
                                            checked={selectedRows.length === companiesData.length}
                                            onChange={() => {
                                                if (selectedRows.length === companiesData.length) {
                                                    setSelectedRows([]);
                                                } else {
                                                    setSelectedRows(companiesData.map(c => c.id));
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="p-4 font-semibold w-20">Sno</th>
                                    <th className="p-4 font-semibold">Company Code</th>
                                    <th className="p-4 font-semibold">Company Name</th>
                                    <th className="p-4 font-semibold">Location Code</th>
                                    <th className="p-4 font-semibold">Location Name</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {companiesData.map((company, index) => {
                                    const isChecked = selectedRows.includes(company.id);
                                    return (
                                        <tr
                                            key={company.id}
                                            className={`hover:bg-purple-50/30 transition-colors text-sm ${isChecked ? 'bg-purple-50/20' : ''}`}
                                        >
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                    checked={isChecked}
                                                    onChange={() => toggleRow(company.id)}
                                                />
                                            </td>
                                            <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                                            <td className="p-4 font-mono text-xs font-semibold text-purple-700 bg-purple-50/40 rounded px-2 py-1 inline-block mt-3">
                                                {company.code}
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">{company.name}</td>
                                            <td className="p-4 text-gray-600">{company.locationCode}</td>
                                            <td className="p-4 text-gray-600">{company.locationName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default CompaniesList;