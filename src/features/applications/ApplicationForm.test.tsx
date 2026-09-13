import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { submitApplication } from '../../api/applications'
import { ApplicationForm } from './ApplicationForm'

vi.mock('../../api/applications', () => ({ submitApplication: vi.fn() }))

function fill() {
  fireEvent.change(screen.getByLabelText('Ім’я'), {
    target: { value: ' Олена ' },
  })
  fireEvent.change(screen.getByLabelText('Телефон або Telegram'), {
    target: { value: '@olena_work' },
  })
  fireEvent.change(screen.getByLabelText('Повідомлення (необов’язково)'), {
    target: { value: 'Шукаю роботу у Польщі.' },
  })
}

describe('application submission', () => {
  it.each(['+380 (67) 123-45-67', '@olena_work'])(
    'submits with only a name and contact (%s)', async (contact) => {
      const context = { audience: 'candidate' as const }
      vi.mocked(submitApplication).mockResolvedValueOnce({
        id: 'receipt', name: 'Ол', contact, message: '', ...context,
      })
      render(<ApplicationForm context={context} />)
      fireEvent.change(screen.getByLabelText('Ім’я'), { target: { value: ' Ол ' } })
      fireEvent.change(screen.getByLabelText('Телефон або Telegram'), { target: { value: contact } })
      expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Повідомлення (необов’язково)')).not.toBeRequired()
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Демонстраційну заявку прийнято'))
      expect(submitApplication).toHaveBeenCalledWith(
        { name: 'Ол', contact, message: '' }, context, expect.any(AbortSignal),
      )
    },
  )

  it('shows an inline error above 500 characters and accepts exactly 500', async () => {
    const context = { audience: 'employer' as const }
    render(<ApplicationForm context={context} />)
    fill()
    const message = screen.getByLabelText('Повідомлення (необов’язково)')
    expect(message).toHaveAttribute('maxlength', '500')
    fireEvent.change(message, { target: { value: `${'x'.repeat(500)} ` } })
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    expect(message).toHaveFocus()
    expect(message).toHaveAccessibleDescription(/не більше 500 символів/)
    expect(submitApplication).not.toHaveBeenCalled()
    fireEvent.change(message, { target: { value: 'x'.repeat(500) } })
    expect(screen.getByText('До 500 символів · 500/500')).toBeInTheDocument()
    vi.mocked(submitApplication).mockResolvedValueOnce({
      id: 'receipt', name: 'Олена', contact: '@olena_work', message: 'x'.repeat(500), ...context,
    })
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Демонстраційну заявку прийнято'))
  })

  it('validates before submitting and focuses the first invalid field', () => {
    render(<ApplicationForm context={{ audience: 'candidate' }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    expect(screen.getByLabelText('Ім’я')).toHaveFocus()
    expect(screen.getByLabelText('Телефон або Telegram')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByLabelText('Повідомлення (необов’язково)')).toHaveAttribute(
      'aria-invalid', 'false',
    )
    expect(submitApplication).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('Ім’я'), {
      target: { value: 'Олена' },
    })
    expect(screen.getByLabelText('Ім’я')).toHaveAttribute(
      'aria-invalid',
      'false',
    )
  })

  it('shows an optimistic receipt, prevents duplicates, rolls back on failure, and retries without data loss', async () => {
    let rejectRequest!: (error: Error) => void
    vi.mocked(submitApplication).mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject
        }),
    )
    const context = {
      audience: 'candidate' as const,
      jobId: 'one',
      partnerSlug: 'forma',
      jobTitle: 'Електрик',
    }
    const { container } = render(<ApplicationForm context={context} />)
    fill()
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Заявку додано — надсилаємо…',
    )
    expect(screen.getByLabelText('Ім’я')).toBeDisabled()
    fireEvent.submit(container.querySelector('form')!)
    expect(submitApplication).toHaveBeenCalledTimes(1)
    expect(submitApplication).toHaveBeenCalledWith(
      {
        name: 'Олена',
        contact: '@olena_work',
        message: 'Шукаю роботу у Польщі.',
      },
      context,
      expect.any(AbortSignal),
    )
    await act(async () => rejectRequest(new Error('Offline')))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Дані залишилися у формі',
    )
    expect(screen.getByLabelText('Ім’я')).toHaveValue(' Олена ')
    expect(screen.getByLabelText('Повідомлення (необов’язково)')).toHaveValue(
      'Шукаю роботу у Польщі.',
    )
    vi.mocked(submitApplication).mockResolvedValueOnce({
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Олена',
      contact: '@olena_work',
      message: 'Шукаю роботу у Польщі.',
      ...context,
    })
    fireEvent.click(screen.getByRole('button', { name: 'Спробувати ще раз' }))
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Демонстраційну заявку прийнято',
      ),
    )
    expect(screen.getByRole('status')).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Нова заявка' }))
    expect(screen.getByLabelText('Ім’я')).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('cancels a pending submission when leaving the form', async () => {
    let resolveRequest!: (
      value: Awaited<ReturnType<typeof submitApplication>>,
    ) => void
    vi.mocked(submitApplication).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )
    const { unmount } = render(
      <ApplicationForm context={{ audience: 'employer' }} />,
    )
    fill()
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    const signal = vi.mocked(submitApplication).mock.calls.at(-1)![2]
    unmount()
    expect(signal.aborted).toBe(true)
    await act(async () =>
      resolveRequest({
        id: '00000000-0000-4000-8000-000000000002',
        name: 'Олена',
        contact: '@olena_work',
        message: 'Шукаю роботу у Польщі.',
        audience: 'employer',
      }),
    )
  })
})
