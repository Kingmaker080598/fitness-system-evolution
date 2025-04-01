
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const [currentTab, setCurrentTab] = useState('login');
  
  // If user is already logged in, redirect to dashboard
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-solo-dark px-4">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold neon-text">SOLO FITNESS</h1>
          <p className="text-muted-foreground mt-2">Level up your fitness journey</p>
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto glass-card">
        <CardContent className="pt-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
