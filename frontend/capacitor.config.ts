import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.realtor.app',
  appName: 'realtor',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    url: 'http://10.0.0.189:5173',
    cleartext: true
  }
};

export default config;
