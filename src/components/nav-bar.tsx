
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Dumbbell, Heart, User } from 'lucide-react';

interface NavBarProps {
  currentTab: string;
}

export const NavBar: React.FC<NavBarProps> = ({ currentTab }) => {
  const tabs = [
    { name: 'dashboard', icon: BarChart, label: 'Dashboard', path: '/dashboard' },
    { name: 'workouts', icon: Dumbbell, label: 'Workouts', path: '/workouts' },
    { name: 'health', icon: Heart, label: 'Health', path: '/health' },
    { name: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-solo-dark-accent border-t border-solo-blue/20 py-2 px-4">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.name;
          
          return (
            <Link 
              key={tab.name} 
              to={tab.path} 
              className={`flex flex-col items-center p-2 ${
                isActive 
                  ? 'text-solo-blue animate-pulse-glow rounded-md' 
                  : 'text-muted-foreground'
              }`}
            >
              <IconComponent size={24} className={isActive ? 'animate-float' : ''} />
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
