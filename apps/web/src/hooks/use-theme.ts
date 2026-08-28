import { useCallback, useEffect, useState } from 'react'
import type { Theme } from '@/lib/theme'
import { getStoredTheme, setStoredTheme } from '@/lib/theme'

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    setThemeState(getStoredTheme())
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setStoredTheme(next)
    setThemeState(next)
  }, [])

  return [theme, setTheme]
}
