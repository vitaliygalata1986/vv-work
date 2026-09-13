import type { CategoryId } from '../../data/catalog'

export const countries = {
  pl: 'Польща',
  de: 'Німеччина',
  cz: 'Чехія',
  nl: 'Нідерланди',
} as const
export type CountryCode = keyof typeof countries

export interface Job {
  id: string
  partnerSlug: string
  title: string
  category: CategoryId
  country: CountryCode
  city: string
  salaryMin: number
  salaryMax: number
  experience: string
  description: string
  schedule: string
  requirements: string[]
}

export interface JobFilters {
  query: string
  category: string
  country: string
}

export function filterJobs(
  jobs: readonly Job[],
  filters: JobFilters,
): readonly Job[] {
  const query = filters.query.trim().normalize('NFKC').toLocaleLowerCase('uk')
  return jobs.filter(
    (job) =>
      (!query ||
        job.title.normalize('NFKC').toLocaleLowerCase('uk').includes(query)) &&
      (!filters.category || job.category === filters.category) &&
      (!filters.country || job.country === filters.country),
  )
}
