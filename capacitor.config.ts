import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.curryandburger.app',
  appName: 'Curry & Burger',
  webDir: 'out', // Standard Next.js static output directory, though not used primarily when Server URL is set
  server: {
    url: 'https://curryandburger.vercel.app',
    cleartext: true
  },
  bundledWebRuntime: false,
  ios: {
    contentInset: 'never',
  },
};

export default config;
