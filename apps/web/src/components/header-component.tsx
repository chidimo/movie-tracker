import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <Link to="/" className="flex items-center gap-2">
          <img
            className="h-8 w-8 rounded-md object-cover"
            src="/popcorn-time.png"
            alt=""
          />
          <span className="text-lg font-semibold tracking-tight">
            Popcorn
          </span>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}
