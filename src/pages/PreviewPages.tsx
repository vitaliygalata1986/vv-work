import { Link, useParams, useSearchParams } from 'react-router'
import { Icon } from '../components/ui/Icon'
import { categories, featuredPartners } from '../data/catalog'

function PreviewPage({
  title,
  description,
  details,
}: {
  title: string
  description: string
  details?: string
}) {
  return (
    <section className="page-container py-20 md:py-28">
      <title>{title} — VV Work</title>
      <p className="mb-5 text-xs font-bold tracking-widest text-brand">
        VV WORK · ПОПЕРЕДНІЙ ПЕРЕГЛЯД
      </p>
      <h1 className="max-w-190 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-150 leading-7 text-muted">{description}</p>
      {details ? (
        <p className="mt-5 max-w-150 rounded-xl border border-line bg-white p-4 text-sm wrap-anywhere">
          {details}
        </p>
      ) : null}
      <Link to="/" className="button-primary mt-8">
        На головну <Icon name="arrow" />
      </Link>
    </section>
  )
}

// Route shells for the visual milestone. API, vacancies and the application form follow next.
export function PartnerPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const query = params.get('q')?.trim()
  const country = params.get('country')
  const category = categories.find((item) => item.id === params.get('category'))
  const partner = featuredPartners.find((item) => item.slug === slug)
  const countryLabels: Record<string, string> = {
    pl: 'Польща',
    de: 'Німеччина',
    cz: 'Чехія',
    nl: 'Нідерланди',
  }

  if (slug !== 'vv-work' && !partner) return <NotFoundPage />

  return (
    <PreviewPage
      title={partner?.name ?? 'Твоя наступна робота — тут'}
      description="Тут буде сторінка роботодавця зі списком вакансій, пошуком і фільтрами. Параметри з головної вже передаються — наповнення додамо наступним кроком."
      details={`Партнер: ${partner?.name ?? 'VV Work'}. Пошук: ${query || 'усі вакансії'}. Країна: ${countryLabels[country ?? ''] ?? 'Уся Європа'}. Категорія: ${category?.name ?? 'усі напрями'}.`}
    />
  )
}

export function ContactsPage() {
  const [params] = useSearchParams()
  const isEmployer = params.get('audience') === 'employer'
  return (
    <PreviewPage
      title={isEmployer ? 'Знайдемо людей у вашу команду' : 'Будьмо на зв’язку'}
      description="Сторінка контактів підготовлена. На наступному етапі тут з’явиться форма заявки з перевіркою даних та станами відправлення."
    />
  )
}

export function NotFoundPage() {
  return (
    <PreviewPage
      title="Такої сторінки немає"
      description="Можливо, у посиланні є помилка. Повернися на головну, щоб продовжити пошук."
    />
  )
}
