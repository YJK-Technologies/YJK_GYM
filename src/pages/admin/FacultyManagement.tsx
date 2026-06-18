
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, GraduationCap, Mail, Phone, Clock, Award, Users } from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  certifications: string[];
  specializations: string[];
  experience: number;
  schedule: string;
  bio: string;
  assignedMembers: number;
  isActive: boolean;
}

const FacultyManagement = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Sample trainers data
  const [trainers] = useState<Trainer[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@ruw.edu.bh',
      phone: '+973 3456 7890',
      photo: '',
      certifications: ['NASM Certified Personal Trainer', 'ACE Fitness Nutrition Specialist'],
      specializations: ['Weight Loss', 'Strength Training', 'HIIT'],
      experience: 8,
      schedule: 'Sun-Thu: 6AM-2PM',
      bio: 'Ahmed is a dedicated fitness professional with over 8 years of experience helping clients achieve their fitness goals. He specializes in weight loss transformations and strength building programs.',
      assignedMembers: 24,
      isActive: true
    },
    {
      id: '2',
      name: 'Fatima Hassan',
      email: 'fatima.hassan@ruw.edu.bh',
      phone: '+973 3567 8901',
      photo: '',
      certifications: ['Yoga Alliance RYT-500', 'Pilates Method Alliance Certified'],
      specializations: ['Yoga', 'Pilates', 'Flexibility Training', 'Mindfulness'],
      experience: 6,
      schedule: 'Sun-Thu: 2PM-10PM',
      bio: 'Fatima brings a holistic approach to fitness, combining traditional yoga practices with modern wellness techniques. She is passionate about helping members find balance in body and mind.',
      assignedMembers: 18,
      isActive: true
    },
    {
      id: '3',
      name: 'Omar Khalil',
      email: 'omar.khalil@ruw.edu.bh',
      phone: '+973 3678 9012',
      photo: '',
      certifications: ['ISSA Sports Nutrition', 'CrossFit Level 2 Trainer', 'First Aid Certified'],
      specializations: ['CrossFit', 'Sports Performance', 'Muscle Building'],
      experience: 10,
      schedule: 'Sat-Wed: 8AM-4PM',
      bio: 'Omar is a former competitive athlete turned fitness coach. With a decade of experience, he excels at designing performance-focused training programs for athletes and fitness enthusiasts alike.',
      assignedMembers: 32,
      isActive: true
    },
    {
      id: '4',
      name: 'Sara Al-Mahmoud',
      email: 'sara.mahmoud@ruw.edu.bh',
      phone: '+973 3789 0123',
      photo: '',
      certifications: ['ACSM Certified Exercise Physiologist', 'Pre/Postnatal Fitness Specialist'],
      specializations: ['Cardio Training', 'Women\'s Fitness', 'Senior Fitness'],
      experience: 5,
      schedule: 'Sun-Thu: 10AM-6PM',
      bio: 'Sara specializes in creating inclusive fitness programs for women of all ages and fitness levels. She has particular expertise in pre/postnatal fitness and senior wellness programs.',
      assignedMembers: 15,
      isActive: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trainer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Trainer</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new personal trainer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="trainer@ruw.edu.bh" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+973 XXXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input id="experience" type="number" placeholder="5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      <Input id="certifications" placeholder="NASM CPT, ACE Fitness..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                      <Input id="specializations" placeholder="Weight Loss, Strength Training..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Working Schedule</Label>
                      <Input id="schedule" placeholder="Sun-Thu: 6AM-2PM" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea id="bio" placeholder="Brief description about the trainer..." rows={4} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Add Trainer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trainers</p>
                  <p className="text-2xl font-bold text-gray-900">{trainers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Members</p>
                  <p className="text-2xl font-bold text-gray-900">{trainers.reduce((sum, t) => sum + t.assignedMembers, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-4">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Experience</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(trainers.reduce((sum, t) => sum + t.experience, 0) / trainers.length)} yrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-500 text-white mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-gray-900">{trainers.filter(t => t.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trainers Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Trainers</CardTitle>
            <CardDescription>Manage your gym's personal training staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainers.map((trainer) => (
                <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <GraduationCap className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trainer.name}</h3>
                          <p className="text-sm text-gray-500">{trainer.experience} years experience</p>
                          <Badge variant={trainer.isActive ? 'default' : 'secondary'} className="mt-1">
                            {trainer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {trainer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {trainer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {trainer.schedule}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {trainer.assignedMembers} members assigned
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline">{spec}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {trainer.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FacultyManagement;
