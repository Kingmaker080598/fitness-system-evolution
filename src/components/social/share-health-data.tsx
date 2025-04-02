
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
import { Share2 } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShareCodeGenerator } from './share-code-generator';
import { EmailShare } from './email-share';
import { WhatsAppShare } from './whatsapp-share';

export const ShareHealthData = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
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
            Share your health metrics with friends or healthcare providers.
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="code">Share Code</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code">
              <ShareCodeGenerator userId={user.id} />
            </TabsContent>
            
            <TabsContent value="email">
              <EmailShare 
                userId={user.id} 
                onSuccess={() => setOpen(false)}
              />
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <div className="py-2 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share your health data quickly via WhatsApp. This will generate a share code and open WhatsApp with a pre-filled message.
                </p>
                <WhatsAppShare userId={user.id} />
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter className="sm:justify-start mt-4">
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
