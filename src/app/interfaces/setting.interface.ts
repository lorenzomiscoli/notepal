export interface Setting {
  id: number;
  theme: AppTheme,
  language: AppLanguage
}

export enum AppTheme {
  SYSTEM_DEFAULT = 'system-default',
  LIGHT_THEME = 'light',
  DARK_THEME = 'dark'
}

export enum AppLanguage {
  SYSTEM_DEFAULT = 'system-default',
  ENGLISH = 'en',
  ITALIAN = 'it'
}
