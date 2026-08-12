import React, { useState, useEffect, useRef } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Search,
    Download,
    Banknote,
    CreditCard,
    Smartphone,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { BASE_URL } from "../ApiConfig";

import { useCompany } from "../CompanyContext";

import AgGridTable from "@/components/ui/ag-grid-table";

import Loading from "@/components/Loading";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";


// ======================================================
// PAYMENT INTERFACE
// ======================================================

interface PaymentHistory {
    payment_id: string | number;

    MemberID: string;

    Full_name: string;

    MemberShipType_id: string;

    package_ID: string;

    package_Name: string;

    final_amount: number;

    discount_amount: number;

    payment_method: string;

    Coupon_Code: string;

    status: string;

    payment_date: string;

    company_name: string;
}


// ======================================================
// COMPONENT
// ======================================================

const MemberPaymentHistory = () => {

    // ----------------------------------------------------
    // Navigation
    // ----------------------------------------------------

    const navigate = useNavigate();


    // ----------------------------------------------------
    // Toast
    // ----------------------------------------------------

    const { toast } = useToast();


    // ----------------------------------------------------
    // AG Grid reference
    // ----------------------------------------------------

    const gridApiRef = useRef<any>(null);


    // ----------------------------------------------------
    // Company Context
    // ----------------------------------------------------

    const {
        companyCode,
        locationCode,
        userCode,
    } = useCompany();


    // ----------------------------------------------------
    // Loading
    // ----------------------------------------------------

    const [loadingData, setLoadingData] =
        useState(false);


    // ----------------------------------------------------
    // Payment History Data
    // ----------------------------------------------------

    const [paymentHistoryData, setPaymentHistoryData] =
        useState<PaymentHistory[]>([]);


    // ----------------------------------------------------
    // Search
    // ----------------------------------------------------

    const [searchTerm, setSearchTerm] =
        useState("");


    // ----------------------------------------------------
    // Status Filter
    // ----------------------------------------------------

    const [statusFilter, setStatusFilter] =
        useState<string>("all");


    // ----------------------------------------------------
    // Method Filter
    // ----------------------------------------------------

    const [methodFilter, setMethodFilter] =
        useState<string>("all");


    // ====================================================
    // IMPORTANT
    // userCode = MemberID
    // ====================================================

    const memberId = userCode;


    // ====================================================
    // DEBUG - CHECK MEMBER DETAILS
    // ====================================================

    console.log("========== MEMBER PAYMENT HISTORY ==========");

    console.log("Company Code:", companyCode);

    console.log("Location Code:", locationCode);

    console.log("User Code:", userCode);

    console.log("Member ID:", memberId);

    // ====================================================
    // FETCH MEMBER PAYMENT HISTORY
    // ====================================================

    const fetchMemberPaymentHistory = async () => {

        try {

            setLoadingData(true);

            // ------------------------------------------------
            // DEBUG - CHECK REQUEST
            // ------------------------------------------------

            console.log("========== MPH REQUEST ==========");

            console.log({
                Mode: "MPH",
                Company_code: companyCode,
                Location_code: locationCode,
                MemberID: memberId,
            });


            // ------------------------------------------------
            // API CALL
            // ------------------------------------------------

            const response = await fetch(
                `${BASE_URL}/getMemberPaymentHistory`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({

                        // IMPORTANT
                        // New Mode
                        Mode: "MPH",

                        // Company
                        Company_code: companyCode,

                        // Location
                        Location_code: locationCode,

                        // Logged-in Member
                        // userCode -> memberId
                        MemberID: memberId,

                    }),
                }
            );


            // ------------------------------------------------
            // CHECK RESPONSE
            // ------------------------------------------------

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch member payment history"
                );

            }


            // ------------------------------------------------
            // GET RESPONSE DATA
            // ------------------------------------------------

            const data = await response.json();


            console.log(
                "========== MPH RESPONSE =========="
            );

            console.log(data);


            // ------------------------------------------------
            // SET PAYMENT DATA
            // ------------------------------------------------

            if (Array.isArray(data)) {

                setPaymentHistoryData(data);

            }

            else if (
                data?.data &&
                Array.isArray(data.data)
            ) {

                setPaymentHistoryData(
                    data.data
                );

            }

            else {

                setPaymentHistoryData([]);

            }


            // ------------------------------------------------
            // CHECK NO DATA
            // ------------------------------------------------

            const result =
                Array.isArray(data)
                    ? data
                    : data?.data;


            if (
                !result ||
                result.length === 0
            ) {

                toast({
                    title: "No Payment History",
                    description:
                        "No payment history found for this member.",
                });

            }

        }

        catch (error) {

            console.error(
                "MPH API Error:",
                error
            );


            setPaymentHistoryData([]);


            toast({
                title: "Error",
                description:
                    "Unable to load payment history.",
                variant: "destructive",
            });

        }

        finally {

            setLoadingData(false);

        }

    };


    // ====================================================
    // CALL API WHEN PAGE LOADS
    // ====================================================

    useEffect(() => {

        if (
            companyCode &&
            locationCode &&
            userCode
        ) {

            fetchMemberPaymentHistory();

        }

    }, [
        companyCode,
        locationCode,
        userCode,
    ]);


    // ====================================================
    // FILTER PAYMENT HISTORY
    // ====================================================

    const filteredPaymentHistory =
        paymentHistoryData.filter(
            (row: PaymentHistory) => {

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();


                // ------------------------------------------------
                // SEARCH FILTER
                // ------------------------------------------------

                const matchesSearch =

                    String(
                        row.payment_id ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        row.package_Name ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        row.Coupon_Code ?? ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        row.payment_method ?? ""
                    )
                        .toLowerCase()
                        .includes(search);


                // ------------------------------------------------
                // STATUS FILTER
                // ------------------------------------------------

                const matchesStatus =
                    statusFilter === "all" ||
                    row.status === statusFilter;


                // ------------------------------------------------
                // PAYMENT METHOD FILTER
                // ------------------------------------------------

                const matchesMethod =
                    methodFilter === "all" ||
                    row.payment_method === methodFilter;


                // ------------------------------------------------
                // FINAL RESULT
                // ------------------------------------------------

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesMethod
                );

            }
        );


    // ====================================================
    // AG GRID READY
    // ====================================================

    const onPaymentGridReady = (
        params: any
    ) => {

        gridApiRef.current =
            params.api;

    };


    // ====================================================
    // PAYMENT METHOD BADGE
    // ====================================================

    const getPaymentMethodBadge = (
        method: string
    ) => {

        switch (method) {

            case "Cash":

                return (
                    <Badge className="bg-green-500 hover:bg-green-600">

                        <Banknote
                            className="h-3 w-3 mr-1"
                        />

                        Cash

                    </Badge>
                );


            case "Online":

                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600">

                        <CreditCard
                            className="h-3 w-3 mr-1"
                        />

                        Online

                    </Badge>
                );


            case "BenefitPay":

                return (
                    <Badge className="bg-orange-500 hover:bg-orange-600">

                        <Smartphone
                            className="h-3 w-3 mr-1"
                        />

                        BenefitPay

                    </Badge>
                );


            default:

                return (
                    <Badge variant="secondary">

                        {method || "-"}

                    </Badge>
                );

        }

    };


    // ====================================================
    // STATUS BADGE
    // ====================================================

    const getStatusBadge = (
        status: string
    ) => {

        switch (status) {

            case "Completed":

                return (
                    <Badge className="bg-green-500 hover:bg-green-600">

                        <CheckCircle
                            className="h-3 w-3 mr-1"
                        />

                        Completed

                    </Badge>
                );


            case "Pending":

                return (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">

                        <Clock
                            className="h-3 w-3 mr-1"
                        />

                        Pending

                    </Badge>
                );


            case "Failed":

                return (
                    <Badge className="bg-red-500 hover:bg-red-600">

                        <XCircle
                            className="h-3 w-3 mr-1"
                        />

                        Failed

                    </Badge>
                );


            default:

                return (
                    <Badge variant="secondary">

                        {status || "-"}

                    </Badge>
                );

        }

    };


    // ====================================================
    // PAYMENT HISTORY COLUMNS
    // ====================================================

    const paymentHistoryColumns = [

        // --------------------------------------------------
        // PAYMENT ID
        // --------------------------------------------------

        {
            headerName: "Payment ID",

            field: "payment_id",

            minWidth: 180,

            filter: true,

            sortable: true,
        },


        // --------------------------------------------------
        // PAYMENT DATE
        // --------------------------------------------------

        {
            headerName: "Payment Date",

            field: "payment_date",

            minWidth: 180,

            filter: true,

            sortable: true,

            valueFormatter: (
                params: any
            ) => {

                if (!params.value) {
                    return "";
                }

                const date =
                    new Date(params.value);

                return date.toLocaleDateString(
                    "en-GB"
                );

            },

        },


        // --------------------------------------------------
        // PACKAGE
        // --------------------------------------------------

        {
            headerName: "Package",

            field: "package_Name",

            minWidth: 300,

            filter: true,

            sortable: true,

            valueGetter: (
                params: any
            ) => {

                return `${params.data.package_ID} - ${params.data.package_Name}`;

            },

        },


        // --------------------------------------------------
        // AMOUNT
        // --------------------------------------------------

        {
            headerName: "Amount",

            field: "final_amount",

            minWidth: 150,

            filter: true,

            sortable: true,

            valueFormatter: (
                params: any
            ) => {

                return Number(
                    params.value || 0
                ).toFixed(3);

            },

            cellClass:
                "font-semibold text-green-500",

        },


        // --------------------------------------------------
        // DISCOUNT AMOUNT
        // --------------------------------------------------

        {
            headerName: "Discount Amount",

            field: "discount_amount",

            minWidth: 150,

            filter: true,

            sortable: true,

            valueFormatter: (
                params: any
            ) => {

                return Number(
                    params.value || 0
                ).toFixed(3);

            },

            cellClass:
                "font-semibold text-red-500",

        },


        // --------------------------------------------------
        // PAYMENT METHOD
        // --------------------------------------------------

        {
            headerName: "Method",

            field: "payment_method",

            minWidth: 180,

            filter: true,

            sortable: true,

            cellRenderer: (
                params: any
            ) => {

                return getPaymentMethodBadge(
                    params.value
                );

            },

        },


        // --------------------------------------------------
        // COUPON
        // --------------------------------------------------

        {
            headerName: "Coupon",

            field: "Coupon_Code",

            minWidth: 180,

            filter: true,

            sortable: true,

        },


        // --------------------------------------------------
        // STATUS
        // --------------------------------------------------

        {
            headerName: "Status",

            field: "status",

            minWidth: 150,

            filter: true,

            sortable: true,

            cellRenderer: (
                params: any
            ) => {

                return getStatusBadge(
                    params.value
                );

            },

        },

    ];

    // ====================================================
    // EXPORT EXCEL
    // ====================================================

    const handleExportExcel = () => {

        if (!gridApiRef.current) {
            return;
        }


        // ------------------------------------------------
        // Get filtered and sorted rows
        // ------------------------------------------------

        const rows: any[] = [];


        gridApiRef.current
            .forEachNodeAfterFilterAndSort(
                (node: any) => {

                    rows.push({

                        "Payment ID":
                            node.data.payment_id,

                        "Payment Date":
                            node.data.payment_date
                                ? new Date(
                                    node.data.payment_date
                                ).toLocaleDateString(
                                    "en-GB"
                                )
                                : "",

                        "Member ID":
                            node.data.MemberID,

                        "Package":
                            `${node.data.package_ID} - ${node.data.package_Name}`,

                        "Amount":
                            node.data.final_amount,

                        "Discount Amount":
                            node.data.discount_amount,

                        "Method":
                            node.data.payment_method,

                        "Coupon":
                            node.data.Coupon_Code,

                        "Status":
                            node.data.status,

                    });

                }
            );


        // ------------------------------------------------
        // Create worksheet
        // ------------------------------------------------

        const worksheet =
            XLSX.utils.json_to_sheet(
                rows
            );


        // ------------------------------------------------
        // Create workbook
        // ------------------------------------------------

        const workbook =
            XLSX.utils.book_new();


        // ------------------------------------------------
        // Add worksheet
        // ------------------------------------------------

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Payment History"
        );


        // ------------------------------------------------
        // Download Excel
        // ------------------------------------------------

        XLSX.writeFile(
            workbook,
            "Member_Payment_History.xlsx"
        );

    };


    // ====================================================
    // EXPORT PDF
    // ====================================================

    const handleExportPDF = () => {

        if (!gridApiRef.current) {
            return;
        }


        // ------------------------------------------------
        // Create PDF
        // ------------------------------------------------

        const doc =
            new jsPDF(
                "landscape"
            );


        // ------------------------------------------------
        // Current Date
        // ------------------------------------------------

        const currentDate =
            new Date()
                .toLocaleDateString(
                    "en-GB"
                );


        // ------------------------------------------------
        // PDF Title
        // ------------------------------------------------

        doc.setFontSize(16);

        doc.text(
            "Member Payment History",
            14,
            15
        );


        // ------------------------------------------------
        // Member ID
        // ------------------------------------------------

        doc.setFontSize(10);

        doc.text(
            `Member ID: ${memberId || "-"}`,
            14,
            22
        );


        // ------------------------------------------------
        // Date
        // ------------------------------------------------

        doc.text(
            `Date: ${currentDate}`,
            14,
            28
        );


        // ------------------------------------------------
        // Get Grid Rows
        // ------------------------------------------------

        const body: any[] = [];


        gridApiRef.current
            .forEachNodeAfterFilterAndSort(
                (node: any) => {

                    body.push([

                        node.data.payment_id,

                        node.data.payment_date
                            ? new Date(
                                node.data.payment_date
                            ).toLocaleDateString(
                                "en-GB"
                            )
                            : "",

                        node.data.MemberID,

                        `${node.data.package_ID} - ${node.data.package_Name}`,

                        Number(
                            node.data.final_amount || 0
                        ).toFixed(3),

                        Number(
                            node.data.discount_amount || 0
                        ).toFixed(3),

                        node.data.payment_method,

                        node.data.Coupon_Code || "-",

                        node.data.status,

                    ]);

                }
            );


        // ------------------------------------------------
        // PDF TABLE
        // ------------------------------------------------

        autoTable(doc, {

            startY: 34,

            head: [[
                "Payment ID",
                "Payment Date",
                "Member ID",
                "Package",
                "Amount",
                "Discount",
                "Method",
                "Coupon",
                "Status",
            ]],

            body: body,

            styles: {
                fontSize: 8,
                cellPadding: 3,
            },

        });


        // ------------------------------------------------
        // Save PDF
        // ------------------------------------------------

        doc.save(
            "Member_Payment_History.pdf"
        );

    };


    // ====================================================
    // RESET FILTERS
    // ====================================================

    const handleReset = () => {

        setSearchTerm("");

        setStatusFilter("all");

        setMethodFilter("all");


        // ------------------------------------------------
        // Clear AG Grid Filters
        // ------------------------------------------------

        if (gridApiRef.current) {

            gridApiRef.current.setFilterModel(
                null
            );

        }

    };


    // ====================================================
    // RETURN
    // ====================================================

    return (

        <div className="min-h-screen bg-gray-50">


            {/* ==================================================
        LOADING
    ================================================== */}

            {loadingData && <Loading />}


            {/* ==================================================
        HEADER
    ================================================== */}

            <header className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center py-4">


                        {/* ------------------------------------------------
              LEFT SIDE
          ------------------------------------------------ */}

                        <div className="flex items-center space-x-4">


                            {/* Back Button */}

                            <Button
                                variant="ghost"
                                onClick={() =>
                                    navigate("/MemberDashboard")
                                }
                            >

                                <ArrowLeft
                                    className="h-4 w-4 mr-2"
                                />

                                Back to Dashboard

                            </Button>


                            {/* Page Title */}

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">

                                    Payment History

                                </h1>

                                <p className="text-sm text-gray-500">

                                    View your payment records

                                </p>

                            </div>

                        </div>


                        {/* ------------------------------------------------
              MEMBER BADGE
          ------------------------------------------------ */}

                        <Badge variant="secondary">

                            Member

                        </Badge>

                    </div>

                </div>

            </header>


            {/* ==================================================
        MAIN CONTENT
    ================================================== */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                {/* ==================================================
          PAYMENT HISTORY CARD
      ================================================== */}

                <Card className="mb-8">


                    {/* ==================================================
            CARD HEADER
        ================================================== */}

                    <CardHeader>

                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">


                            {/* ------------------------------------------------
                TITLE
            ------------------------------------------------ */}

                            <div>

                                <CardTitle>

                                    Payment History

                                </CardTitle>

                                <CardDescription>

                                    Your payment history

                                </CardDescription>

                            </div>


                            {/* ------------------------------------------------
                EXPORT BUTTONS
            ------------------------------------------------ */}

                            <div className="flex space-x-2">


                                {/* Excel */}

                                <Button
                                    variant="outline"
                                    onClick={
                                        handleExportExcel
                                    }
                                >

                                    <Download
                                        className="h-4 w-4 mr-2"
                                    />

                                    Export Excel

                                </Button>


                                {/* PDF */}

                                <Button
                                    variant="outline"
                                    onClick={
                                        handleExportPDF
                                    }
                                >

                                    <Download
                                        className="h-4 w-4 mr-2"
                                    />

                                    Export PDF

                                </Button>

                            </div>

                        </div>

                    </CardHeader>


                    {/* ==================================================
            CARD CONTENT
        ================================================== */}

                    <CardContent className="p-6">


                        {/* ==================================================
              FILTER AREA
          ================================================== */}

                        <div className="flex flex-col md:flex-row gap-4">


                            {/* ==================================================
                SEARCH BOX
            ================================================== */}

                            <div className="relative flex-1">

                                <Search
                                    className="
                  absolute
                  left-3
                  top-3
                  h-4
                  w-4
                  text-gray-400
                "
                                />


                                <Input

                                    placeholder="Search by Payment ID, Package or Coupon"

                                    value={searchTerm}

                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }

                                    className="pl-10"

                                />

                            </div>


                            {/* ==================================================
                STATUS DROPDOWN
            ================================================== */}

                            <Select
                                value={statusFilter}
                                onValueChange={
                                    setStatusFilter
                                }
                            >

                                <SelectTrigger className="w-40">

                                    <SelectValue
                                        placeholder="Status"
                                    />

                                </SelectTrigger>


                                <SelectContent>

                                    <SelectItem value="all">

                                        All Status

                                    </SelectItem>

                                    <SelectItem value="Completed">

                                        Completed

                                    </SelectItem>

                                    <SelectItem value="Pending">

                                        Pending

                                    </SelectItem>

                                    <SelectItem value="Failed">

                                        Failed

                                    </SelectItem>

                                </SelectContent>

                            </Select>


                            {/* ==================================================
                PAYMENT METHOD DROPDOWN
            ================================================== */}

                            <Select
                                value={methodFilter}
                                onValueChange={
                                    setMethodFilter
                                }
                            >

                                <SelectTrigger className="w-40">

                                    <SelectValue
                                        placeholder="Method"
                                    />

                                </SelectTrigger>


                                <SelectContent>

                                    <SelectItem value="all">

                                        All Methods

                                    </SelectItem>

                                    <SelectItem value="Cash">

                                        Cash

                                    </SelectItem>

                                    <SelectItem value="Online">

                                        Online

                                    </SelectItem>

                                    <SelectItem value="BenefitPay">

                                        BenefitPay

                                    </SelectItem>

                                </SelectContent>

                            </Select>


                            {
            /* ==================================================
                RESET BUTTON
            ================================================== */}

                            <Button
                                variant="outline"
                                onClick={handleReset}
                            >

                                Reset

                            </Button>

                        </div>


                        {
            /* ==================================================
              AG GRID
          ================================================== */}

                        <div
                            className="
              ag-theme-alpine
              h-[550px]
              w-full
              mt-4
            "
                        >

                            <AgGridTable

                                rowData={
                                    filteredPaymentHistory
                                }

                                columnDefs={
                                    paymentHistoryColumns
                                }

                                pagination={true}

                                paginationPageSize={10}

                                onGridReady={
                                    onPaymentGridReady
                                }

                            />

                        </div>


                        {
            /* ==================================================
              BOTTOM INFORMATION
          ================================================== */}

                        <div
                            className="
              flex
              justify-between
              items-center
              mt-4
              text-sm
              text-gray-500
            "
                        >

                            {/* Total Records */}

                            <span>

                                Total Records:{" "}

                                <strong>

                                    {
                                        filteredPaymentHistory.length
                                    }

                                </strong>

                            </span>


                            {/* Member ID */}

                            <span>

                                Member ID:{" "}

                                <strong>

                                    {memberId || "-"}

                                </strong>

                            </span>

                        </div>


                    </CardContent>

                </Card>


            </main>

        </div>

    );


};



export default MemberPaymentHistory;