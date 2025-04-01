
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { saveHealthMetric } from '@/services/health-service';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddHealthMetricFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddHealthMetricForm: React.FC<AddHealthMetricFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    metricType: '',
    value: '',
    unit: '',
  });

  const metricOptions = [
    { value: 'weight', label: 'Weight', defaultUnit: 'kg' },
    { value: 'height', label: 'Height', defaultUnit: 'cm' },
    { value: 'blood_pressure', label: 'Blood Pressure', defaultUnit: 'mmHg' },
    { value: 'heart_rate', label: 'Heart Rate', defaultUnit: 'bpm' },
    { value: 'blood_sugar', label: 'Blood Sugar', defaultUnit: 'mg/dL' },
  ];

  const handleMetricTypeChange = (value: string) => {
    const selectedMetric = metricOptions.find(option => option.value === value);
    setFormData({
      ...formData,
      metricType: value,
      unit: selectedMetric?.defaultUnit || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add health metrics.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.metricType || !formData.value) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveHealthMetric(
        user.id,
        formData.metricType,
        formData.value,
        formData.unit
      );

      if (result.success) {
        toast({
          title: "Success!",
          description: `Your ${formData.metricType} has been saved.`,
        });
        onSuccess();
        onClose();
        // Reset form after successful submission
        setFormData({
          metricType: '',
          value: '',
          unit: '',
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save health metric.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving health metric:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-background glass-card">
        <DialogHeader>
          <DialogTitle>Add Health Metric</DialogTitle>
          <DialogDescription>
            Record a new health measurement to track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="metricType">Metric Type</Label>
            <Select
              value={formData.metricType}
              onValueChange={handleMetricTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              type={formData.metricType === 'blood_pressure' ? 'text' : 'number'}
              placeholder={formData.metricType === 'blood_pressure' ? '120/80' : '0'}
              step={formData.metricType === 'weight' ? '0.1' : '1'}
              value={formData.value}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
              readOnly
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-solo-purple to-solo-teal hover:opacity-90"
            >
              {isSubmitting ? 'Saving...' : 'Save Metric'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
