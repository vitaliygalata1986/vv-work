export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status = 503) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
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

// Shared latency, failure and cancellation for reads and local mock mutations.
export async function mockFetch<T>(
  path: string,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
  options: Omit<RequestInit, 'signal'> = {},
): Promise<T> {
  await delay(300 + Math.floor(Math.random() * 501), signal)
  signal?.throwIfAborted()
  if (Math.random() < 0.2)
    throw new ApiError('Не вдалося виконати запит. Спробуйте ще раз.')
  // Static hosting has no POST endpoint. Simulate its response locally;
  // personal data from the request body is never transmitted or persisted.
  const response =
    path === 'applications' && options.method === 'POST'
      ? Response.json({ id: crypto.randomUUID() }, { status: 201 })
      : await fetch(`${import.meta.env.BASE_URL}mock/${path}`, {
          ...options,
          signal,
        })
  if (!response.ok)
    throw new ApiError('Не вдалося отримати дані.', response.status)
  const value: unknown = await response.json()
  return parse(value)
}
