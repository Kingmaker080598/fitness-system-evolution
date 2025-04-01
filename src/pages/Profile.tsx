
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { ProfileHeader } from '@/components/profile/profile-header';
import { StatsSection } from '@/components/profile/stats-section';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  Calendar, 
  Clock, 
  Flame, 
  LogOut, 
  Settings,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({
    name: 'John Hunter',
    email: 'john.hunter@example.com',
  });
  
  // Check if user is logged in
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return <Navigate to="/auth" replace />;
  }

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "This feature will be available in the next update.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    window.location.href = '/auth';
  };

  const stats = [
    {
      label: 'Workouts',
      value: 32,
      icon: <Flame size={20} />
    },
    {
      label: 'Streak',
      value: 7,
      icon: <Zap size={20} />
    },
    {
      label: 'Hours',
      value: 24,
      icon: <Clock size={20} />
    },
    {
      label: 'Level',
      value: 5,
      icon: <Award size={20} />
    },
    {
      label: 'Days',
      value: 45,
      icon: <Calendar size={20} />
    },
    {
      label: 'Settings',
      value: <Settings size={16} />,
      icon: <Settings size={20} />
    }
  ];

  return (
    <MobileLayout currentTab="profile">
      <div className="space-y-6">
        <ProfileHeader
          name={user.name}
          email={user.email}
          onEditClick={handleEditProfile}
        />
        
        <Separator className="bg-solo-blue/20" />
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
          <StatsSection stats={stats} />
        </div>
        
        <div className="glass-card rounded-lg p-4 mt-6">
          <h3 className="font-medium mb-3">Achievements</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['First Workout', '7-Day Streak', 'Weight Goal', 'Perfect Week'].map((achievement, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 p-3 bg-muted rounded-lg border border-solo-purple/30 flex flex-col items-center min-w-[100px]"
              >
                <Award 
                  size={24} 
                  className={`mb-2 ${i === 0 || i === 1 ? 'text-solo-blue' : 'text-muted-foreground'}`} 
                />
                <span className={`text-xs text-center ${i === 0 || i === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="w-full mt-6"
        >
          <LogOut size={16} className="mr-2" /> Log Out
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Profile;
