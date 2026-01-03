import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.japs.virtuallab',
  appName: 'virtual_lab_kehutanan',
  webDir: 'dist',
  server: {
    androidScheme: 'https' // <--- TAMBAHKAN INI
  }
};

export default config;
