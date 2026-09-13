import { describe, expect, it, vi } from 'vitest'
import { submitApplication } from './applications'
import {
  emptyApplication,
  validateApplication,
} from '../features/applications/model'

const fields = {
  name: ' Олена ',
  email: ' olena@example.com ',
  phone: '+380 (67) 123-45-67',
  message: ' Шукаю роботу у Польщі. ',
}
const context = {
  audience: 'candidate' as const,
  jobId: 'one',
  partnerSlug: 'forma',
}

describe('application API and validation', () => {
  it('rejects invalid fields and accepts boundary lengths and an optional phone', async () => {
    expect(validateApplication(emptyApplication)).toHaveProperty('name')
    expect(
      validateApplication({
        ...fields,
        name: 'x'.repeat(81),
        email: 'broken',
        phone: '+380abc123',
        message: 'short',
      }),
    ).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      message: expect.any(String),
    })
    expect(
      validateApplication({
        ...fields,
        name: 'Ол',
        phone: '',
        message: 'x'.repeat(10),
      }),
    ).toEqual({})
    expect(
      validateApplication({
        ...fields,
        name: 'x'.repeat(80),
        phone: '1234567',
        message: 'x'.repeat(2000),
      }),
    ).toEqual({})
    expect(
      validateApplication({
        ...fields,
        phone: '123456',
        message: 'x'.repeat(2001),
        email: 'x'.repeat(250) + '@a.com',
      }),
    ).toEqual({
      phone: expect.any(String),
      message: expect.any(String),
      email: expect.any(String),
    })
    await expect(
      submitApplication(
        emptyApplication,
        context,
        new AbortController().signal,
      ),
    ).rejects.toMatchObject({ status: 400 })
  })

  it.each([
    [0, 300],
    [0.9999, 800],
  ])(
    'confirms after simulated latency (%s) without transmitting personal data',
    async (random, latency) => {
      vi.useFakeTimers()
      vi.spyOn(Math, 'random').mockReturnValueOnce(random).mockReturnValue(0.2)
      const fetch = vi.fn()
      vi.stubGlobal('fetch', fetch)
      const done = vi.fn()
      const request = submitApplication(
        fields,
        context,
        new AbortController().signal,
      )
      void request.then(done)
      await vi.advanceTimersByTimeAsync(latency - 1)
      expect(done).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      await expect(request).resolves.toMatchObject({
        id: expect.any(String),
        name: 'Олена',
        email: 'olena@example.com',
        message: 'Шукаю роботу у Польщі.',
        ...context,
      })
      expect(fetch).not.toHaveBeenCalled()
    },
  )

  it('simulates failure below 20% and cancels requests', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.199)
    const failure = expect(
      submitApplication(fields, context, new AbortController().signal),
    ).rejects.toMatchObject({ status: 503 })
    await vi.runAllTimersAsync()
    await failure
    const controller = new AbortController()
    const canceled = expect(
      submitApplication(fields, context, controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' })
    controller.abort()
    await canceled
    await expect(
      submitApplication(fields, context, controller.signal),
    ).rejects.toMatchObject({ name: 'AbortError' })
  })
})
