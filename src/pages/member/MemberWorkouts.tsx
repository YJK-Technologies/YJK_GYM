
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Target, Plus, ArrowLeft } from 'lucide-react';
import { dbService } from '@/services/database';
import { useToast } from '@/hooks/use-toast';

const MemberWorkouts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock member ID - in a real app, this would come from authentication
  const memberId = 'member-123';

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
    try {
      setLoading(true);
      const [workoutsData, programsData] = await Promise.all([
        dbService.getMemberWorkouts(memberId),
        dbService.getWorkoutPrograms()
      ]);
      
      setWorkouts(workoutsData.rows || []);
      setPrograms(programsData.rows || []);
    } catch (error) {
      console.error('Failed to load workout data:', error);
      toast({
        title: "Error",
        description: "Failed to load workout data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = async (programId: string) => {
    try {
      // Mock workout log - in a real app, this would be more detailed
      const exercises = [
        { name: 'Push-ups', sets: 3, reps: 10 },
        { name: 'Squats', sets: 3, reps: 15 }
      ];
      
      await dbService.addWorkoutLog(memberId, programId, exercises);
      
      toast({
        title: "Workout Started",
        description: "Your workout has been logged successfully!",
      });
      
      loadWorkoutData();
    } catch (error) {
      console.error('Failed to start workout:', error);
      toast({
        title: "Error",
        description: "Failed to start workout. Please try again.",
        variant: "destructive"
      });
    }
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
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartWorkout(program.id)}
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
                      <h3 className="font-medium">{workout.program_name}</h3>
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
