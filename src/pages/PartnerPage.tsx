import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { getPartnerPage } from '../api/catalog'
import { ApiError } from '../api/mockFetch'
import { RetryBlock, SkeletonCards } from '../components/ui/AsyncState'
import { Icon } from '../components/ui/Icon'
import { JobBrowser } from '../features/jobs/JobBrowser'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { NotFoundPage } from './PreviewPages'

function PartnerContent({ slug }: { slug: string }) {
  const load = useCallback(
    (signal: AbortSignal) => getPartnerPage(slug, signal),
    [slug],
  )
  const { state, retry } = useAsyncResource(load)
  if (
    state.status === 'error' &&
    state.error instanceof ApiError &&
    state.error.status === 404
  )
    return <NotFoundPage />

  return (
    <div className="page-container py-8 md:py-12">
      <title>
        {state.status === 'success'
          ? `${state.data.partner.name} — VV Work`
          : 'Вакансії — VV Work'}
      </title>
      <nav
        aria-label="Навігаційний шлях"
        className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted"
      >
        <Link className="nav-link" to="/">
          Головна
        </Link>
        <span aria-hidden="true">/</span>
        <Link className="nav-link" to="/#partners">
          Партнери
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {state.status === 'success'
            ? slug === 'vv-work'
              ? 'Усі вакансії'
              : state.data.partner.name
            : 'Вакансії'}
        </span>
      </nav>
      {state.status === 'loading' ? (
        <>
          <h1 className="sr-only">Завантаження вакансій</h1>
          <SkeletonCards count={3} />
        </>
      ) : state.status === 'error' ? (
        <>
          <h1 className="mb-6 text-3xl font-bold">Вакансії</h1>
          <RetryBlock onRetry={retry} />
        </>
      ) : (
        <>
          <header className="relative overflow-hidden rounded-3xl border border-brand/10 bg-brand-light p-6 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-22 -right-15 size-80 rounded-full border border-brand/10 before:absolute before:inset-10 before:rounded-full before:border before:border-brand/10"
            />
            <div className="relative flex flex-col items-start gap-5 md:flex-row md:gap-7">
              <span
                aria-hidden="true"
                className="flex size-18 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-extrabold tracking-tight text-brand"
              >
                {state.data.partner.initials}
              </span>
              <div>
                <p className="section-eyebrow">
                  {slug === 'vv-work'
                    ? 'ТВІЙ НАСТУПНИЙ КРОК'
                    : state.data.partner.industry}
                </p>
                <h1 className="mt-3 text-3xl leading-tight font-bold tracking-[-0.04em] md:text-[42px]">
                  {state.data.partner.name}
                </h1>
                <p className="mt-4 max-w-160 text-sm leading-6 text-muted">
                  {state.data.partner.description}
                </p>
              </div>
            </div>
          </header>
          <div className="mt-9 grid items-start gap-8 lg:mt-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
            <aside className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-base font-bold">
                {slug === 'vv-work' ? 'Про добірку' : 'Про роботодавця'}
              </h2>
              <p className="mt-4 text-xs font-semibold text-muted">
                Країни роботи
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                {state.data.partner.countries.map((country) => (
                  <li key={country} className="flex items-center gap-2 text-sm">
                    <Icon name="pin" className="size-4 text-brand" />
                    {country}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-xs leading-5 text-muted">
                Демонстраційні компанії та вакансії. Умови й зарплати наведено
                для прикладу.
              </p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-brand"
                to="/контакти"
              >
                Є запитання? <Icon name="northeast" className="size-4" />
              </Link>
            </aside>
            <JobBrowser jobs={state.data.jobs} partners={state.data.partners} />
          </div>
        </>
      )}
    </div>
  )
}

export function PartnerPage() {
  const { slug = '' } = useParams()
  return <PartnerContent key={slug} slug={slug} />
}
