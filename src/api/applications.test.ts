import { describe, expect, it, vi } from 'vitest'
import { submitApplication } from './applications'
import { emptyApplication } from '../features/applications/model'
import * as mockApi from './mockFetch'

const fields = {
  name: ' Олена ',
  contact: ' +380 (67) 123-45-67 ',
  message: ' Шукаю роботу у Польщі. ',
}
const context = {
  audience: 'candidate' as const,
  jobId: 'one',
  partnerSlug: 'forma',
}

describe('application API and validation', () => {
  it('rejects invalid fields before calling the shared wrapper', async () => {
    const request = vi.spyOn(mockApi, 'mockFetch')
    await expect(
      submitApplication(
        emptyApplication,
        context,
        new AbortController().signal,
      ),
    ).rejects.toMatchObject({ status: 400 })
    expect(request).not.toHaveBeenCalled()
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
      const wrapper = vi.spyOn(mockApi, 'mockFetch')
      const signal = new AbortController().signal
      const done = vi.fn()
      const request = submitApplication(
        fields,
        context,
        signal,
      )
      expect(wrapper).toHaveBeenCalledWith(
        'applications', expect.any(Function), signal, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Олена', contact: '+380 (67) 123-45-67',
            message: 'Шукаю роботу у Польщі.', ...context,
          }),
        },
      )
      void request.then(done)
      await vi.advanceTimersByTimeAsync(latency - 1)
      expect(done).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      await expect(request).resolves.toMatchObject({
        id: expect.any(String),
        name: 'Олена',
        contact: '+380 (67) 123-45-67',
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
