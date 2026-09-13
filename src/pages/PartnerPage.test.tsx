import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { getPartnerPage } from '../api/catalog'
import { ApiError } from '../api/mockFetch'
import { jobs, partners } from '../test/fixtures'
import { PartnerPage } from './PartnerPage'

vi.mock('../api/catalog', () => ({ getPartnerPage: vi.fn() }))
const data = { partner: partners[0], partners, jobs }

function setup() {
  render(
    <MemoryRouter initialEntries={['/partners/forma?q=Електрик&country=pl']}>
      <Routes>
        <Route path="partners/:slug" element={<PartnerPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('partner page loading and recovery', () => {
  it('shows skeleton, retries the same resource, and retains filters', async () => {
    vi.mocked(getPartnerPage)
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(data)
    setup()
    expect(
      screen.getByRole('status', { name: 'Завантаження даних' }),
    ).toBeInTheDocument()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Спробувати ще раз' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Forma', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('Електрик')
    expect(screen.getByLabelText('Країна')).toHaveValue('pl')
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('shows a not-found page for a missing partner', async () => {
    vi.mocked(getPartnerPage).mockRejectedValueOnce(
      new ApiError('Missing', 404),
    )
    setup()
    expect(
      await screen.findByRole('heading', { name: 'Такої сторінки немає' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Спробувати ще раз' }),
    ).not.toBeInTheDocument()
  })
})
