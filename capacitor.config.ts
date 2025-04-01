
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.efffcf51019f4dbdb704dfe36845d14c',
  appName: 'fitness-system-evolution',
  webDir: 'dist',
  server: {
    url: 'https://efffcf51-019f-4dbd-b704-dfe36845d14c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: "#000000"
  }
};

export default config;
