import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeType, lightTheme, darkTheme } from "../styles/theme";

interface ThemeContextData {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  isScratchMode: boolean;
  toggleScratchMode: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = "@ShakeIT:theme_mode";
const SCRATCH_STORAGE_KEY = "@ShakeIT:scratch_mode";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isScratchMode, setIsScratchMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme !== null) {
        setIsDark(storedTheme === "dark");
      }
      const storedScratch = await AsyncStorage.getItem(SCRATCH_STORAGE_KEY);
      if (storedScratch !== null) {
        setIsScratchMode(storedScratch === "true");
      }
    } catch (error) {
      console.error("Failed to load theme preference", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDark;
      setIsDark(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  const toggleScratchMode = async () => {
    try {
      const newMode = !isScratchMode;
      setIsScratchMode(newMode);
      await AsyncStorage.setItem(SCRATCH_STORAGE_KEY, newMode ? "true" : "false");
    } catch (error) {
      console.error("Failed to save scratch preference", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isScratchMode, toggleScratchMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  return useContext(ThemeContext);
};
