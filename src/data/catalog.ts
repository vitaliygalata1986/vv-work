// Static demo content for the homepage milestone. The mock API will own data loading next.
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

// Fictional companies: do not present these fixtures as verified real employers.
export const featuredPartners: readonly Partner[] = [
  {
    slug: 'northline-logistics',
    name: 'Northline Logistics',
    initials: 'NL',
    industry: 'Логістика та перевезення',
    description:
      'Команда, що поєднує міста. Робота на складах, у доставці та міжнародних перевезеннях.',
    countries: ['Польща', 'Німеччина'],
  },
  {
    slug: 'forma-industry',
    name: 'Forma Industry',
    initials: 'fi',
    industry: 'Виробництво та будівництво',
    description:
      'Створюй те, чим користуються щодня. Можливості для технічних спеціалістів і майстрів.',
    countries: ['Чехія', 'Польща'],
  },
  {
    slug: 'haven-hospitality',
    name: 'Haven Hospitality',
    initials: 'h.',
    industry: 'Готелі та ресторани',
    description:
      'Гостинність починається з людей. Приєднуйся до команд готелів, ресторанів та сервісу.',
    countries: ['Німеччина', 'Нідерланди'],
  },
]
