import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { getPartners } from '../../api/catalog'
import { partners } from '../../test/fixtures'
import { PartnersSection } from './PartnersSection'

vi.mock('../../api/catalog', () => ({ getPartners: vi.fn() }))

it('loads the home partners through the API and recovers through its own retry block', async () => {
  vi.mocked(getPartners)
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce(partners)
  render(
    <MemoryRouter>
      <PartnersSection />
    </MemoryRouter>,
  )
  expect(
    screen.getByRole('status', { name: 'Завантаження даних' }),
  ).toBeInTheDocument()
  fireEvent.click(
    await screen.findByRole('button', { name: 'Спробувати ще раз' }),
  )
  expect(
    await screen.findByRole('heading', { name: 'Forma' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Forma/ })).toHaveAttribute(
    'href',
    '/partners/forma',
  )
})
