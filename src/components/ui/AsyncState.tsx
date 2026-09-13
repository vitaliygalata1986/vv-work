import { Icon } from './Icon'

export function RetryBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-line bg-white p-7 text-center md:p-10"
    >
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
        <Icon name="globe" className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-bold">Не вдалося завантажити дані</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Спробуйте ще раз. Ваші параметри пошуку збережено.
      </p>
      <button type="button" className="button-primary mt-5" onClick={onRetry}>
        Спробувати ще раз <Icon name="arrow" className="size-4" />
      </button>
    </div>
  )
}

export function SkeletonCards({
  count = 3,
  columns = false,
}: {
  count?: number
  columns?: boolean
}) {
  return (
    <div
      role="status"
      aria-label="Завантаження даних"
      className={`grid gap-4 ${columns ? 'lg:grid-cols-3' : ''}`}
    >
      <span className="sr-only">Завантажуємо дані…</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="rounded-2xl border border-line bg-white p-7 motion-safe:animate-pulse"
        >
          <div className="size-12 rounded-xl bg-brand-light" />
          <div className="mt-6 h-5 w-2/3 rounded bg-slate-100" />
          <div className="mt-4 h-3 w-full rounded bg-slate-100" />
          <div className="mt-3 h-3 w-4/5 rounded bg-slate-100" />
          <div className="mt-7 h-9 w-32 rounded-lg bg-brand-light" />
        </div>
      ))}
    </div>
  )
}
