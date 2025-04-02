
import React, { useState, useEffect } from 'react';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';
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
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, getUserStats } from '@/services/profile-service';

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    workouts: 0,
    streak: 0,
    hours: 0,
    days: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Fetch profile data
          const profileResult = await getUserProfile(user.id);
          if (profileResult.success && profileResult.data) {
            setProfile(profileResult.data);
          } else {
            setProfile({
              full_name: user.user_metadata?.name || 'User',
              email: user.email,
              avatar_url: null
            });
          }
          
          // Fetch user stats
          const statsResult = await getUserStats(user.id);
          if (statsResult.success && statsResult.data) {
            setStats(statsResult.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  // Check if user is logged in
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log('Updating profile with:', updatedProfile);
    setProfile(prev => {
      const newProfile = { ...prev, ...updatedProfile };
      console.log('New profile state:', newProfile);
      return newProfile;
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  const userStats = [
    {
      label: 'Workouts',
      value: stats.workouts,
      icon: <Flame size={20} />
    },
    {
      label: 'Streak',
      value: stats.streak,
      icon: <Zap size={20} />
    },
    {
      label: 'Hours',
      value: stats.hours,
      icon: <Clock size={20} />
    },
    {
      label: 'Level',
      value: stats.level,
      icon: <Award size={20} />
    },
    {
      label: 'Days',
      value: stats.days,
      icon: <Calendar size={20} />
    },
    {
      label: 'Settings',
      value: <Settings size={16} />,
      icon: <Settings size={20} />
    }
  ];

  if (isLoading || loading) {
    return (
      <MobileLayout currentTab="profile">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin w-6 h-6 border-2 border-solo-blue border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading profile...</span>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentTab="profile">
      <div className="space-y-6">
        <ProfileHeader
          name={profile?.full_name || 'User'}
          email={profile?.email || user?.email || ''}
          avatar={profile?.avatar_url}
          onEditClick={handleEditProfile}
        />
        
        <Separator className="bg-solo-blue/20" />
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
          <StatsSection stats={userStats} />
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

        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userId={user?.id || ''}
          currentProfile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </MobileLayout>
  );
};

export default Profile;
