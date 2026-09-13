import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { getPartnerPage } from '../api/catalog'
import { ApiError } from '../api/mockFetch'
import { jobs, partners } from '../test/fixtures'
import { ContactsPage } from './ContactsPage'

vi.mock('../api/catalog', () => ({ getPartnerPage: vi.fn() }))
const data = { partner: partners[0], partners, jobs }
function setup(url = '/контакти') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <ContactsPage />
    </MemoryRouter>,
  )
}

describe('contacts routing', () => {
  it('switches between general and employer forms without loading the catalog', () => {
    setup()
    expect(
      screen.getByRole('heading', { name: 'Залиш заявку' }),
    ).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Ім’я'), {
      target: { value: 'Олена' },
    })
    fireEvent.click(screen.getByRole('link', { name: 'Шукаю працівників' }))
    expect(
      screen.getByRole('heading', { name: 'Розкажи про свою команду' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Ім’я')).toHaveValue('')
    expect(getPartnerPage).not.toHaveBeenCalled()
  })

  it('retries loading a vacancy and attaches the resolved job to the form', async () => {
    vi.mocked(getPartnerPage)
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(data)
    setup('/контакти?job=one&partner=forma')
    expect(
      screen.getByRole('status', { name: 'Завантаження даних' }),
    ).toBeInTheDocument()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Спробувати ще раз' }),
    )
    expect(
      await screen.findByText('Відгук на вакансію: Електрик'),
    ).toBeInTheDocument()
    expect(getPartnerPage).toHaveBeenLastCalledWith(
      'forma',
      expect.any(AbortSignal),
    )
  })

  it.each(['job', 'partner'])(
    'offers a general application for an unknown %s',
    async (missing) => {
      if (missing === 'partner')
        vi.mocked(getPartnerPage).mockRejectedValueOnce(
          new ApiError('Missing', 404),
        )
      else vi.mocked(getPartnerPage).mockResolvedValueOnce(data)
      setup('/контакти?job=missing&partner=forma')
      expect(
        await screen.findByRole('heading', { name: 'Вакансію не знайдено' }),
      ).toBeInTheDocument()
      expect(screen.queryByLabelText('Ім’я')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('link', { name: 'Загальне звернення' }))
      expect(screen.getByLabelText('Ім’я')).toBeInTheDocument()
    },
  )

  it('resolves job-only links from the combined catalog and ignores job context for employers', async () => {
    vi.mocked(getPartnerPage).mockResolvedValueOnce(data)
    setup('/контакти?job=one')
    expect(
      await screen.findByText('Відгук на вакансію: Електрик'),
    ).toBeInTheDocument()
    expect(getPartnerPage).toHaveBeenLastCalledWith(
      'vv-work',
      expect.any(AbortSignal),
    )
    fireEvent.click(screen.getByRole('link', { name: 'Шукаю працівників' }))
    expect(
      screen.queryByText('Відгук на вакансію: Електрик'),
    ).not.toBeInTheDocument()
  })
})
