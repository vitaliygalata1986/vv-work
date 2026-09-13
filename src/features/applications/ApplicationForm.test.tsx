import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { submitApplication } from '../../api/applications'
import { ApplicationForm } from './ApplicationForm'

vi.mock('../../api/applications', () => ({ submitApplication: vi.fn() }))

function fill() {
  fireEvent.change(screen.getByLabelText('Ім’я'), {
    target: { value: ' Олена ' },
  })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'olena@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Повідомлення'), {
    target: { value: 'Шукаю роботу у Польщі.' },
  })
}

describe('application submission', () => {
  it('validates before submitting and focuses the first invalid field', () => {
    render(<ApplicationForm context={{ audience: 'candidate' }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }))
    expect(screen.getByLabelText('Ім’я')).toHaveFocus()
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(
      screen.getByText('Напиши повідомлення: від 10 до 2000 символів.'),
    ).toBeInTheDocument()
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
        email: 'olena@example.com',
        phone: '',
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
    expect(screen.getByLabelText('Повідомлення')).toHaveValue(
      'Шукаю роботу у Польщі.',
    )
    vi.mocked(submitApplication).mockResolvedValueOnce({
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Олена',
      email: 'olena@example.com',
      phone: '',
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
        email: 'olena@example.com',
        phone: '',
        message: 'Шукаю роботу у Польщі.',
        audience: 'employer',
      }),
    )
  })
})
