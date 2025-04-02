
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createShareableLink } from '@/services/share-service';

interface ShareCodeGeneratorProps {
  userId: string;
}

export const ShareCodeGenerator: React.FC<ShareCodeGeneratorProps> = ({ userId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateShareCode = async () => {
    setIsLoading(true);
    try {
      const result = await createShareableLink(userId);
      
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

  return (
    <div className="space-y-4">
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
  );
};
