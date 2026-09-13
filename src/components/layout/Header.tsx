import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'

const navigation = [
  { to: '/#search', label: 'Знайти роботу' },
  { to: '/partners/vv-work', label: 'Партнери' },
  { to: '/контакти', label: 'Контакти' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <header
      className="relative z-20 border-b border-line bg-white"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false)
          toggleRef.current?.focus()
        }
      }}
    >
      <div className="page-container flex h-20 items-center justify-between gap-8 md:h-24">
        <Logo />
        <nav
          aria-label="Головна навігація"
          className="hidden items-center gap-9 text-sm font-semibold md:flex"
        >
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'text-brand' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/контакти?audience=employer"
          className="button-outline hidden md:inline-flex"
        >
          Знайти працівника <Icon name="northeast" className="size-4" />
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-11 items-center justify-center rounded-xl border border-line md:hidden"
        >
          <Icon name={isOpen ? 'close' : 'menu'} />
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Мобільна навігація"
        hidden={!isOpen}
        className="absolute inset-x-0 top-full border-b border-line bg-white px-5 pb-6 shadow-lg md:hidden"
      >
        {navigation.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-3.5 text-sm font-semibold hover:bg-surface"
          >
            {label}
          </Link>
        ))}
        <Link
          to="/контакти?audience=employer"
          onClick={() => setIsOpen(false)}
          className="button-primary mt-3 w-full"
        >
          Знайти працівника <Icon name="northeast" className="size-4" />
        </Link>
      </nav>
    </header>
  )
}
