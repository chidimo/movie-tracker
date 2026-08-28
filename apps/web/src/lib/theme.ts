export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

export function getStoredTheme(): Theme {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (t === 'light' || t === 'dark' || t === 'system') return t
  } catch {
    // ignore
  }
  return 'system'
}

export function systemPrefersDark(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme
}

/** Apply the resolved theme to <html> (adds/removes the `.dark` class). */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', resolveTheme(theme) === 'dark')
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore
  }
  applyTheme(theme)
}

/** Run once at startup, before React renders, to avoid a flash of the wrong theme. */
export function initTheme(): void {
  applyTheme(getStoredTheme())
  if (typeof globalThis.matchMedia === 'function') {
    globalThis
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (getStoredTheme() === 'system') applyTheme('system')
      })
  }
}
