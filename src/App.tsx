
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Health from "./pages/Health";
import Profile from "./pages/Profile";
import DeviceSync from "./pages/DeviceSync";
import NotFound from "./pages/NotFound";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    // Check if we're using real Supabase credentials
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    setShowAlert(!hasSupabaseUrl || !hasSupabaseKey);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showAlert && (
            <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Running in development mode with placeholder Supabase credentials. 
                Check SUPABASE_SETUP.md for instructions on setting up real credentials.
              </AlertDescription>
            </Alert>
          )}
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/health" element={<Health />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/devices" element={<DeviceSync />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
