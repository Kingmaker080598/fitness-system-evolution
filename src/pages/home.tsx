import React from 'react';
import { MobileLayout } from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Activity, Dumbbell, Heart, Users, Play, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const motivationalQuotes = [
  {
    quote: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    quote: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips"
  }
];

const workoutTips = [
  "Stay hydrated during workouts - drink water every 15-20 minutes",
  "Warm up properly to prevent injuries and improve performance",
  "Mix cardio and strength training for optimal results",
  "Get enough rest between workouts for proper recovery"
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const randomTip = workoutTips[Math.floor(Math.random() * workoutTips.length)];

  const features = [
    {
      title: "Smart Dashboard",
      description: "Track your progress with intuitive visualizations and insights",
      icon: Activity
    },
    {
      title: "Workout Tracking",
      description: "Log and monitor your exercises, sets, and personal records",
      icon: Dumbbell
    },
    {
      title: "Health Metrics",
      description: "Monitor vital health indicators and see your improvements",
      icon: Heart
    },
    {
      title: "Community",
      description: "Share progress and connect with like-minded fitness enthusiasts",
      icon: Users
    }
  ];

  const steps = [
    {
      title: "Create Profile",
      description: "Set up your personal profile and fitness goals"
    },
    {
      title: "Track Workouts",
      description: "Log your exercises and monitor your progress"
    },
    {
      title: "Monitor Health",
      description: "Keep track of important health metrics"
    },
    {
      title: "Share Progress",
      description: "Celebrate achievements with the community"
    }
  ];

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Landing page content */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Transform Your Fitness Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track workouts, monitor health metrics, and achieve your fitness goals with our comprehensive fitness tracking platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    );
  }

  // If user is logged in, show home page with nav bar
  return (
    <MobileLayout currentTab="home">
      <div className="container mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Transform Your Fitness Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track workouts, monitor health metrics, and achieve your fitness goals with our comprehensive fitness tracking platform.
        </p>

      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>



      {/* Today's Motivation */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-2 pl-4 italic">
              "{randomQuote.quote}"
              <footer className="text-sm text-muted-foreground mt-2">
                — {randomQuote.author}
              </footer>
            </blockquote>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Workout Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{randomTip}</p>
          </CardContent>
        </Card>
      </section>

      {/* Getting Started */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Get Started in 4 Easy Steps</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">{index + 1}</div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {!user && (
          <div className="text-center pt-6">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
      </div>
    </MobileLayout>
  );
};
