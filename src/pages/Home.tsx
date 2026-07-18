import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, TrendingUp, GraduationCap, Utensils } from 'lucide-react';
import yjkLogo from '@/assets/yjk-logo.png';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Complete member portal with personalized dashboards and progress tracking'
    },
    {
      icon: Calendar,
      title: 'Workout Programs',
      description: 'Create and assign personalized workout plans with progress monitoring'
    },
    {
      icon: DollarSign,
      title: 'Payment Management',
      description: 'Track payments, dues, and generate financial reports seamlessly'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor member fitness progress with detailed analytics and reports'
    },
    {
      icon: GraduationCap,
      title: 'Expert Trainers',
      description: 'Access certified personal trainers with specialized expertise in fitness, nutrition, and wellness coaching'
    },
    {
      icon: Utensils,
      title: 'Diet Plans',
      description: 'Personalized nutrition programs designed by experts to help you achieve your fitness goals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={yjkLogo} alt="RUW Logo" className="h-12 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">YJK FitnessPro</h1>
            </div>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Complete Gym Management
            <span className="text-purple-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your gym operations with our comprehensive management system featuring 
            member portals, admin dashboards, and automated workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Gym
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From member management to financial reporting, our platform provides all the tools 
              you need to operate efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of gym owners who have streamlined their operations with our platform.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={yjkLogo} alt="RUW Logo" className="h-10 mr-2" />
                <h3 className="text-lg font-semibold">YJK FitnessPro</h3>
              </div>
              <p className="text-gray-400">
                Complete gym management solution for modern fitness centers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Member Management</li>
                <li>Payment Processing</li>
                <li>Workout Programs</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Address</h4>
              <ul className="space-y-2 text-gray-400">
                <li>No 290,11(54, Neeli Appadurai St),</li>
                <li>NGO Nagar Extension, Ponneri-601204,</li>
                <li>Chennai, Tamil Nadu.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tel.: +91 95004 36787</li>
                <li>Toll Free: +973 80008900</li>
                <li>Fax.: +973 17764445</li>
                <li>E-mail: Support@yjktechnologies.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YJK FitnessPro. All rights reserved. | V-1.0-2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
