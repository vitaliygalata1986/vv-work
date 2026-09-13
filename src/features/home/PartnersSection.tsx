import { Link } from 'react-router'
import { Icon } from '../../components/ui/Icon'
import { getPartners } from '../../api/catalog'
import { useAsyncResource } from '../../hooks/useAsyncResource'
import { RetryBlock, SkeletonCards } from '../../components/ui/AsyncState'

const logoStyles = [
  'bg-[#eaf0ff] text-[#284ca9]',
  'bg-[#eef2e5] text-[#56633a]',
  'bg-[#f9ece6] text-[#a4583b]',
] as const

export function PartnersSection() {
  const { state, retry } = useAsyncResource(getPartners)
  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="scroll-mt-8 border-y border-line bg-white"
    >
      <div className="page-container section-spacing">
        <p className="section-eyebrow">ЛЮДИ. КОМАНДИ. МОЖЛИВОСТІ.</p>
        <div className="section-heading-row">
          <h2 id="partners-title" className="section-title">
            Знайомся з роботодавцями.
          </h2>
          <p className="max-w-82 text-sm leading-6 text-muted">
            Дізнайся більше про компанію, перш ніж зробити наступний крок.
          </p>
        </div>
        <div className="mt-8 lg:mt-10">
          {state.status === 'loading' ? (
            <SkeletonCards columns />
          ) : state.status === 'error' ? (
            <RetryBlock onRetry={retry} />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-3 lg:gap-5">
              {state.data.map((partner, index) => (
                <li key={partner.slug}>
                  <Link
                    to={`/partners/${partner.slug}`}
                    className="partner-card group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className={`flex size-15 items-center justify-center rounded-2xl text-2xl font-extrabold tracking-tight ${logoStyles[index % logoStyles.length]}`}
                      >
                        {partner.initials}
                      </span>
                      <Icon
                        name="northeast"
                        className="mt-1 size-5 text-muted transition-colors group-hover:text-brand"
                      />
                    </div>
                    <p className="mt-6 text-[11px] font-medium text-muted">
                      {partner.industry}
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight">
                      {partner.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                      {partner.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {partner.countries.map((country) => (
                        <span
                          key={country}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1.5 text-[11px] text-muted"
                        >
                          <Icon name="pin" className="size-3" />
                          {country}
                        </span>
                      ))}
                    </div>
                    <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs font-bold text-brand">
                      Про компанію <Icon name="arrow" className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">
          Демонстраційні компанії для ознайомлення з платформою.
        </p>
      </div>
    </section>
  )
}
