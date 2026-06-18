import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCheck, LogIn, LogOut, Clock, Activity, Users } from 'lucide-react';
import { formatDistanceToNow, differenceInMinutes, format } from 'date-fns';

interface AttendanceMember {
  cpr: string;
  full_name: string;
  check_in_time: Date;
  check_out_time?: Date;
}

interface GymStats {
  currentlyIn: number;
  todayVisits: number;
  avgDuration: string;
}

// Sample data - will be replaced with real DB queries
const sampleMembersInGym: AttendanceMember[] = [
  { cpr: '810234567', full_name: 'Fatima Al-Mahmoud', check_in_time: new Date(Date.now() - 135 * 60000) },
  { cpr: '820345678', full_name: 'Mohammed Al-Khalifa', check_in_time: new Date(Date.now() - 90 * 60000) },
  { cpr: '840567890', full_name: 'Yusuf Al-Ahmed', check_in_time: new Date(Date.now() - 45 * 60000) },
  { cpr: '850678901', full_name: 'Noora Al-Bahrani', check_in_time: new Date(Date.now() - 20 * 60000) },
];

const sampleRecentArrivals: AttendanceMember[] = [
  { cpr: '850678901', full_name: 'Noora Al-Bahrani', check_in_time: new Date(Date.now() - 20 * 60000) },
  { cpr: '840567890', full_name: 'Yusuf Al-Ahmed', check_in_time: new Date(Date.now() - 45 * 60000) },
  { cpr: '860789012', full_name: 'Ali Hassan', check_in_time: new Date(Date.now() - 60 * 60000) },
  { cpr: '870890123', full_name: 'Mariam Al-Doseri', check_in_time: new Date(Date.now() - 75 * 60000) },
  { cpr: '880901234', full_name: 'Khalid Ibrahim', check_in_time: new Date(Date.now() - 90 * 60000) },
];

const sampleRecentDepartures: AttendanceMember[] = [
  { cpr: '890012345', full_name: 'Sara Al-Qassim', check_in_time: new Date(Date.now() - 115 * 60000), check_out_time: new Date(Date.now() - 10 * 60000) },
  { cpr: '800123456', full_name: 'Omar Yousif', check_in_time: new Date(Date.now() - 155 * 60000), check_out_time: new Date(Date.now() - 25 * 60000) },
  { cpr: '810234568', full_name: 'Layla Al-Zayani', check_in_time: new Date(Date.now() - 120 * 60000), check_out_time: new Date(Date.now() - 40 * 60000) },
  { cpr: '820345679', full_name: 'Hassan Ali', check_in_time: new Date(Date.now() - 115 * 60000), check_out_time: new Date(Date.now() - 60 * 60000) },
  { cpr: '830456780', full_name: 'Amina Khalil', check_in_time: new Date(Date.now() - 165 * 60000), check_out_time: new Date(Date.now() - 75 * 60000) },
];

const formatCpr = (cpr: string): string => {
  return `${cpr.slice(0, 3)}-${cpr.slice(3, 6)}-${cpr.slice(6)}`;
};

const formatDuration = (checkIn: Date, checkOut: Date): string => {
  const minutes = differenceInMinutes(checkOut, checkIn);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const GymFloorActivity: React.FC = () => {
  const [membersInGym, setMembersInGym] = useState<AttendanceMember[]>([]);
  const [recentArrivals, setRecentArrivals] = useState<AttendanceMember[]>([]);
  const [recentDepartures, setRecentDepartures] = useState<AttendanceMember[]>([]);
  const [stats, setStats] = useState<GymStats>({ currentlyIn: 0, todayVisits: 0, avgDuration: '0h 0m' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data - will be replaced with real DB calls
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setMembersInGym(sampleMembersInGym);
        setRecentArrivals(sampleRecentArrivals);
        setRecentDepartures(sampleRecentDepartures);
        setStats({
          currentlyIn: sampleMembersInGym.length,
          todayVisits: 24,
          avgDuration: '1h 25m'
        });
        setIsLoading(false);
      }, 500);
    };

    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Gym Floor Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Gym Floor Activity
            <span className="relative flex h-3 w-3 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-normal text-muted-foreground ml-1">Live</span>
          </CardTitle>
        </div>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Currently In: {stats.currentlyIn}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <UserCheck className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Today's Visits: {stats.todayVisits}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Avg Duration: {stats.avgDuration}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Currently In Gym */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Currently In Gym</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {membersInGym.length}
              </Badge>
            </div>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-2">
                {membersInGym.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No members in gym</p>
                ) : (
                  membersInGym.map((member) => (
                    <div
                      key={member.cpr}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg border-l-4 border-l-green-500 hover:shadow-sm transition-shadow"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">CPR: {formatCpr(member.cpr)}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(member.check_in_time, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Recent Arrivals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Recent Arrivals</h3>
              <Badge className="bg-green-500 hover:bg-green-600">IN</Badge>
            </div>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-2">
                {recentArrivals.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent arrivals</p>
                ) : (
                  recentArrivals.map((member, index) => (
                    <div
                      key={`${member.cpr}-${index}`}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow animate-fade-in"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                        <LogIn className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">CPR: {formatCpr(member.cpr)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(member.check_in_time, { addSuffix: true })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Recent Departures */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold">Recent Departures</h3>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">OUT</Badge>
            </div>
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-2">
                {recentDepartures.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent departures</p>
                ) : (
                  recentDepartures.map((member, index) => (
                    <div
                      key={`${member.cpr}-${index}`}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                        <LogOut className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">CPR: {formatCpr(member.cpr)}</p>
                        {member.check_out_time && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            Stayed: {formatDuration(member.check_in_time, member.check_out_time)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {member.check_out_time && formatDistanceToNow(member.check_out_time, { addSuffix: true })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GymFloorActivity;
