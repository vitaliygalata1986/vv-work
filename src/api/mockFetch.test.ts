import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, mockFetch } from './mockFetch'

describe('mock fetch', () => {
  beforeEach(() => vi.useFakeTimers())
  const parse = (value: unknown) => value

  it.each([
    [0, 300],
    [0.9999, 800],
  ])(
    'delays a request by the generated latency (%s)',
    async (random, delay) => {
      vi.spyOn(Math, 'random').mockReturnValueOnce(random).mockReturnValue(0.8)
      const fetch = vi.fn().mockResolvedValue(new Response('{"ok":true}'))
      vi.stubGlobal('fetch', fetch)
      const request = mockFetch('partners.json', parse)
      await vi.advanceTimersByTimeAsync(delay - 1)
      expect(fetch).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1)
      await expect(request).resolves.toEqual({ ok: true })
      expect(fetch.mock.calls[0][0]).toBe('/mock/partners.json')
    },
  )

  it('simulates errors below 20%, but allows the exact boundary', async () => {
    const random = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.199)
    const fetch = vi.fn().mockResolvedValue(new Response('[]'))
    vi.stubGlobal('fetch', fetch)
    const failure = expect(
      mockFetch('jobs.json', parse),
    ).rejects.toBeInstanceOf(ApiError)
    await vi.advanceTimersByTimeAsync(300)
    await failure
    expect(fetch).not.toHaveBeenCalled()
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.2)
    const success = mockFetch('jobs.json', parse)
    await vi.advanceTimersByTimeAsync(300)
    await expect(success).resolves.toEqual([])
  })

  it.each(['before', 'during'])(
    'cancels %s the delay without fetching',
    async (when) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9)
      const fetch = vi.fn()
      vi.stubGlobal('fetch', fetch)
      const controller = new AbortController()
      if (when === 'before') controller.abort()
      const rejected = expect(
        mockFetch('jobs.json', parse, controller.signal),
      ).rejects.toMatchObject({ name: 'AbortError' })
      if (when === 'during') controller.abort()
      await rejected
      await vi.runAllTimersAsync()
      expect(fetch).not.toHaveBeenCalled()
    },
  )

  it('propagates HTTP failure and passes the AbortSignal to fetch', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9)
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 500 }))
    vi.stubGlobal('fetch', fetch)
    const controller = new AbortController()
    const rejected = expect(
      mockFetch('jobs.json', parse, controller.signal),
    ).rejects.toMatchObject({ status: 500 })
    await vi.runAllTimersAsync()
    await rejected
    expect(fetch.mock.calls[0][1]).toEqual({ signal: controller.signal })
  })
})
