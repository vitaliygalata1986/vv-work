import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../components/ui/Icon'

export const SEARCH_DELAY = 350

export function DebouncedSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [input, setInput] = useState({ source: value, draft: value })
  if (input.source !== value) setInput({ source: value, draft: value })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  // A URL change (including Back/Forward) replaces the draft and cancels stale work.
  useEffect(() => {
    clearTimeout(timer.current)
    return () => clearTimeout(timer.current)
  }, [value])

  return (
    <div>
      <label htmlFor="vacancy-query" className="mb-2 block text-xs font-bold">
        Назва вакансії
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-4">
        <Icon name="search" className="size-5 shrink-0 text-muted" />
        <input
          id="vacancy-query"
          type="search"
          value={input.draft}
          placeholder="Наприклад, електрик"
          className="h-12 w-full min-w-0 bg-transparent text-sm"
          onChange={(event) => {
            const next = event.target.value
            setInput({ source: value, draft: next })
            clearTimeout(timer.current)
            timer.current = setTimeout(
              () => onChangeRef.current(next.trim()),
              SEARCH_DELAY,
            )
          }}
        />
      </div>
    </div>
  )
}
