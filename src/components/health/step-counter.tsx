import React, { useState, useEffect } from 'react';
import { Motion } from '@capacitor/motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveHealthMetric } from '@/services/health-service';
import { useAuth } from '@/context/AuthContext';

export const StepCounter: React.FC = () => {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const savedSteps = localStorage.getItem('today-steps');
    const lastSaveDate = localStorage.getItem('steps-last-save-date');
    const today = new Date().toDateString();
    
    if (lastSaveDate !== today) {
      localStorage.setItem('today-steps', '0');
      localStorage.setItem('steps-last-save-date', today);
      setSteps(0);
    } else if (savedSteps) {
      setSteps(parseInt(savedSteps, 10));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('today-steps', steps.toString());
  }, [steps]);
  
  useEffect(() => {
    const checkDeviceMotion = async () => {
      try {
        const isAvailable = await Motion.addListener('accel', () => {
          Motion.removeAllListeners();
          return true;
        }).catch(() => false);
        
        setIsSupported(!!isAvailable);
        
        if (isAvailable) {
          try {
            await Motion.addListener('accel', () => {});
            await Motion.removeAllListeners();
            setIsPermissionGranted(true);
          } catch (error) {
            setIsPermissionGranted(false);
            toast({
              title: "Permission Required",
              description: "Step counting requires motion sensor permission",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Not Supported",
            description: "Your device doesn't support motion detection",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking motion capability:', error);
        setIsSupported(false);
      }
    };
    
    checkDeviceMotion();
  }, [toast]);
  
  const toggleTracking = async () => {
    if (isTracking) {
      await Motion.removeAllListeners();
      setIsTracking(false);
      if (user && steps > 0) {
        saveHealthMetric(user.id, 'steps', steps.toString(), 'steps')
          .then(response => {
            if (response.success) {
              toast({
                title: "Steps Saved",
                description: `${steps} steps have been recorded`,
              });
            }
          })
          .catch(error => console.error('Error saving steps:', error));
      }
    } else {
      try {
        if (!isPermissionGranted) {
          try {
            await Motion.addListener('accel', () => {});
            await Motion.removeAllListeners();
            setIsPermissionGranted(true);
          } catch (error) {
            console.error('Permission not granted:', error);
            toast({
              title: "Permission Denied",
              description: "Cannot count steps without motion permission",
              variant: "destructive",
            });
            return;
          }
        }
        
        await Motion.addListener('accel', event => {
          const { x, y, z } = event.acceleration;
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          
          if (magnitude > 10) {
            setSteps(prevSteps => prevSteps + 1);
          }
        });
        
        setIsTracking(true);
        toast({
          title: "Step Tracking Started",
          description: "Move your device while walking to count steps",
        });
      } catch (error) {
        console.error('Error starting step counter:', error);
        toast({
          title: "Error",
          description: "Could not start step counter. Check permissions.",
          variant: "destructive",
        });
      }
    }
  };
  
  const resetSteps = () => {
    setSteps(0);
    localStorage.setItem('today-steps', '0');
    toast({
      title: "Steps Reset",
      description: "Step counter has been reset to zero",
    });
  };
  
  if (!isSupported) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints size={20} /> Step Counter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Step counting is not supported on this device. Try connecting to Google Fit or Apple Health instead.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints size={20} /> Step Counter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold mb-4 neon-text">
            {steps}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Steps today
          </p>
          
          <div className="flex gap-2">
            <Button
              variant={isTracking ? "destructive" : "default"}
              className={!isTracking ? "bg-solo-blue hover:bg-solo-blue/80" : ""}
              onClick={toggleTracking}
              disabled={!isPermissionGranted && !isTracking}
            >
              {isTracking ? (
                <>
                  <Pause size={16} className="mr-1" /> Pause
                </>
              ) : (
                <>
                  <Play size={16} className="mr-1" /> Start Tracking
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetSteps}
              disabled={steps === 0}
            >
              <RotateCcw size={16} className="mr-1" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
