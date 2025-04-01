
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    // Checking if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // If not logged in, let the Navigate component handle the redirect
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to auth page');
    } else {
      console.log('User already logged in, redirecting to dashboard');
    }
  }, []);

  // Check if user is logged in, redirect to dashboard if true, auth if false
  if (localStorage.getItem('isLoggedIn') === 'true') {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/auth" replace />;
  }
};

export default Index;
