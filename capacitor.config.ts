import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sgacedom.app',
  appName: 'SGACEDOM App',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  },  
  bundledWebRuntime: false,
/*  server: {
    cleartext: true
  },*/
  server: {
    hostname: '127.0.0.1',
    cleartext: false,
    allowNavigation: ['*'],
  },  
  ios: {
    handleApplicationNotifications: false
  }  
};
export default config;
