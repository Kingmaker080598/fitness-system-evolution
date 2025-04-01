import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Form state using react-hook-form
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
    }
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    
    // Sign up with Supabase
    const result = await signUp(values.email, values.password, values.name);
    
    if (result.success) {
      // Save additional health data
      try {
        // We'll handle this in a separate function once the user is authenticated
        toast({
          title: "Account created successfully!",
          description: "Welcome to Solo Fitness. Your journey begins now.",
        });
      } catch (err) {
        console.error("Failed to save health data", err);
      }
    } else {
      setError(result.error || "Registration failed");
    }
    
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="John Doe" 
                  required 
                  className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="Create a password" 
                  required 
                  minLength={6}
                  className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    min="1"
                    max="120"
                    placeholder="25" 
                    required 
                    className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="70.5" 
                    required 
                    className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    step="0.1"
                    min="50"
                    max="250"
                    placeholder="175" 
                    required 
                    className="bg-muted border-solo-blue/30 focus:border-solo-blue"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-solo-purple to-solo-teal hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
};
