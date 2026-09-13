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
function setup(entries = ['/partners/forma']) {
  return render(
    <MemoryRouter initialEntries={entries}>
      <LocationProbe />
      <JobBrowser jobs={jobs} partners={partners} />
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
