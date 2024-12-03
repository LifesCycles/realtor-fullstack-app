import { CapacitorConfig } from '@capacitor/cli';
import * as os from 'os';

// Function to get the local IP address for wireless development
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  
  // Specifically look for Wireless LAN adapter Wi-Fi
  const wifiInterfaces = Object.keys(interfaces)
    .filter(name => name.toLowerCase().includes('wi-fi'));
  
  for (const devName of wifiInterfaces) {
    const iface = interfaces[devName];
    if (!iface) continue;
    
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  
  // Fallback to localhost if no Wi-Fi IP found
  return 'localhost';
}

// Attempt to get local IP
const localIP = getLocalIP();
console.log('Detected Local IP for Capacitor:', localIP);

const config: CapacitorConfig = {
  appId: 'com.realtor.app',
  appName: 'realtor',
  webDir: 'dist',
  server: {
    // Use detected IP with explicit logging
    url: localIP === 'localhost' 
      ? 'http://localhost:5173' 
      : `http://${localIP}:5173`,
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    // Additional debug configuration
    allowNavigation: [
      'http://localhost:5173'
    ]
  }
};

export default config;
