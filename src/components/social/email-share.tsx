
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { shareViaEmail } from '@/services/share-service';

interface EmailShareProps {
  userId: string;
  onSuccess?: () => void;
}

export const EmailShare: React.FC<EmailShareProps> = ({ userId, onSuccess }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShareViaEmail = async () => {
    if (!userId) return;
    
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
      const result = await shareViaEmail(userId, email);
      
      if (result.success) {
        toast({
          title: "Share Successful",
          description: `Your health data has been shared with ${email}.`,
        });
        setEmail('');
        onSuccess?.();
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
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Share via Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="recipient@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button 
        onClick={handleShareViaEmail}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Mail className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </>
        )}
      </Button>
    </div>
  );
};
