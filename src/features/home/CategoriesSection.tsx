import { Link } from 'react-router'
import { Icon, type IconName } from '../../components/ui/Icon'
import { categories, type CategoryId } from '../../data/catalog'

const categoryIcons: Record<CategoryId, IconName> = {
  construction: 'hardhat',
  production: 'factory',
  logistics: 'package',
  hospitality: 'utensils',
  it: 'monitor',
  drivers: 'truck',
  other: 'briefcase',
}

export function CategoriesSection() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="page-container section-spacing scroll-mt-8"
    >
      <p className="section-eyebrow">ЗНАЙДИ СВІЙ НАПРЯМ</p>
      <div className="section-heading-row">
        <h2 id="categories-title" className="section-title">
          Твоя справа знайдеться.
        </h2>
        <p className="max-w-82 text-sm leading-6 text-muted">
          Почни з того, що вмієш. Або відкрий для себе щось нове.
        </p>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 md:gap-4 lg:mt-10 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/partners/vv-work?category=${category.id}`}
              className="category-card group"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <Icon name={categoryIcons[category.id]} className="size-6" />
                </span>
                <Icon
                  name="northeast"
                  className="size-4 text-muted transition-colors group-hover:text-brand"
                />
              </div>
              <h3 className="mt-5 text-sm font-bold sm:text-base">
                {category.name}
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                {category.description}
              </p>
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/partners/vv-work"
            className="category-card group border-brand/15 bg-brand-light hover:bg-[#e2eaff]"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
              <Icon name="search" className="size-6" />
            </span>
            <h3 className="mt-5 text-sm font-bold sm:text-base">
              Ще визначаєшся?
            </h3>
            <p className="mt-2 flex items-center justify-between gap-2 text-xs leading-5 font-semibold text-brand">
              Переглянути всі напрями{' '}
              <Icon name="arrow" className="size-4 shrink-0" />
            </p>
          </Link>
        </li>
      </ul>
    </section>
  )
}
