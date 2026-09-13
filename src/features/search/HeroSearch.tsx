import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../../components/ui/Icon'

const suggestions = ['Електрик', 'Комірник', 'Кухар']

export function HeroSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div id="search" className="relative z-10 mt-8 scroll-mt-6 lg:mt-10">
      <form
        action="/partners/vv-work"
        role="search"
        aria-label="Пошук вакансій"
        className="search-panel"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const params = new URLSearchParams()
          const country = String(formData.get('country') ?? '')
          if (query.trim()) params.set('q', query.trim())
          if (country) params.set('country', country)
          navigate(`/partners/vv-work${params.size ? `?${params}` : ''}`)
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
          <Icon name="search" className="size-5 shrink-0 text-muted" />
          <div className="min-w-0 flex-1">
            <label
              htmlFor="job-query"
              className="mb-1 block text-[11px] font-bold"
            >
              Яка робота цікавить?
            </label>
            <input
              ref={inputRef}
              id="job-query"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Посада або ключове слово"
              className="w-full min-w-0 bg-transparent py-1 text-sm placeholder:text-muted"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-line px-4 py-3 sm:w-45 sm:border-t-0 sm:border-l">
          <Icon name="pin" className="size-5 shrink-0 text-muted" />
          <div className="relative min-w-0 flex-1">
            <label
              htmlFor="job-country"
              className="mb-1 block text-[11px] font-bold"
            >
              Де шукаємо?
            </label>
            <select
              id="job-country"
              name="country"
              defaultValue=""
              className="w-full appearance-none bg-transparent py-1 pr-5 text-sm"
            >
              <option value="">Уся Європа</option>
              <option value="pl">Польща</option>
              <option value="de">Німеччина</option>
              <option value="cz">Чехія</option>
              <option value="nl">Нідерланди</option>
            </select>
            <Icon
              name="chevron"
              className="pointer-events-none absolute right-0 bottom-2 size-3.5"
            />
          </div>
        </div>
        <button type="submit" className="button-primary m-2 min-h-13 sm:ml-1">
          <span>Знайти</span>
          <Icon name="arrow" className="size-4" />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="py-2 text-muted">Наприклад:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion)
              inputRef.current?.focus()
            }}
            className="min-h-9 rounded-full border border-line px-3 text-muted transition-colors hover:border-brand hover:text-brand"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
