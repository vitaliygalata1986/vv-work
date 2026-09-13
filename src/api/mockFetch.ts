export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status = 503) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

// Real fetch against local JSON, with simulated latency and failure before the request.
export async function mockFetch<T>(
  path: string,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
): Promise<T> {
  await delay(300 + Math.floor(Math.random() * 501), signal)
  signal?.throwIfAborted()
  if (Math.random() < 0.2)
    throw new ApiError('Не вдалося завантажити дані. Спробуйте ще раз.')
  const response = await fetch(`${import.meta.env.BASE_URL}mock/${path}`, {
    signal,
  })
  if (!response.ok)
    throw new ApiError('Не вдалося отримати дані.', response.status)
  const value: unknown = await response.json()
  return parse(value)
}
