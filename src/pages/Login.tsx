import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import ruwLogo from '@/assets/ruw-logo-full.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (role: 'admin' | 'member') => {
    // TODO: Implement actual authentication with Supabase
    console.log('Login attempt:', { email, password, role });
    
    // Temporary navigation for demo
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/member');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={ruwLogo} alt="Royal University for Women Logo" className="h-20" />
          </div>
          <CardTitle className="text-2xl font-bold">RUW FitnessPro</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member">Member</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="member" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member-email">Email</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member-password">Password</Label>
                  <Input
                    id="member-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin('member')}
                >
                  Sign In as Member
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  variant="destructive"
                  onClick={() => handleLogin('admin')}
                >
                  Sign In as Admin
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;