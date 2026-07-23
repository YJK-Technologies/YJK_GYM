
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Target, Plus, ArrowLeft } from 'lucide-react';
import { dbService } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from "../ApiConfig";
import { useCompany } from "../CompanyContext";

interface Program {
  programid: string;
  programname: string;
  Description: string;
}

const MemberWorkouts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyCode, locationCode, userCode } = useCompany();

  // Mock member ID - in a real app, this would come from authentication
  // Mock member ID
const memberId = userCode;

// Sample Workout Programs
// const samplePrograms = [
//   {
//     id: "1",
//     name: "Beginner Full Body",
//     description: "A complete full body workout for beginners."
//   },
//   {
//     id: "2",
//     name: "Upper Body Strength",
//     description: "Focus on chest, shoulders, back, and arms."
//   },
//   {
//     id: "3",
//     name: "Leg Day",
//     description: "Build lower body strength with compound exercises."
//   },
//   {
//     id: "4",
//     name: "Fat Loss HIIT",
//     description: "High-intensity interval training for burning calories."
//   },
//   {
//     id: "5",
//     name: "Core & Abs",
//     description: "Strengthen your core muscles and improve stability."
//   },
//   {
//     id: "6",
//     name: "Push Pull Legs",
//     description: "Advanced PPL split workout program."
//   }
// ];

// Sample Workout History
const sampleWorkouts = [
  {
    id: "101",
    programname: "Beginner Full Body",
    program_description: "A complete full body workout for beginners.",
    completed_at: "2026-07-20T09:30:00"
  },
  {
    id: "102",
    programname: "Upper Body Strength",
    program_description: "Focus on chest, shoulders, back, and arms.",
    completed_at: "2026-07-18T18:00:00"
  },
  {
    id: "103",
    programname: "Leg Day",
    program_description: "Build lower body strength with compound exercises.",
    completed_at: "2026-07-15T07:45:00"
  },
  {
    id: "104",
    programname: "Core & Abs",
    program_description: "Strengthen your core muscles and improve stability.",
    completed_at: "2026-07-13T17:20:00"
  }
];

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
  try {
    setLoading(true);

    const response = await fetch(`${BASE_URL}/getMemberProgarmDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MemberID: memberId,
        Company_code: companyCode,
        Location_code: locationCode,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setPrograms(data);
    } else {
      toast({
        title: "No Programs",
        description: "No workout programs found.",
        variant: "destructive",
      });
    }

    // Keep history hardcoded for now
    setWorkouts(sampleWorkouts);
  } catch (err) {
    console.error(err);

    toast({
      title: "Error",
      description: "Unable to load workout programs.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

const handleStartWorkout = (programid: string) => {
  const selectedProgram = programs.find(
  (p) => p.programid === programid
);

  if (!selectedProgram) return;

  const newWorkout = {
    id: Date.now().toString(),
    programname: selectedProgram.programname,
    program_description: selectedProgram.Description,
    completed_at: new Date().toISOString(),
  };

  setWorkouts((prev) => [newWorkout, ...prev]);

  toast({
    title: "Workout Started",
    description: `${selectedProgram.name} has been added to your workout history.`,
  });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/MemberDashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">My Workouts</h1>
            </div>
            <Badge variant="secondary">Member</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Programs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Available Programs
            </CardTitle>
            <CardDescription>Choose a program to start your workout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => (
                <Card key={program.programid} className="hover:shadow-md transition-shadow flex flex-col h-52">
                  <CardContent className="p-4 flex flex-col h-full min-h-0">
                    {/* Header section */}
                    <div className="shrink-0">
                      <h3 className="font-semibold text-lg line-clamp-1">{program.programname}</h3>
                      <p className="text-gray-500 text-xs mb-2">Program ID: {program.programid}</p>
                    </div>
                    
                    {/* Scrollable Description Container */}
                    <div className="flex-1 overflow-y-auto pr-1 mb-3 text-gray-600 text-sm custom-scrollbar min-h-0">
                      <p>{program.Description}</p>
                    </div>
              
                    {/* Always pinned to bottom */}
                    <Button 
                      className="w-full mt-auto shrink-0"
                      onClick={() => handleStartWorkout(program.programid)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Workout History
            </CardTitle>
            <CardDescription>Your recent workout sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No workouts recorded yet</p>
                <p className="text-sm text-gray-500">Start your first workout to see it here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{workout.programname}</h3>
                      <p className="text-sm text-gray-600">{workout.program_description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(workout.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberWorkouts;
