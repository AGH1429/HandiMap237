import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  theme: {
    bg: '#f0f4ff',
    cardBg: '#ffffff',
    text: '#1a2d6e',
    subtext: '#666',
  }
});

export function ThemeProvider({ children }: any) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? '#1a1a2e' : '#f0f4ff',
    cardBg: darkMode ? '#16213e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#1a2d6e',
    subtext: darkMode ? '#a0a0b0' : '#666',
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode(!darkMode), theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}