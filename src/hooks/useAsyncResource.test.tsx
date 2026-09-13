import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncResource } from './useAsyncResource'

describe('async resource', () => {
  it('recovers from failure via retry', async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(['ready'])
    const { result } = renderHook(() => useAsyncResource(load))
    expect(result.current.state.status).toBe('loading')
    await waitFor(() => expect(result.current.state.status).toBe('error'))
    act(() => result.current.retry())
    await waitFor(() =>
      expect(result.current.state).toEqual({
        status: 'success',
        data: ['ready'],
      }),
    )
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('aborts old requests and ignores their late responses after switching resources', async () => {
    let resolveOld!: (value: string) => void
    let oldSignal!: AbortSignal
    const first = (signal: AbortSignal) => {
      oldSignal = signal
      return new Promise<string>((resolve) => {
        resolveOld = resolve
      })
    }
    const second = vi.fn().mockResolvedValue('new')
    const { result, rerender, unmount } = renderHook(
      ({ load }) => useAsyncResource(load),
      { initialProps: { load: first } },
    )
    rerender({ load: second })
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'success', data: 'new' }),
    )
    await act(async () => resolveOld('old'))
    expect(oldSignal.aborted).toBe(true)
    expect(result.current.state).toEqual({ status: 'success', data: 'new' })
    unmount()
    expect(second.mock.calls[0][0].aborted).toBe(true)
  })
})
