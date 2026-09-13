import { Icon } from '../../components/ui/Icon'

export function CareerIllustration() {
  return (
    <div className="career-illustration" aria-hidden="true">
      <div className="absolute top-7 left-7 flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-brand">
        <span className="size-1.5 rounded-full bg-brand" /> ТВОЄ МАЙБУТНЄ БЛИЖЧЕ
      </div>
      <div className="globe-art">
        <svg viewBox="0 0 360 360" className="size-full" fill="none">
          <circle cx="180" cy="180" r="163" fill="#e2eaff" stroke="#b7c9f6" />
          <ellipse cx="180" cy="180" rx="100" ry="163" stroke="#b7c9f6" />
          <ellipse cx="180" cy="180" rx="40" ry="163" stroke="#b7c9f6" />
          <ellipse cx="180" cy="180" rx="163" ry="61" stroke="#b7c9f6" />
          <path
            d="M17 180h326M44 91h272M44 269h272M180 17v326"
            stroke="#b7c9f6"
          />
          <path
            d="M88 246C65 180 194 240 194 164S270 58 283 117"
            stroke="#2756ed"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
          <circle
            cx="88"
            cy="246"
            r="6"
            fill="#2756ed"
            stroke="white"
            strokeWidth="3"
          />
          <circle
            cx="283"
            cy="117"
            r="6"
            fill="#2756ed"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>
      <div className="country-tag top-[24%] left-[4%]">
        <span className="flag flag-pl" /> Польща{' '}
        <span className="ml-2 text-brand">↗</span>
      </div>
      <div className="country-tag top-[30%] right-[2%] sm:top-[18%] lg:top-[35%]">
        <span className="flag flag-de" /> Німеччина{' '}
        <span className="ml-2 text-brand">↗</span>
      </div>
      <div className="country-tag top-[40%] left-[6%] sm:top-[52%] lg:top-[46%]">
        <span className="flag flag-cz" /> Чехія{' '}
        <span className="ml-2 text-brand">↗</span>
      </div>
      <div className="career-ticket">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.15em] text-blue-100">
            ТВІЙ НАСТУПНИЙ КРОК
          </span>
          <Icon name="northeast" className="size-5" />
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-[26px] leading-[1.18] font-semibold tracking-[-1px]">
            Нова робота.
            <br />
            Нові можливості.
          </p>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-white/25 pt-3 text-[10px] text-blue-100">
          <span className="size-1.5 rounded-full bg-lime-300" /> Твій досвід має
          значення
        </div>
      </div>
      <div className="absolute right-6 bottom-5 text-[10px] font-semibold tracking-[0.14em] text-muted">
        VV WORK / EUROPE
      </div>
    </div>
  )
}
