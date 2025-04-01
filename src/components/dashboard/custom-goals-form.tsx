
import React, { useState, useEffect } from 'react';
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
import { Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoalSettings {
  pushups: number;
  distance: number;
  water: number;
}

export const CustomGoalsForm = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [goals, setGoals] = useState<GoalSettings>({
    pushups: 50,
    distance: 5,
    water: 8,
  });
  
  // Load saved goals on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('customGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);
  
  const handleSave = () => {
    localStorage.setItem('customGoals', JSON.stringify(goals));
    
    // Update individual activity targets
    localStorage.setItem('Push-ups-target', goals.pushups.toString());
    localStorage.setItem('Running/Walking-target', goals.distance.toString());
    localStorage.setItem('Water Intake-target', goals.water.toString());
    
    setOpen(false);
    
    toast({
      title: "Goals Updated",
      description: "Your custom goals have been saved successfully!",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-solo-blue/30 text-solo-blue hover:bg-solo-blue/5"
        >
          <Settings size={16} className="mr-2" /> Custom Goals
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Custom Goals</DialogTitle>
          <DialogDescription>
            Customize your daily activity targets to match your fitness level.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pushups">Push-ups (reps)</Label>
            <Input 
              id="pushups" 
              type="number" 
              min="1"
              value={goals.pushups}
              onChange={(e) => setGoals({...goals, pushups: parseInt(e.target.value) || 1})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="distance">Running/Walking (km)</Label>
            <Input 
              id="distance" 
              type="number"
              min="0.5"
              step="0.5" 
              value={goals.distance}
              onChange={(e) => setGoals({...goals, distance: parseFloat(e.target.value) || 0.5})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="water">Water Intake (glasses)</Label>
            <Input 
              id="water" 
              type="number" 
              min="1"
              value={goals.water}
              onChange={(e) => setGoals({...goals, water: parseInt(e.target.value) || 1})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
