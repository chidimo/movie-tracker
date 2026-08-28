import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import type { Theme } from '@/lib/theme'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

const order: Array<Theme> = ['light', 'dark', 'system']
const label: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme()
  const next = order[(order.indexOf(theme) + 1) % order.length]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      title={`Theme: ${label[theme]} (click for ${label[next]})`}
      aria-label={`Switch theme, currently ${label[theme]}`}
    >
      {theme === 'light' && <SunIcon className="h-5 w-5" />}
      {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
      {theme === 'system' && <ComputerDesktopIcon className="h-5 w-5" />}
    </Button>
  )
}
