import type { Partner } from '../data/catalog'
import type { Job } from '../features/jobs/model'

export const partners: Partner[] = [
  {
    slug: 'forma',
    name: 'Forma',
    initials: 'fi',
    industry: 'Виробництво',
    description: 'Демо',
    countries: ['Польща', 'Чехія'],
  },
]
const base = {
  partnerSlug: 'forma',
  city: 'Краків',
  salaryMin: 1500,
  salaryMax: 2000,
  experience: 'Від 1 року',
  description: 'Робота в команді.',
  schedule: 'Повна зайнятість',
  requirements: ['Практичний досвід.'],
}
export const jobs: Job[] = [
  {
    ...base,
    id: 'one',
    title: 'Електрик',
    category: 'construction',
    country: 'pl',
  },
  {
    ...base,
    id: 'two',
    title: 'Електрик обладнання',
    category: 'construction',
    country: 'cz',
  },
  {
    ...base,
    id: 'three',
    title: 'Комірник',
    category: 'logistics',
    country: 'pl',
  },
]
