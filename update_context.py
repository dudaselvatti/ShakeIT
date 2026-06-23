import re

with open('src/contexts/ThemeContext.tsx', 'r') as f:
    content = f.read()

# Add isScratchMode to ThemeContextData
content = content.replace('  toggleTheme: () => void;\n}', '  toggleTheme: () => void;\n  isScratchMode: boolean;\n  toggleScratchMode: () => void;\n}')

# Add THEME_STORAGE_KEY
content = content.replace('const THEME_STORAGE_KEY = "@ShakeIT:theme_mode";', 'const THEME_STORAGE_KEY = "@ShakeIT:theme_mode";\nconst SCRATCH_STORAGE_KEY = "@ShakeIT:scratch_mode";')

# Add isScratchMode state
content = content.replace('const [isDark, setIsDark] = useState(false);', 'const [isDark, setIsDark] = useState(false);\n  const [isScratchMode, setIsScratchMode] = useState(false);')

# Load
load_theme_str = """      if (storedTheme !== null) {
        setIsDark(storedTheme === "dark");
      }"""
load_scratch_str = """      if (storedTheme !== null) {
        setIsDark(storedTheme === "dark");
      }
      const storedScratch = await AsyncStorage.getItem(SCRATCH_STORAGE_KEY);
      if (storedScratch !== null) {
        setIsScratchMode(storedScratch === "true");
      }"""
content = content.replace(load_theme_str, load_scratch_str)

# Toggle
toggle_str = """  const toggleTheme = async () => {
    try {
      const newMode = !isDark;
      setIsDark(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };"""
toggle_scratch_str = toggle_str + """

  const toggleScratchMode = async () => {
    try {
      const newMode = !isScratchMode;
      setIsScratchMode(newMode);
      await AsyncStorage.setItem(SCRATCH_STORAGE_KEY, newMode ? "true" : "false");
    } catch (error) {
      console.error("Failed to save scratch preference", error);
    }
  };"""
content = content.replace(toggle_str, toggle_scratch_str)

# Provider
content = content.replace('<ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>', '<ThemeContext.Provider value={{ theme, isDark, toggleTheme, isScratchMode, toggleScratchMode }}>')

with open('src/contexts/ThemeContext.tsx', 'w') as f:
    f.write(content)

