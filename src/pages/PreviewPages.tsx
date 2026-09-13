import { Link, useSearchParams } from 'react-router'
import { Icon } from '../components/ui/Icon'

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

export function ContactsPage() {
  const [params] = useSearchParams()
  const isEmployer = params.get('audience') === 'employer'
  return (
    <PreviewPage
      title={isEmployer ? 'Знайдемо людей у вашу команду' : 'Будьмо на зв’язку'}
      description="Сторінка контактів готується. Форма заявки поки недоступна."
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
