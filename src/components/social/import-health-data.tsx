import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ImportHealthData = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [friendData, setFriendData] = useState<any>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  
  const handleImportCode = () => {
    if (!shareCode) {
      toast({
        title: "Error",
        description: "Please enter a share code.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Decode the share code
      const decodedData = JSON.parse(atob(shareCode));
      setFriendData(decodedData);
      
      toast({
        title: "Code Imported",
        description: "Friend's health data imported successfully.",
      });
      
      // In a real app, you would save this to a database
      // For demo, we'll just keep it in state
      setImportSuccess(true);
      
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "The share code is invalid or corrupted.",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-solo-blue/30 text-solo-blue hover:bg-solo-blue/5"
        >
          <UserPlus size={16} className="mr-2" /> Import Health Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Friend's Health Data</DialogTitle>
          <DialogDescription>
            View health data shared by your friends.
          </DialogDescription>
        </DialogHeader>
        
        {!importSuccess ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shareCode">Share Code</Label>
              <Input
                id="shareCode"
                placeholder="Paste the share code here"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Paste the code that was shared with you to view your friend's health data.
              </p>
            </div>
            
            <Button 
              onClick={handleImportCode}
              className="w-full"
            >
              <Download size={16} className="mr-2" /> Import Data
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{friendData?.name}'s Health Data</CardTitle>
                <CardDescription>Shared on {formatDate(friendData?.timestamp)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{friendData?.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="font-medium">{friendData?.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Pressure:</span>
                  <span className="font-medium">{friendData?.bloodPressure} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heart Rate:</span>
                  <span className="font-medium">{friendData?.heartRate} bpm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Sugar:</span>
                  <span className="font-medium">{friendData?.bloodSugar} mg/dL</span>
                </div>
                <div className="pt-2 border-t mt-2">
                  <p className="font-medium mb-2">Daily Activities</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Push-ups:</span>
                    <span className="font-medium">{friendData?.activities?.pushups} reps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Running/Walking:</span>
                    <span className="font-medium">{friendData?.activities?.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Water Intake:</span>
                    <span className="font-medium">{friendData?.activities?.water} glasses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setImportSuccess(false);
                    setShareCode('');
                  }}
                >
                  Import Another
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setImportSuccess(false);
              setShareCode('');
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
