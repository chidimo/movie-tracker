import { Link } from '@tanstack/react-router'

const Avatar = () => {
  return (
    <Link to={'/'} className="-">
      <span className="sr-only">Chidi Orji - Movie Tracker</span>
      <img
        className="h-10 w-auto rounded full"
        src="/movie-tracker.png"
        alt=""
      />
    </Link>
  )
}

export const Header = () => {
  return (
    <header className="bg-blue-900">
      <nav
        className="mx-auto flex items-center justify-between py-6 px-4 md:px-20"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Avatar />
        </div>
      </nav>
    </header>
  )
}
