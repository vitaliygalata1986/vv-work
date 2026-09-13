import { Link } from 'react-router'

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="VV Work — головна"
      className="inline-flex shrink-0 items-center gap-2.5 text-[25px] font-extrabold tracking-[-1.3px]"
    >
      <svg
        viewBox="0 0 40 32"
        fill="none"
        className="h-8 w-10 text-brand"
        aria-hidden="true"
      >
        <path
          d="m3 5 10 23L23 5M18 5l10 23L38 5"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        work<span className="text-brand">.</span>
      </span>
    </Link>
  )
}
