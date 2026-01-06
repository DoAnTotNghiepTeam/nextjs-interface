import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
export type Language = "en" | "vi" | "ko" | "jp";

interface PreferencesType {
  language: Language;
  theme: Theme;
  setLanguage?: (lang: Language) => void;
  setTheme?: (theme: Theme) => void;
}

export const PreferencesContext = createContext<PreferencesType | undefined>({
  language: "en",
  theme: "light",
});


export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

