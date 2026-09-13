import { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getPartnerPage } from '../api/catalog'
import { ApiError } from '../api/mockFetch'
import { RetryBlock, SkeletonCards } from '../components/ui/AsyncState'
import { Icon } from '../components/ui/Icon'
import { ApplicationForm } from '../features/applications/ApplicationForm'
import { useAsyncResource } from '../hooks/useAsyncResource'

function VacancyApplication({
  jobId,
  partnerSlug,
}: {
  jobId: string
  partnerSlug: string
}) {
  const load = useCallback(
    (signal: AbortSignal) => getPartnerPage(partnerSlug, signal),
    [partnerSlug],
  )
  const { state, retry } = useAsyncResource(load)
  if (state.status === 'loading') return <SkeletonCards count={1} />
  if (
    state.status === 'error' &&
    !(state.error instanceof ApiError && state.error.status === 404)
  )
    return <RetryBlock onRetry={retry} />
  const job =
    state.status === 'success'
      ? state.data.jobs.find((item) => item.id === jobId)
      : undefined
  if (!job)
    return (
      <div role="alert" className="rounded-3xl border border-line bg-white p-8">
        <h2 className="text-xl font-bold">Вакансію не знайдено</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Обери вакансію зі списку або надішли загальне звернення.
        </p>
        <Link className="button-primary mt-5" to="/контакти">
          Загальне звернення <Icon name="arrow" />
        </Link>
      </div>
    )
  return (
    <ApplicationForm
      context={{
        audience: 'candidate',
        jobId: job.id,
        partnerSlug: job.partnerSlug,
        jobTitle: job.title,
      }}
    />
  )
}

export function ContactsPage() {
  const [params] = useSearchParams()
  const audience =
    params.get('audience') === 'employer' ? 'employer' : 'candidate'
  const jobId = params.get('job') ?? ''
  const partnerSlug = params.get('partner') || 'vv-work'
  const isEmployer = audience === 'employer'

  return (
    <div className="page-container py-8 md:py-12">
      <title>Контакти — VV Work</title>
      <nav
        aria-label="Навігаційний шлях"
        className="mb-8 flex gap-2 text-xs text-muted"
      >
        <Link className="nav-link" to="/">
          Головна
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Контакти</span>
      </nav>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="py-2 lg:py-6">
          <p className="section-eyebrow">НА ЗВ’ЯЗКУ З ТОБОЮ</p>
          <h1 className="mt-4 max-w-130 text-4xl leading-[1.12] font-bold tracking-[-0.045em] md:text-5xl">
            {isEmployer ? (
              <>
                Знайдемо людей
                <br />у твою <span className="text-brand">команду.</span>
              </>
            ) : (
              <>
                Нові можливості
                <br />
                починаються
                <br />з <span className="text-brand">розмови.</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-110 text-sm leading-7 text-muted">
            {isEmployer
              ? 'Розкажи, яких фахівців потребує твій бізнес. Почнімо з країни, кількості працівників та умов роботи.'
              : 'Маєш запитання про роботу в Європі? Розкажи про себе, свій досвід і побажання — усе важливе в одній заявці.'}
          </p>
          <nav aria-label="Тип звернення" className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/контакти"
              aria-current={!isEmployer ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-xl border px-4 text-xs font-bold ${!isEmployer ? 'border-brand bg-brand-light text-brand' : 'border-line bg-white hover:border-brand'}`}
            >
              Шукаю роботу
            </Link>
            <Link
              to="/контакти?audience=employer"
              aria-current={isEmployer ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-xl border px-4 text-xs font-bold ${isEmployer ? 'border-brand bg-brand-light text-brand' : 'border-line bg-white hover:border-brand'}`}
            >
              Шукаю працівників
            </Link>
          </nav>
          <aside className="mt-9 rounded-2xl bg-brand-light p-6 md:p-7">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand">
              <Icon name={isEmployer ? 'people' : 'briefcase'} />
            </span>
            <h2 className="mt-4 text-lg font-bold">
              {isEmployer
                ? 'Хороша команда починається з деталей'
                : 'Уже знаєш, яка робота тобі підходить?'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {isEmployer
                ? 'Вкажи посаду, графік і вимоги до досвіду в повідомленні. Так запит буде зрозумілим із першого знайомства.'
                : 'Обери пропозицію в каталозі та натисни «Відгукнутися». Вакансія автоматично додасться до заявки.'}
            </p>
            <Link
              to="/partners/vv-work"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand"
            >
              Переглянути вакансії <Icon name="arrow" className="size-4" />
            </Link>
          </aside>
        </div>
        {jobId && !isEmployer ? (
          <VacancyApplication
            key={`${jobId}:${partnerSlug}`}
            jobId={jobId}
            partnerSlug={partnerSlug}
          />
        ) : (
          <ApplicationForm key={audience} context={{ audience }} />
        )}
      </div>
    </div>
  )
}
