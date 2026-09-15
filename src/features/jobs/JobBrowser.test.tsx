import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jobs, partners } from '../../test/fixtures'
import { JobBrowser } from './JobBrowser'
import * as model from './model'

function LocationProbe() {
  const location = useLocation(),
    navigate = useNavigate()
  return (
    <>
      <output data-testid="url">{location.search}</output>
      <button onClick={() => navigate(-1)}>Назад</button>
    </>
  )
}
function setup(entries = ['/partners/forma'], catalog = jobs) {
  return render(
    <MemoryRouter initialEntries={entries}>
      <LocationProbe />
      <JobBrowser jobs={catalog} partners={partners} />
    </MemoryRouter>,
  )
}

describe('job search integration', () => {
  beforeEach(() => vi.useFakeTimers())

  it('combines debounced title, category and country without recomputing on each keystroke', () => {
    const filter = vi.spyOn(model, 'filterJobs')
    setup()
    expect(filter).toHaveBeenCalledTimes(1)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ЕЛ' } })
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: ' ЕЛЕКТРИК ' },
    })
    expect(filter).toHaveBeenCalledTimes(1)
    fireEvent.change(screen.getByLabelText('Категорія'), {
      target: { value: 'construction' },
    })
    fireEvent.change(screen.getByLabelText('Країна'), {
      target: { value: 'pl' },
    })
    act(() => vi.advanceTimersByTime(350))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Електрик' }),
    ).toBeInTheDocument()
    const params = new URLSearchParams(
      screen.getByTestId('url').textContent ?? '',
    )
    expect(Object.fromEntries(params)).toEqual({
      q: 'ЕЛЕКТРИК',
      category: 'construction',
      country: 'pl',
    })
  })

  it('shows an empty state and resets a pending draft as well as committed filters', () => {
    setup(['/partners/forma?q=Кухар&category=construction'])
    expect(screen.getByText('Поки немає таких вакансій')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Водій' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Скинути фільтри' }))
    act(() => vi.advanceTimersByTime(350))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByTestId('url')).toHaveTextContent('')
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('restores URL filters on Back and cancels a pending edit', () => {
    setup(['/partners/forma?q=Комірник', '/partners/forma?q=Електрик'])
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Кухар' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
    act(() => vi.advanceTimersByTime(350))
    expect(screen.getByRole('searchbox')).toHaveValue('Комірник')
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Комірник' }),
    ).toBeInTheDocument()
  })

  it('ignores unknown filter values and passes the chosen job into the application link', () => {
    setup(['/partners/forma?category=unknown&country=unknown'])
    expect(screen.getByLabelText('Категорія')).toHaveValue('')
    expect(screen.getByLabelText('Країна')).toHaveValue('')
    fireEvent.click(screen.getAllByText('Детальніше про вакансію')[0])
    expect(
      screen.getAllByRole('link', { name: 'Відгукнутися' })[0],
    ).toHaveAttribute('href', '/контакти?job=one&partner=forma')
  })
})

const largeCatalog: model.Job[] = Array.from({ length: 25 }, (_, index) => ({
  ...jobs[0]!,
  id: `vacancy-${index}`,
  title: `Електрик ${index + 1}`,
}))
largeCatalog[24] = { ...jobs[2]!, id: 'last-vacancy', country: 'cz' }

describe('show more vacancies', () => {
  beforeEach(() => vi.useFakeTimers())

  it('adds batches of ten, preserves existing cards and focuses the first new card', () => {
    const filter = vi.spyOn(model, 'filterJobs')
    setup(undefined, largeCatalog)
    expect(screen.getAllByRole('article')).toHaveLength(10)
    expect(screen.getByText('Показано 10 із 25')).toBeInTheDocument()
    const firstCard = screen.getAllByRole('article')[0]!
    fireEvent.click(screen.getAllByText('Детальніше про вакансію')[0]!)
    fireEvent.click(screen.getByRole('button', { name: 'Показати ще' }))
    expect(screen.getAllByRole('article')).toHaveLength(20)
    expect(screen.getByText('Показано 20 із 25')).toBeInTheDocument()
    expect(screen.getAllByRole('article')[0]).toBe(firstCard)
    expect(firstCard.querySelector('details')).toHaveAttribute('open')
    expect(screen.getAllByRole('article')[10]!.parentElement).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Показати ще' }))
    expect(screen.getAllByRole('article')).toHaveLength(25)
    expect(screen.getByText('Показано 25 із 25')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Показати ще' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')[20]!.parentElement).toHaveFocus()
    expect(filter).toHaveBeenCalledTimes(1)
  })

  it.each([3, 10])('does not show a button for %i results', (count) => {
    setup(undefined, largeCatalog.slice(0, count))
    expect(screen.getAllByRole('article')).toHaveLength(count)
    expect(screen.getByText(`Показано ${count} із ${count}`)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Показати ще' })).not.toBeInTheDocument()
  })

  it.each(['query', 'category', 'country', 'reset', 'back'])(
    'returns to ten results after %s changes', (change) => {
      setup(['/partners/forma?q=Електрик', '/partners/forma'], largeCatalog)
      fireEvent.click(screen.getByRole('button', { name: 'Показати ще' }))
      if (change === 'query') {
        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Електрик' } })
        expect(screen.getAllByRole('article')).toHaveLength(20)
        act(() => vi.advanceTimersByTime(350))
      } else if (change === 'category') {
        fireEvent.change(screen.getByLabelText('Категорія'), { target: { value: 'construction' } })
      } else if (change === 'country') {
        fireEvent.change(screen.getByLabelText('Країна'), { target: { value: 'pl' } })
      } else {
        fireEvent.click(screen.getByRole('button', {
          name: change === 'reset' ? 'Скинути фільтри' : 'Назад',
        }))
      }
      expect(screen.getAllByRole('article')).toHaveLength(10)
      expect(screen.getByText(`Показано 10 із ${change === 'reset' ? 25 : 24}`)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Показати ще' })).toBeInTheDocument()
    },
  )

  it('searches and combines filters across the entire catalog, including hidden cards', () => {
    setup(undefined, largeCatalog)
    expect(screen.queryByRole('heading', { name: 'Комірник' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Комірник' } })
    fireEvent.change(screen.getByLabelText('Категорія'), { target: { value: 'logistics' } })
    fireEvent.change(screen.getByLabelText('Країна'), { target: { value: 'cz' } })
    act(() => vi.advanceTimersByTime(350))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Комірник' })).toBeInTheDocument()
    expect(screen.getByText('Показано 1 із 1')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Країна'), { target: { value: 'pl' } })
    expect(screen.getByText('Поки немає таких вакансій')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Показати ще' })).not.toBeInTheDocument()
  })
})
