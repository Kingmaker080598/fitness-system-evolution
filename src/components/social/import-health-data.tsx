import React, { useState } from 'react';
import { getSharedHealthData } from '@/services/share-service';
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
  
  const handleImportCode = async () => {
    if (!shareCode) {
      toast({
        title: "Error",
        description: "Please enter a share code.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await getSharedHealthData(shareCode);
      
      if (result.success) {
        // Process the health metrics into a more user-friendly format
        const metrics = (result.data.metrics || []).reduce((acc: any, metric: any) => {
          acc[metric.metric_type] = {
            value: metric.value,
            unit: metric.unit,
            date: new Date(metric.date).toLocaleDateString()
          };
          return acc;
        }, {});

        setFriendData({
          name: result.data.sender_name || 'Friend',
          metrics: metrics,
          timestamp: result.data.created_at,
        });
        
        toast({
          title: "Code Imported",
          description: `Successfully imported health data from ${result.data.sender_name || 'Friend'}`,
        });
        
        setImportSuccess(true);
      } else {
        throw new Error(result.error);
      }
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
            {friendData && (
              <Card>
                <CardHeader>
                  <CardTitle>Health Data from {friendData.name}</CardTitle>
                  <CardDescription>
                    Shared on {formatDate(friendData.timestamp)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(friendData.metrics).map(([type, data]: [string, any]) => (
                      <div key={type} className="flex justify-between items-center p-2 hover:bg-secondary rounded">
                        <span className="font-medium">{type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</span>
                        <div className="text-right">
                          <div>{data.value} {data.unit}</div>
                          <div className="text-xs text-muted-foreground">Last updated: {data.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
