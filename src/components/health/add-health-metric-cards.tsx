import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { saveHealthMetric } from '@/services/health-service';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Heart, Activity, TrendingUp, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AddHealthMetricCardsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface MetricOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  unit: string;
  placeholder: string;
  step?: string;
}

export const AddHealthMetricCards: React.FC<AddHealthMetricCardsProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'input'>('select');
  const [selectedMetric, setSelectedMetric] = useState<MetricOption | null>(null);
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metricOptions: MetricOption[] = [
    { 
      value: 'weight', 
      label: 'Weight', 
      icon: <Scale className="h-6 w-6" />, 
      unit: 'kg',
      placeholder: '70.5',
      step: '0.1'
    },
    { 
      value: 'height', 
      label: 'Height', 
      icon: <TrendingUp className="h-6 w-6" />, 
      unit: 'cm',
      placeholder: '175'
    },
    { 
      value: 'blood_pressure', 
      label: 'Blood Pressure', 
      icon: <Activity className="h-6 w-6" />, 
      unit: 'mmHg',
      placeholder: '120/80'
    },
    { 
      value: 'heart_rate', 
      label: 'Heart Rate', 
      icon: <Heart className="h-6 w-6" />, 
      unit: 'bpm',
      placeholder: '75'
    },
    { 
      value: 'blood_sugar', 
      label: 'Blood Sugar', 
      icon: <Droplets className="h-6 w-6" />, 
      unit: 'mg/dL',
      placeholder: '100'
    },
  ];

  const handleMetricSelect = (metric: MetricOption) => {
    setSelectedMetric(metric);
    setStep('input');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedMetric(null);
    setValue('');
  };

  const handleSubmit = async () => {
    if (!user || !selectedMetric) return;

    if (!value) {
      toast({
        title: "Validation Error",
        description: "Please enter a value.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveHealthMetric(
        user.id,
        selectedMetric.value,
        value,
        selectedMetric.unit
      );

      if (result.success) {
        toast({
          title: "Success!",
          description: `Your ${selectedMetric.label.toLowerCase()} has been saved.`,
        });
        onSuccess();
        onClose();
        // Reset state
        setStep('select');
        setSelectedMetric(null);
        setValue('');
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Add Health Metric</h2>
                  <p className="text-muted-foreground">Select a metric to record</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {metricOptions.map((metric) => (
                    <Card
                      key={metric.value}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
                        "border-2 hover:border-solo-purple"
                      )}
                      onClick={() => handleMetricSelect(metric)}
                    >
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <div className="p-2 rounded-full bg-solo-purple/10 text-solo-purple">
                          {metric.icon}
                        </div>
                        <span className="font-medium">{metric.label}</span>
                        <span className="text-xs text-muted-foreground">{metric.unit}</span>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Enter {selectedMetric?.label}</h2>
                  <p className="text-muted-foreground">
                    Record your measurement in {selectedMetric?.unit}
                  </p>
                </div>
                <Card className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-solo-purple/10 text-solo-purple">
                      {selectedMetric?.icon}
                    </div>
                    <Input
                      type={selectedMetric?.value === 'blood_pressure' ? 'text' : 'number'}
                      placeholder={selectedMetric?.placeholder}
                      step={selectedMetric?.step}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="text-center text-lg"
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedMetric?.unit}
                    </span>
                  </div>
                </Card>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-solo-purple to-solo-teal hover:opacity-90"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
