
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatar,
  onEditClick,
}) => {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative">
        <Avatar className="h-24 w-24 mb-4 border-2 border-solo-blue">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-solo-dark-accent text-solo-blue text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={onEditClick}
          className="absolute bottom-4 right-0 bg-solo-blue rounded-full p-1"
        >
          <Edit size={16} className="text-white" />
        </button>
      </div>
      
      <h1 className="text-xl font-bold text-foreground">{name}</h1>
      <p className="text-muted-foreground text-sm mt-1">{email}</p>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onEditClick}
        className="mt-4 border-solo-blue/50 text-solo-blue hover:bg-solo-blue/10"
      >
        Edit Profile
      </Button>
    </div>
  );
};
