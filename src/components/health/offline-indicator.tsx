
import React from 'react';
import { WifiOff, WifiIcon } from 'lucide-react';
import { isOnline } from '@/services/offline-storage';
import { useToast } from '@/components/ui/use-toast';

export const OfflineIndicator: React.FC<{ isSyncing?: boolean }> = ({ isSyncing }) => {
  const online = isOnline();
  const { toast } = useToast();
  
  const handleClick = () => {
    if (!online) {
      toast({
        title: "Offline Mode",
        description: "You're working offline. Your data will sync when internet connection returns.",
      });
    } else if (isSyncing) {
      toast({
        title: "Syncing",
        description: "Your health data is currently syncing with the server.",
      });
    } else {
      toast({
        title: "Online",
        description: "You're connected to the internet and your data is up to date.",
      });
    }
  };
  
  if (online && !isSyncing) return null;
  
  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        online 
          ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
          : 'bg-red-500/20 text-red-500 border border-red-500/30'
      } cursor-pointer`}
      onClick={handleClick}
    >
      {online ? (
        <>
          <WifiIcon size={12} className="animate-pulse" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
