import { Link } from 'react-router'
import { Icon } from '../components/ui/Icon'
import { CareerIllustration } from '../features/home/CareerIllustration'
import { HeroSearch } from '../features/search/HeroSearch'

const benefits = [
  {
    icon: 'globe',
    title: 'Європа можливостей',
    text: 'Знаходь роботу в країні, що підходить тобі.',
  },
  {
    icon: 'briefcase',
    title: 'Різні професії. Спільна мета.',
    text: 'Від першого досвіду до нового етапу кар’єри.',
  },
  {
    icon: 'people',
    title: 'Прямий шлях до роботодавця',
    text: 'Обирай компанію та розповідай про себе.',
  },
] as const

export function HomePage() {
  return (
    <>
      <title>VV Work — твоя робота в Європі</title>
      <section
        className="page-container pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-18"
        aria-labelledby="hero-title"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="relative z-10">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3 py-2 text-[11px] font-semibold">
              <span className="flex size-4 items-center justify-center rounded-full bg-brand-light text-brand">
                <Icon name="check" className="size-3" />
              </span>{' '}
              Твій новий початок — у Європі
            </p>
            <h1 id="hero-title" className="hero-title">
              Робота, що
              <br />
              відкриває
              <br />
              <span className="text-brand">
                можливості<span className="text-ink">.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-105 text-base leading-7 text-muted">
              Знайди своє місце в Європі. Обирай роботу,
              <br className="hidden sm:block" /> знайомся з роботодавцями та
              рухайся вперед.
            </p>
            <HeroSearch />
            <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              Шукаєте людей у свою команду?{' '}
              <Link
                to="/контакти?audience=employer"
                className="inline-flex min-h-9 items-center gap-1.5 font-bold text-ink hover:text-brand"
              >
                Вам сюди <Icon name="northeast" className="size-3.5" />
              </Link>
            </p>
          </div>
          <CareerIllustration />
        </div>
      </section>
      <section
        aria-label="Можливості платформи"
        className="border-t border-line bg-white/60"
      >
        <div className="page-container grid gap-7 py-9 md:grid-cols-3 md:gap-8 md:py-10">
          {benefits.map(({ icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon name={icon} />
              </span>
              <div>
                <h2 className="text-sm font-bold">{title}</h2>
                <p className="mt-2 max-w-65 text-xs leading-5 text-muted">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
