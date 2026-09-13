import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DebouncedSearch, SEARCH_DELAY } from './DebouncedSearch'

describe('manual debounce', () => {
  beforeEach(() => vi.useFakeTimers())

  it('updates the input immediately but commits only the last value after 350ms', () => {
    const onChange = vi.fn()
    render(<DebouncedSearch value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Ел' } })
    act(() => vi.advanceTimersByTime(200))
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: ' Електрик ' },
    })
    expect(screen.getByRole('searchbox')).toHaveValue(' Електрик ')
    act(() => vi.advanceTimersByTime(SEARCH_DELAY - 1))
    expect(onChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onChange).toHaveBeenCalledExactlyOnceWith('Електрик')
  })

  it('uses the latest callback when another filter changes during typing', () => {
    const first = vi.fn(),
      latest = vi.fn()
    const { rerender } = render(<DebouncedSearch value="" onChange={first} />)
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Кухар' },
    })
    rerender(<DebouncedSearch value="" onChange={latest} />)
    act(() => vi.advanceTimersByTime(SEARCH_DELAY))
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledExactlyOnceWith('Кухар')
  })

  it('cancels a pending edit on external URL changes and on unmount', () => {
    const onChange = vi.fn()
    const { rerender, unmount } = render(
      <DebouncedSearch value="Електрик" onChange={onChange} />,
    )
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Кухар' },
    })
    rerender(<DebouncedSearch value="Комірник" onChange={onChange} />)
    expect(screen.getByRole('searchbox')).toHaveValue('Комірник')
    act(() => vi.advanceTimersByTime(SEARCH_DELAY))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Водій' },
    })
    unmount()
    act(() => vi.advanceTimersByTime(SEARCH_DELAY))
    expect(onChange).not.toHaveBeenCalled()
  })
})
