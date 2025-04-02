
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { WhatsApp } from 'lucide-react';
import { createShareableLink } from '@/services/share-service';
import { useIsMobile } from '@/hooks/use-mobile';

interface WhatsAppShareProps {
  userId: string;
}

export const WhatsAppShare: React.FC<WhatsAppShareProps> = ({ userId }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const shareViaWhatsApp = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const result = await createShareableLink(userId);
      
      if (result.success) {
        const shareCode = result.data.share_code;
        const text = `I've shared my health metrics with you! Use this code to view my data in the app: ${shareCode}`;
        
        // Check if Web Share API is supported
        if (navigator.share && isMobile) {
          try {
            await navigator.share({
              title: 'Health Metrics Share',
              text: text,
            });
            toast({
              title: "Share Initiated",
              description: "WhatsApp share dialog opened.",
            });
          } catch (error) {
            console.error('Error sharing via Web Share API:', error);
            // Fallback to WhatsApp URL
            openWhatsAppShare(text);
          }
        } else {
          // Fallback for browsers without Web Share API
          openWhatsAppShare(text);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate share code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error preparing WhatsApp share:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsAppShare = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      onClick={shareViaWhatsApp}
      disabled={isLoading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {isLoading ? (
        <>
          <WhatsApp className="mr-2 h-4 w-4 animate-spin" />
          Preparing Share...
        </>
      ) : (
        <>
          <WhatsApp className="mr-2 h-4 w-4" />
          Share via WhatsApp
        </>
      )}
    </Button>
  );
};
