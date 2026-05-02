import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.curryandburger.app',
  appName: 'Curry & Burger',
  webDir: 'out', // Standard Next.js static output directory, though not used primarily when Server URL is set
  server: {
    url: 'https://curryandburger.vercel.app',
    cleartext: true
  },
  ios: {
    // 'never' = let CSS/WebView own safe area insets via env() — do NOT let Capacitor override them.
    // Using 'always' would cause Capacitor to zero-out the insets, breaking env(safe-area-inset-*).
    contentInset: 'never',
  },
};

export default config;
