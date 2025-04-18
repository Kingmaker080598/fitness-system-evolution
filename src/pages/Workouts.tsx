
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MobileLayout } from '@/components/mobile-layout';
import { ExerciseCard } from '@/components/workouts/exercise-card';
import { WorkoutDaySelector } from '@/components/workouts/workout-day-selector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

// Mock data for workouts
const workouts = {
  monday: [
    {
      title: 'Push-ups',
      imageUrl: 'https://static.strengthlevel.com/images/illustrations/push-ups-1000x1000.jpg',
      sets: 3,
      reps: 12,
      description: 'Keep your body straight and lower until your chest nearly touches the ground.'
    },
    {
      title: 'Tricep Dips',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/bench-dips.gif',
      sets: 3,
      reps: 15,
      description: 'Use a chair or bench, lower your body until arms are at 90 degrees.'
    },
    {
      title: 'Incline Push-ups',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/04/incline-push-up.gif',
      sets: 3,
      reps: 10,
      description: 'Place hands on elevated surface. Easier variation of standard push-ups.'
    }
  ],
  tuesday: [
    {
      title: 'Bodyweight Rows',
      imageUrl: 'https://static.strengthlevel.com/images/illustrations/inverted-rows-1000x1000.jpg',
      sets: 3,
      reps: 12,
      description: 'Use a table or horizontal bar, pull your chest towards the bar.'
    },
    {
      title: 'Bicep Isometric Holds',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/bicep-isometric-hold.jpg',
      sets: 3,
      reps: 30,
      description: 'Hold position with arms at 90 degrees for time indicated.'
    }
  ],
  wednesday: [
    {
      title: 'Bodyweight Squats',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2021/07/bodyweight-squat.gif',
      sets: 4,
      reps: 15,
      description: 'Stand with feet shoulder-width apart, lower until thighs are parallel to ground.'
    },
    {
      title: 'Lunges',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/04/bodyweight-lunge.gif',
      sets: 3,
      reps: 10,
      description: 'Step forward and lower your body until both knees form 90-degree angles.'
    }
  ],
  thursday: [
    {
      title: 'Pike Push-ups',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/04/pike-push-up.gif',
      sets: 3,
      reps: 10,
      description: 'Form an inverted V, lower head toward the ground to target shoulders.'
    },
    {
      title: 'Jumping Jacks',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jack.gif',
      sets: 3,
      reps: 30,
      description: 'Jump while spreading arms and legs, then return to standing position.'
    }
  ],
  friday: [
    {
      title: 'Burpees',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/burpee.gif',
      sets: 3,
      reps: 10,
      description: 'Combination of squat, push-up, and jump. Full body exercise.'
    },
    {
      title: 'Mountain Climbers',
      imageUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/mountain-climbers.gif',
      sets: 3,
      reps: 20,
      description: 'From plank position, alternate bringing knees to chest quickly.'
    }
  ],
  saturday: [
    {
      title: 'Gentle Stretching',
      imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1000&auto=format&fit=crop',
      sets: 1,
      reps: 10,
      description: 'Full body stretching routine, hold each stretch for 30 seconds.'
    },
    {
      title: 'Light Walking',
      imageUrl: 'https://images.unsplash.com/photo-1507120878965-54b2d3939100?q=80&w=1000&auto=format&fit=crop',
      sets: 1,
      reps: 20,
      description: 'Take a 20-minute walk at a comfortable pace.'
    }
  ],
  sunday: [
    {
      title: 'Your Choice',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
      sets: 3,
      reps: 10,
      description: 'Choose your own workout based on how you feel today.'
    }
  ]
};

const Workouts = () => {
  const [selectedDay, setSelectedDay] = useState('monday');
  
  // Check if user is logged in
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return <Navigate to="/auth" replace />;
  }

  const currentWorkouts = workouts[selectedDay as keyof typeof workouts] || [];
  
  // Array of days in order
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Get current day index
  const currentDayIndex = daysOrder.indexOf(selectedDay);
  
  // Handle navigation to previous day
  const handlePrevious = () => {
    if (currentDayIndex > 0) {
      setSelectedDay(daysOrder[currentDayIndex - 1]);
    } else {
      // Wrap around to the last day if at the beginning
      setSelectedDay(daysOrder[daysOrder.length - 1]);
    }
  };
  
  // Handle navigation to next day
  const handleNext = () => {
    if (currentDayIndex < daysOrder.length - 1) {
      setSelectedDay(daysOrder[currentDayIndex + 1]);
    } else {
      // Wrap around to the first day if at the end
      setSelectedDay(daysOrder[0]);
    }
  };

  return (
    <MobileLayout currentTab="workouts">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
            <p className="text-muted-foreground text-sm">Daily exercises to level up</p>
          </div>
          <Button size="sm" className="bg-solo-blue hover:bg-solo-blue/80">
            <Play size={16} className="mr-1" /> Start
          </Button>
        </div>
        
        <WorkoutDaySelector 
          currentDay={selectedDay} 
          onSelectDay={setSelectedDay} 
        />
        
        <div className="space-y-4 mt-6">
          {currentWorkouts.map((workout, index) => (
            <ExerciseCard 
              key={index}
              title={workout.title}
              imageUrl={workout.imageUrl}
              sets={workout.sets}
              reps={workout.reps}
              description={workout.description}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-solo-blue/50 text-solo-blue"
            onClick={handlePrevious}
          >
            <ArrowLeft size={16} className="mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-solo-blue/50 text-solo-blue"
            onClick={handleNext}
          >
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Workouts;
