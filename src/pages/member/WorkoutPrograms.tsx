import React, { useEffect, useState } from "react";
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
  Dumbbell,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Flame,
} from "lucide-react";
import { useCompany } from "../CompanyContext";
import { BASE_URL } from "../ApiConfig";
import Loading from "@/components/Loading";

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  difficultyLevel: string;
  goals: string[];
  durationPerSession: string;
  sessionsPerWeek: number;
  facultyName: string;
  workingHours: string;
  isActive: boolean;
}

interface WorkoutPackage {
  id: string;
  name: string;
  packageType: "Monthly" | "Quarterly" | "Half-Yearly";
  durationDays: number;
  price: number;
  programId: string;
  programName: string;
  features: string[];
  discountPercentage: number;
  isActive: boolean;
  facultyName: string;
  workingHours: string;
}

const WorkoutPrograms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const { companyCode, locationCode, userCode } = useCompany();
  // For loading
  const [loading, setLoading] = useState(false);
  const memberId = userCode;

  // Needed
  const [programs, setPrograms] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);

  const filteredPrograms = programs.filter((p: any) => {
    const matchesSearch =
      p.ProgramName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

    const matchesCategory =
      categoryFilter === "all" || p.Category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getPackagesForProgram = (programId: string) => {
    return programs.filter(
      (p: any) => p.ProgramID === programId && p.is_active === "Active",
    );
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPackageTypeStyles = (type: string) => {
    switch (type) {
      case "Monthly":
        return { bg: "bg-blue-50 border-blue-200", badge: "bg-blue-500" };
      case "Quarterly":
        return { bg: "bg-green-50 border-green-200", badge: "bg-green-500" };
      case "Half-Yearly":
        return { bg: "bg-purple-50 border-purple-200", badge: "bg-purple-500" };
      default:
        return { bg: "bg-gray-50", badge: "bg-gray-500" };
    }
  };

  useEffect(() => {
    loadMemberPrograms();
  }, []);

  const loadMemberPrograms = async (category = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/memberProgramSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Category: category,
          MemberID: memberId,
          Company_code: companyCode,
          Location_code: locationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const formattedPrograms = data.map((program: any) => ({
          ...program,
          Exercises: program.Exercises ? JSON.parse(program.Exercises) : [],
          Faculty: program.Faculty ? program.Faculty.split(",") : [],
        }));

        setPrograms(formattedPrograms);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error(err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loading />}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/MemberDashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Workout Programs
              </h1>
            </div>
            <Badge>Member</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);

                  loadMemberPrograms(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredPrograms.map((program: any) => {
            const isActive = program.is_active === "Active";

            const statusBadgeColor = isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-600 border-gray-200";

            return (
              <Card
                key={program.ProgramID}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedProgram === program.ProgramID ? "ring-2 ring-blue-500" : ""}`}
                onClick={() =>
                  setSelectedProgram(
                    selectedProgram === program.ProgramID
                      ? null
                      : program.ProgramID,
                  )
                }
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-blue-600" />
                        {program.ProgramName}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {program.Description}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getDifficultyColor(program.Difficulty_level)}
                    >
                      {program.Difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 h-[680px] flex flex-col justify-between">
                  {/* Scrollable Container with Custom Scrollbar */}
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5 min-h-0">
                    {/* ================= HEADER ================= */}
                    <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                          {program.ProgramName}
                        </h3>
                        <p className="text-xs font-mono text-gray-500 flex items-center gap-1">
                          <span className="font-semibold text-slate-700">
                            Program ID:
                          </span>{" "}
                          {program.ProgramID || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* ================= GOALS & STATUS ================= */}
                    <div className="flex items-center justify-between bg-violet-50/40 px-4 py-2.5 rounded-lg border border-violet-50">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-violet-600" />
                        <span className="text-xs text-gray-500 font-medium">
                          Goal:
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {program.Goals}
                        </span>
                      </div>

                      <Badge
                        variant="outline"
                        className={`font-medium text-xs ${statusBadgeColor}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></span>
                        {program.is_active || "Close"}
                      </Badge>
                    </div>

                    {/* ================= PROGRAM SPECS ================= */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                      <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                          Category
                        </p>
                        <p
                          className="text-xs font-bold text-slate-800 truncate"
                          title={program.Category}
                        >
                          {program.Category}
                        </p>
                      </div>

                      <div className="space-y-0.5 border-r border-gray-200 last:border-none px-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                          <Dumbbell className="w-3 h-3 text-slate-400" />{" "}
                          Difficulty
                        </p>
                        <p className="text-xs font-bold text-violet-600">
                          {program.Difficulty_level}
                        </p>
                      </div>

                      <div className="space-y-0.5 px-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />{" "}
                          Session / Wk
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          {program.Sessions_per_week} Sessions
                        </p>
                      </div>
                    </div>

                    {/* ================= WORKING HOURS ================= */}
                    <div className="space-y-1 px-2">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Working
                        Hours
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                        {program.Working_hours ? (
                          (typeof program.Working_hours === "string"
                            ? program.Working_hours.split(",")
                            : Array.isArray(program.Working_hours)
                              ? program.Working_hours
                              : []
                          ).map(
                            (timeSlot: string, idx: number) =>
                              timeSlot.trim() && (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0 text-[10px] font-medium rounded shadow-sm"
                                >
                                  {timeSlot.trim()}
                                </Badge>
                              ),
                          )
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            No Slots
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ================= FACULTY DETAILS ================= */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-slate-500" />{" "}
                        Faculty Details
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {program.Faculty && program.Faculty.length > 0 ? (
                          program.Faculty.map(
                            (faculty: string, idx: number) => {
                              const trainer = trainers.find(
                                (item: any) => item.TrainerID === faculty,
                              );

                              return (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-xs rounded-md"
                                >
                                  {trainer
                                    ? `${trainer.TrainerID} - ${trainer.FullName}`
                                    : faculty}
                                </Badge>
                              );
                            },
                          )
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No faculty assigned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ================= EXERCISES DETAILS ================= */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center border-b border-slate-100 pb-1.5">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />{" "}
                        Exercises Details
                      </p>

                      <div className="grid grid-cols-12 gap-2 px-3 py-1 bg-slate-100 rounded text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-3 text-center">
                          Count / Sets
                        </div>
                        <div className="col-span-3 text-center">Reps</div>
                      </div>

                      <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                        {program.Exercises &&
                          (program.Exercises || []).map(
                            (exercise: any, idx: number) => (
                              <div
                                key={idx}
                                className="grid grid-cols-12 gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm items-center hover:bg-slate-50 transition-colors"
                              >
                                <div className="col-span-6 text-xs font-medium text-slate-700 truncate">
                                  {exercise.Exercises_Name}
                                </div>
                                <div className="col-span-3 text-center text-xs text-slate-600 bg-slate-50 py-0.5 rounded border border-slate-100">
                                  <b className="text-slate-900">
                                    {exercise.Exercises_Count}
                                  </b>
                                </div>
                                <div className="col-span-3 text-center text-xs text-slate-600 bg-slate-50 py-0.5 rounded border border-slate-100">
                                  <b className="text-slate-900">
                                    {exercise.Exercises_Repetitions}
                                  </b>
                                </div>
                              </div>
                            ),
                          )}
                      </div>
                    </div>

                    {/* ================= DESCRIPTION ================= */}
                    <div className="pt-3 border-t border-gray-100 space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Description
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100/50">
                        {program.Description ||
                          "No custom description available for this workout program."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Package Comparison for Selected Program */}
        {selectedProgram && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Available Packages for{" "}
                {
                  filteredPrograms.find(
                    (p: any) => p.ProgramID === selectedProgram,
                  )?.ProgramName
                }
              </CardTitle>
              <CardDescription>
                Choose the plan that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getPackagesForProgram(selectedProgram).map((pkg) => {
                  const styles = getPackageTypeStyles(pkg.packageType);
                  const isPopular = pkg.packageType === "Quarterly";
                  const isBestValue = pkg.packageType === "Half-Yearly";

                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-lg border-2 p-6 ${styles.bg} ${isPopular ? "ring-2 ring-green-500" : ""}`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-500">Most Popular</Badge>
                        </div>
                      )}
                      {isBestValue && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-500">Best Value</Badge>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <Badge className={styles.badge}>
                          {pkg.durationDays} Days
                        </Badge>
                        <h3 className="text-xl font-bold mt-3">
                          {pkg.packageType}
                        </h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">
                            {/*BHD*/} {pkg.price}
                          </span>
                          {pkg.discountPercentage > 0 && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-green-600"
                            >
                              Save {pkg.discountPercentage}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <p>
                          <strong>Trainer:</strong> {pkg.facultyName}
                        </p>
                        <p>
                          <strong>Hours:</strong> {pkg.workingHours}
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Programs Message */}
        {filteredPrograms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Programs Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WorkoutPrograms;
