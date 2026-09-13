import { Link } from 'react-router'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white py-9 md:py-12">
      <div className="page-container">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-70 text-sm leading-6 text-muted">
              Робота, що відкриває можливості. Знайомся з компаніями та знаходь
              свій напрям у Європі.
            </p>
          </div>
          <nav
            aria-label="Для кандидатів"
            className="flex flex-col items-start gap-2 text-sm"
          >
            <h2 className="mb-1 font-bold">Кандидатам</h2>
            <Link className="nav-link py-2 text-muted" to="/partners/vv-work">
              Усі вакансії
            </Link>
            <Link className="nav-link py-2 text-muted" to="/#partners">
              Компанії
            </Link>
            <Link className="nav-link py-2 text-muted" to="/контакти">
              Залишити заявку
            </Link>
          </nav>
          <nav
            aria-label="Для роботодавців"
            className="flex flex-col items-start gap-2 text-sm"
          >
            <h2 className="mb-1 font-bold">Роботодавцям</h2>
            <Link
              className="nav-link py-2 text-muted"
              to="/контакти?audience=employer"
            >
              Знайти працівників
            </Link>
            <Link className="nav-link py-2 text-muted" to="/контакти">
              Контакти
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} VV Work</span>
          <span>Демонстраційний проєкт. Компанії та вакансії вигадані.</span>
        </div>
      </div>
    </footer>
  )
}
