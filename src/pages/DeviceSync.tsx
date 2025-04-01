import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Activity, Watch, Smartphone, Info, Bluetooth, CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DeviceSync = () => {
  const { toast } = useToast();
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(false);
  
  useEffect(() => {
    if (navigator.bluetooth) {
      setIsBluetoothSupported(true);
    } else {
      console.log("Web Bluetooth API is not supported in this browser.");
      setIsBluetoothSupported(false);
    }
  }, []);
  
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return <Navigate to="/auth" replace />;
  }

  const handleConnectBluetooth = async () => {
    setIsConnecting(true);
    
    try {
      if (!navigator.bluetooth) {
        throw new Error("Bluetooth not supported in this browser");
      }
      
      toast({
        title: "Bluetooth Search",
        description: "Searching for devices...",
      });
      
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', 'health_thermometer']
      });
      
      if (device) {
        toast({
          title: "Device Connected",
          description: `Successfully connected to ${device.name || 'your device'}!`,
        });
        
        setConnectedDevices(prev => [...prev, device.name || 'Unknown device']);
      }
    } catch (error: any) {
      console.error('Bluetooth connection error:', error);
      
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleConnectHealthKit = () => {
    toast({
      title: "Apple HealthKit",
      description: "To connect with Apple HealthKit, please install our iOS app.",
    });
  };
  
  const handleConnectGoogleFit = () => {
    toast({
      title: "Google Fit",
      description: "To connect with Google Fit, please install our Android app.",
    });
  };
  
  const handleConnectFitbit = () => {
    toast({
      title: "Fitbit",
      description: "Fitbit integration coming soon!",
    });
  };

  return (
    <MobileLayout currentTab="devices">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Device Sync</h1>
            <p className="text-muted-foreground text-sm">Connect your health devices</p>
          </div>
          <Activity size={24} className="text-solo-purple" />
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth size={18} /> Bluetooth Devices
            </CardTitle>
            <CardDescription>
              Connect directly to heart rate monitors, scales, and other Bluetooth devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isBluetoothSupported && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md">
                <AlertCircle size={18} />
                <p className="text-sm">Web Bluetooth is not supported in this browser. Please try Chrome, Edge, or Opera.</p>
              </div>
            )}
            
            {connectedDevices.length > 0 ? (
              <div className="space-y-2">
                {connectedDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span>{device}</span>
                    </div>
                    <Button variant="ghost" size="sm">Disconnect</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No devices connected</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-solo-blue hover:bg-solo-blue/80" 
              onClick={handleConnectBluetooth}
              disabled={isConnecting || !isBluetoothSupported}
            >
              {isConnecting ? 'Connecting...' : 'Connect Bluetooth Device'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="glass-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Watch size={16} /> Apple Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-xs text-muted-foreground mb-3">
                Sync with Apple Health to import workouts and health data
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-solo-blue/30 text-solo-blue"
                onClick={handleConnectHealthKit}
              >
                Connect
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Activity size={16} /> Google Fit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-xs text-muted-foreground mb-3">
                Import steps, activities and health metrics from Google Fit
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-solo-purple/30 text-solo-purple"
                onClick={handleConnectGoogleFit}
              >
                Connect
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={18} /> Popular Fitness Apps
            </CardTitle>
            <CardDescription>
              Connect to third-party fitness platforms and wearables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00B0B9] flex items-center justify-center text-white">
                  F
                </div>
                <div>
                  <h4 className="font-medium">Fitbit</h4>
                  <p className="text-xs text-muted-foreground">Connect your Fitbit account</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleConnectFitbit}
              >
                Connect
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-muted-foreground text-xs w-full">
                  <Info size={14} className="mr-1" /> Why connect your devices?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Benefits of Device Sync</DialogTitle>
                  <DialogDescription>
                    Connecting your health devices provides these benefits:
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Automatic tracking of steps, heart rate and activities</li>
                    <li>More accurate calorie calculations</li>
                    <li>Comprehensive sleep analysis</li>
                    <li>Continuous health monitoring</li>
                    <li>Better workout recommendations based on your actual performance</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button>Got it</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default DeviceSync;
