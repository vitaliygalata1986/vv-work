import { categories, type Partner } from '../data/catalog'
import { countries, type Job } from '../features/jobs/model'
import { ApiError, mockFetch } from './mockFetch'

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item: unknown) => typeof item === 'string')

function parsePartners(value: unknown): Partner[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item: unknown): item is Partner =>
        record(item) &&
        ['slug', 'name', 'initials', 'industry', 'description'].every(
          (key) => typeof item[key] === 'string',
        ) &&
        strings(item.countries),
    )
  )
    throw new ApiError('Некоректні дані компаній. Спробуйте ще раз.')
  return value
}

function parseJobs(value: unknown): Job[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item: unknown): item is Job =>
        record(item) &&
        [
          'id',
          'partnerSlug',
          'title',
          'city',
          'experience',
          'description',
          'schedule',
        ].every((key) => typeof item[key] === 'string') &&
        categories.some((category) => category.id === item.category) &&
        typeof item.country === 'string' &&
        Object.hasOwn(countries, item.country) &&
        typeof item.salaryMin === 'number' &&
        Number.isFinite(item.salaryMin) &&
        item.salaryMin >= 0 &&
        typeof item.salaryMax === 'number' &&
        Number.isFinite(item.salaryMax) &&
        item.salaryMax >= item.salaryMin &&
        strings(item.requirements),
    )
  )
    throw new ApiError('Некоректні дані вакансій. Спробуйте ще раз.')
  return value
}

export const getPartners = (signal: AbortSignal) =>
  mockFetch('partners.json', parsePartners, signal)
export const getJobs = (signal: AbortSignal) =>
  mockFetch('jobs.json', parseJobs, signal)

export async function getPartnerPage(slug: string, signal: AbortSignal) {
  const [partners, jobs] = await Promise.all([
    getPartners(signal),
    getJobs(signal),
  ])
  const partner: Partner | undefined =
    slug === 'vv-work'
      ? {
          slug: 'vv-work',
          name: 'Робота, що підходить тобі.',
          initials: 'VV',
          industry: 'Усі напрями · Уся Європа',
          description:
            'Вакансії компаній в одному місці. Обирай свою професію, країну та команду, з якою хочеться рухатися вперед.',
          countries: Object.values(countries),
        }
      : partners.find((item) => item.slug === slug)
  if (!partner) throw new ApiError('Компанію не знайдено.', 404)
  return {
    partner,
    partners,
    jobs:
      slug === 'vv-work'
        ? jobs
        : jobs.filter((job) => job.partnerSlug === slug),
  }
}
