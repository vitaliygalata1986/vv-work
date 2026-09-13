import { Link } from 'react-router'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-line bg-white py-8">
      <div className="page-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Logo />
          <p className="text-sm text-muted">Робота, що відкриває можливості.</p>
        </div>
        <div className="flex items-center justify-between gap-8 text-xs text-muted">
          <span>© {new Date().getFullYear()} VV Work</span>
          <Link to="/контакти" className="nav-link">
            Зв’язатися з нами <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
