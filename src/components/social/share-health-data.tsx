
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
import { Share2, Copy, Check, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export const ShareHealthData = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Generate a shareable code based on user's health data
  const generateShareCode = () => {
    const userData = {
      name: localStorage.getItem('userName') || 'Anonymous',
      weight: localStorage.getItem('Weight-value') || '0',
      height: localStorage.getItem('Height-value') || '0',
      bloodPressure: localStorage.getItem('Blood Pressure-value') || '0/0',
      heartRate: localStorage.getItem('Heart Rate-value') || '0',
      bloodSugar: localStorage.getItem('Blood Sugar-value') || '0',
      activities: {
        pushups: localStorage.getItem('Push-ups-value') || '0',
        distance: localStorage.getItem('Running/Walking-value') || '0',
        water: localStorage.getItem('Water Intake-value') || '0',
      },
      timestamp: new Date().toISOString(),
    };
    
    // Create a shareable code by encoding data to base64
    return btoa(JSON.stringify(userData));
  };
  
  const shareableCode = generateShareCode();
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareableCode);
    setCopied(true);
    
    toast({
      title: "Code Copied",
      description: "Share this code with someone who has the app installed.",
    });
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShareViaEmail = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the code via an API
    // For now, we'll just simulate success
    toast({
      title: "Share Successful",
      description: `Your health data has been shared with ${email}.`,
    });
    
    setEmail('');
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-solo-purple/30 text-solo-purple hover:bg-solo-purple/5"
        >
          <Share2 size={16} className="mr-2" /> Share Health Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Health Data</DialogTitle>
          <DialogDescription>
            Share your health metrics with friends who have this app.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="code">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Share Code</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Your Shareable Code</Label>
              <div className="relative">
                <Input
                  value={shareableCode}
                  readOnly
                  className="pr-10 font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this code with someone who has the app installed. They can import your data
                by pasting this code.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter the email of the person you want to share with. They must have the app installed
                to view your health data.
              </p>
            </div>
            
            <Button 
              onClick={handleShareViaEmail}
              className="w-full"
            >
              Share via Email
            </Button>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
