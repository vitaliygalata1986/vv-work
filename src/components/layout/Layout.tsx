import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      target?.scrollIntoView({ block: hash === '#search' ? 'center' : 'start' })
      target?.querySelector('input')?.focus({ preventScroll: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, key])

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main-content" className="skip-link">
        Перейти до вмісту
      </a>
      <Header key={pathname} />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
