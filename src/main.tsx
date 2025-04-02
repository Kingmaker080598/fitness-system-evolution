
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for offline support
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('Service worker registered successfully:', registration.scope);
      
      // Check if there's a waiting service worker
      if (registration.waiting) {
        // New content is available, but the user must reload to see it
        console.log('New service worker waiting');
      }
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content is available, please refresh.');
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Initialize the app
const initialize = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  registerServiceWorker();
};

initialize();
