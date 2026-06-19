import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ isDark: true, toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}