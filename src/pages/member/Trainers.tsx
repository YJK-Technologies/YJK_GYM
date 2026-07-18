
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mail, Phone, Clock, Award, Star } from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  certifications: string[];
  specializations: string[];
  experience: number;
  schedule: string;
  bio: string;
  rating: number;
  reviewCount: number;
}

const Trainers = () => {
  const navigate = useNavigate();

  const trainers: Trainer[] = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@ruw.edu.bh',
      phone: '+973 3456 7890',
      certifications: ['NASM Certified Personal Trainer', 'ACE Fitness Nutrition Specialist'],
      specializations: ['Weight Loss', 'Strength Training', 'HIIT'],
      experience: 8,
      schedule: 'Sun-Thu: 6AM-2PM',
      bio: 'Ahmed is a dedicated fitness professional with over 8 years of experience helping clients achieve their fitness goals. He specializes in weight loss transformations and strength building programs. His holistic approach combines effective workout routines with nutritional guidance to deliver lasting results.',
      rating: 4.9,
      reviewCount: 127
    },
    {
      id: '2',
      name: 'Fatima Hassan',
      email: 'fatima.hassan@ruw.edu.bh',
      phone: '+973 3567 8901',
      certifications: ['Yoga Alliance RYT-500', 'Pilates Method Alliance Certified'],
      specializations: ['Yoga', 'Pilates', 'Flexibility Training', 'Mindfulness'],
      experience: 6,
      schedule: 'Sun-Thu: 2PM-10PM',
      bio: 'Fatima brings a holistic approach to fitness, combining traditional yoga practices with modern wellness techniques. She is passionate about helping members find balance in body and mind. Her classes focus on building core strength, improving flexibility, and promoting mental clarity through mindful movement.',
      rating: 4.8,
      reviewCount: 98
    },
    {
      id: '3',
      name: 'Omar Khalil',
      email: 'omar.khalil@ruw.edu.bh',
      phone: '+973 3678 9012',
      certifications: ['ISSA Sports Nutrition', 'CrossFit Level 2 Trainer', 'First Aid Certified'],
      specializations: ['CrossFit', 'Sports Performance', 'Muscle Building'],
      experience: 10,
      schedule: 'Sat-Wed: 8AM-4PM',
      bio: 'Omar is a former competitive athlete turned fitness coach. With a decade of experience, he excels at designing performance-focused training programs for athletes and fitness enthusiasts alike. His methodology emphasizes functional fitness, explosive power, and injury prevention.',
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: '4',
      name: 'Sara Al-Mahmoud',
      email: 'sara.mahmoud@ruw.edu.bh',
      phone: '+973 3789 0123',
      certifications: ['ACSM Certified Exercise Physiologist', 'Pre/Postnatal Fitness Specialist'],
      specializations: ['Cardio Training', 'Women\'s Fitness', 'Senior Fitness'],
      experience: 5,
      schedule: 'Sun-Thu: 10AM-6PM',
      bio: 'Sara specializes in creating inclusive fitness programs for women of all ages and fitness levels. She has particular expertise in pre/postnatal fitness and senior wellness programs. Her supportive coaching style makes fitness accessible and enjoyable for everyone.',
      rating: 4.7,
      reviewCount: 72
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/MemberDashboard')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Our Expert Trainers</h1>
            </div>
            <Badge variant="secondary">Member</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your Fitness Experts</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our certified personal trainers are dedicated to helping you achieve your fitness goals. 
            Each trainer brings unique expertise and a passion for transforming lives through fitness.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <GraduationCap className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{trainer.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{trainer.rating}</span>
                        <span className="text-purple-200">({trainer.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-purple-200">
                        <Award className="h-4 w-4" />
                        <span>{trainer.experience} years experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{trainer.bio}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-purple-600" />
                      {trainer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-purple-600" />
                      {trainer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-purple-600" />
                      {trainer.schedule}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Specializations:</p>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specializations.map((spec, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    Request This Trainer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trainers;
