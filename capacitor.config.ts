import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lorenzomiscoli.notepal',
  appName: 'Notepal',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_name",
      iconColor: "#ff9301",
      sound: "beep.wav",
    },
  }
};

export default config;
