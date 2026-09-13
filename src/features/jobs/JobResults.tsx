import { memo } from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components/ui/Icon'
import { categories, type Partner } from '../../data/catalog'
import { countries, type Job } from './model'

const number = new Intl.NumberFormat('uk-UA')

const JobCard = memo(function JobCard({
  job,
  partner,
}: {
  job: Job
  partner?: Partner
}) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 md:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="text-xs text-muted">
            {partner?.name ?? 'VV Work'} <span aria-hidden="true">·</span>{' '}
            {categories.find((category) => category.id === job.category)?.name}
          </p>
          <h3 className="mt-2 text-xl leading-snug font-bold tracking-tight">
            {job.title}
          </h3>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-lg font-bold text-brand">
            {number.format(job.salaryMin)}–{number.format(job.salaryMax)} €
          </p>
          <p className="mt-1 text-[11px] text-muted">брутто / місяць</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" className="size-4" />
          {job.city}, {countries[job.country]}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="briefcase" className="size-4" />
          {job.schedule}
        </span>
        <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] text-brand">
          {job.experience}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{job.description}</p>
      <details className="mt-5 border-t border-line pt-4">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 text-xs font-bold text-ink [&::-webkit-details-marker]:hidden">
          Детальніше про вакансію <Icon name="chevron" className="size-4" />
        </summary>
        <div className="pt-3">
          <h4 className="text-sm font-bold">Що очікуємо</h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {job.requirements.map((requirement) => (
              <li key={requirement} className="flex gap-2">
                <Icon
                  name="check"
                  className="mt-1 size-4 shrink-0 text-brand"
                />
                {requirement}
              </li>
            ))}
          </ul>
          <Link
            className="button-primary mt-5 w-full sm:w-auto"
            to={`/контакти?job=${job.id}&partner=${job.partnerSlug}`}
          >
            Відгукнутися <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </details>
    </article>
  )
})

export const JobResults = memo(function JobResults({
  jobs,
  partners,
}: {
  jobs: readonly Job[]
  partners: readonly Partner[]
}) {
  if (!jobs.length)
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
        <Icon name="search" className="mx-auto size-9 text-brand" />
        <h3 className="mt-4 text-lg font-bold">Поки немає таких вакансій</h3>
        <p className="mx-auto mt-2 max-w-85 text-sm leading-6 text-muted">
          Спробуй іншу назву, категорію чи країну. Або скинь фільтри, щоб
          переглянути всі пропозиції.
        </p>
      </div>
    )
  return (
    <ul aria-label="Список вакансій" className="space-y-4">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard
            job={job}
            partner={partners.find(
              (partner) => partner.slug === job.partnerSlug,
            )}
          />
        </li>
      ))}
    </ul>
  )
})
