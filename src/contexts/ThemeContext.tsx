import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// CSS Variables for theming
const themes = {
  dark: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#0a0a0a',
    '--bg-tertiary': 'rgba(255, 255, 255, 0.03)',
    '--bg-hover': 'rgba(255, 255, 255, 0.05)',
    '--bg-card': 'rgba(255, 255, 255, 0.02)',
    '--border-primary': 'rgba(255, 255, 255, 0.1)',
    '--border-secondary': 'rgba(255, 255, 255, 0.08)',
    '--border-hover': 'rgba(255, 255, 255, 0.2)',
    '--text-primary': '#ffffff',
    '--text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--text-muted': 'rgba(255, 255, 255, 0.5)',
    '--text-subtle': 'rgba(255, 255, 255, 0.3)',
    '--accent-primary': '#ffffff',
    '--accent-secondary': 'rgba(255, 255, 255, 0.8)',
    '--overlay': 'rgba(0, 0, 0, 0.9)',
    '--shadow': '0 4px 24px rgba(0, 0, 0, 0.4)',
    '--input-bg': 'rgba(255, 255, 255, 0.05)',
    '--success': '#22c55e',
    '--warning': '#fbbf24',
    '--error': '#ef4444',
    '--info': '#60a5fa'
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#fafafa',
    '--bg-tertiary': '#f5f5f5',
    '--bg-hover': '#f0f0f0',
    '--bg-card': '#ffffff',
    '--border-primary': 'rgba(0, 0, 0, 0.1)',
    '--border-secondary': 'rgba(0, 0, 0, 0.06)',
    '--border-hover': 'rgba(0, 0, 0, 0.15)',
    '--text-primary': '#000000',
    '--text-secondary': 'rgba(0, 0, 0, 0.7)',
    '--text-muted': 'rgba(0, 0, 0, 0.5)',
    '--text-subtle': 'rgba(0, 0, 0, 0.3)',
    '--accent-primary': '#000000',
    '--accent-secondary': 'rgba(0, 0, 0, 0.8)',
    '--overlay': 'rgba(0, 0, 0, 0.5)',
    '--shadow': '0 4px 24px rgba(0, 0, 0, 0.1)',
    '--input-bg': '#f5f5f5',
    '--success': '#16a34a',
    '--warning': '#ca8a04',
    '--error': '#dc2626',
    '--info': '#2563eb'
  }
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('kobys-theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    // Default to dark (brand preference)
    return 'dark'
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    // Apply CSS variables
    const themeVars = themes[theme]
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Add theme class to body
    document.body.classList.remove('theme-dark', 'theme-light')
    document.body.classList.add(`theme-${theme}`)

    // Store preference
    localStorage.setItem('kobys-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
