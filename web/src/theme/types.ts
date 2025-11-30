export type Theme = "dark" | "light" | "system";

export type ThemeProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
