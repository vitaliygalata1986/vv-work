import { Link } from 'react-router'
import { Icon } from '../../components/ui/Icon'

const steps = [
  {
    number: '01',
    title: 'Розкажіть про команду',
    description: 'Яких спеціалістів шукаєте та що пропонуєте.',
  },
  {
    number: '02',
    title: 'Познайомтеся з кандидатами',
    description: 'Знайдіть людей із потрібним досвідом і мотивацією.',
  },
  {
    number: '03',
    title: 'Почніть працювати разом',
    description: 'Обговоріть умови та домовтеся про наступний крок.',
  },
]

export function EmployersSection() {
  return (
    <section
      id="employers"
      aria-labelledby="employers-title"
      className="page-container section-spacing"
    >
      <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-9 text-white md:p-10 lg:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-35 size-110 rounded-full border border-white/10 before:absolute before:inset-12 before:rounded-full before:border before:border-white/10 after:absolute after:inset-24 after:rounded-full after:border after:border-white/10"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-blue-100">
              ДЛЯ РОБОТОДАВЦІВ
            </p>
            <h2
              id="employers-title"
              className="mt-4 text-[32px] leading-[1.15] font-bold tracking-[-0.04em] md:text-[42px] lg:text-[46px]"
            >
              Потрібні працівники?
              <br />
              <span className="text-blue-100">Почнімо з вашої команди.</span>
            </h2>
            <p className="mt-5 max-w-95 text-sm leading-6 text-blue-100">
              З’єднуємо компанії з людьми, які хочуть працювати. Розкажіть про
              свої потреби — зробімо перший крок разом.
            </p>
            <Link
              to="/контакти?audience=employer"
              className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-4 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand transition-colors hover:bg-blue-50 sm:w-auto"
            >
              Знайти працівника <Icon name="northeast" className="size-4" />
            </Link>
          </div>
          <ol className="flex flex-col justify-center divide-y divide-white/20">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex gap-4 py-6 first:pt-0 last:pb-0 lg:gap-5"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs font-semibold"
                >
                  {step.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold md:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-75 text-xs leading-5 text-blue-100">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
