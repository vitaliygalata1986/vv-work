// Shared profession taxonomy. Partner and vacancy data are fetched from /mock/.
export const categories = [
  {
    id: 'construction',
    name: 'Будівництво',
    description: 'Майстри, електрики, зварювальники',
  },
  {
    id: 'production',
    name: 'Виробництво',
    description: 'Оператори, пакувальники, техніки',
  },
  {
    id: 'logistics',
    name: 'Логістика',
    description: 'Комірники, комплектувальники',
  },
  {
    id: 'hospitality',
    name: 'Готелі та ресторани',
    description: 'Кухарі, офіціанти, адміністратори',
  },
  {
    id: 'it',
    name: 'IT та технології',
    description: 'Розробники, тестувальники, підтримка',
  },
  {
    id: 'drivers',
    name: 'Водії',
    description: 'Вантажні перевезення та доставка',
  },
  {
    id: 'other',
    name: 'Інші професії',
    description: 'Знайди можливість у своїй сфері',
  },
] as const

export type CategoryId = (typeof categories)[number]['id']

export interface Partner {
  slug: string
  name: string
  initials: string
  industry: string
  description: string
  countries: readonly string[]
}
