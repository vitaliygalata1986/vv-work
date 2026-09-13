import type { SVGProps } from 'react'

const paths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  northeast: 'M6 18 18 6M6 6h12v12',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  chevron: 'm6 9 6 6 6-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  briefcase: 'M8 6V4h8v2M3 7h18v14H3ZM3 12l9 3 9-3M12 12v5',
  hardhat: 'M3 16a9 9 0 0 1 6-8M15 8a9 9 0 0 1 6 8M9 12V5h6v7M2 16h20v4H2Z',
  factory: 'M3 21V10l6 4v-4l6 4V3h4l2 18ZM6 17v1m5-1v1m5-1v1',
  package: 'm3 7 9-5 9 5v10l-9 5-9-5Zm0 0 9 5 9-5M12 12v10M7.5 4.5l9 5',
  utensils: 'M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 21V3c-4 2-5 6-5 10h5',
  monitor: 'M2 3h20v14H2ZM8 21h8M12 17v4m-4-14-3 3 3 3m8-6 3 3-3 3',
  truck:
    'M1 3h13v14H1ZM14 8h4l4 5v4h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  globe:
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18',
  people:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87',
} as const

export type IconName = keyof typeof paths
type IconProps = SVGProps<SVGSVGElement> & { name: IconName }

export function Icon({ name, className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  )
}
