
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createShareableLink, shareViaEmail } from '@/services/share-service';
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
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a shareable code when the dialog opens
  const generateShareCode = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await createShareableLink(user.id);
      
      if (result.success) {
        setShareCode(result.data.share_code);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate share code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating share code:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyCode = () => {
    if (!shareCode) return;
    
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    
    toast({
      title: "Code Copied",
      description: "Share this code with someone who has the app installed.",
    });
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShareViaEmail = async () => {
    if (!user) return;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await shareViaEmail(user.id, email);
      
      if (result.success) {
        toast({
          title: "Share Successful",
          description: `Your health data has been shared with ${email}.`,
        });
        setEmail('');
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to share via email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing via email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        
        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div>
              <Button 
                onClick={generateShareCode} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Users className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Generate Share Code
                  </>
                )}
              </Button>
            </div>

            {shareCode && (
              <div className="grid gap-2">
                <Label>Your Shareable Code</Label>
                <div className="relative">
                  <Input
                    value={shareCode}
                    readOnly
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with someone who has the app installed. They can import your data
                  by pasting this code. The code will expire in 48 hours.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
