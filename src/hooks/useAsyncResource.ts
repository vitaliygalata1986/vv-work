import { useCallback, useEffect, useState } from 'react'

type Resource<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

export function useAsyncResource<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<{
    load: typeof load
    attempt: number
    state: Resource<T>
  } | null>(null)
  const [attempt, setAttempt] = useState(0)
  // A different loader or retry is loading immediately, before its effect runs.
  const state: Resource<T> =
    result?.load === load && result.attempt === attempt
      ? result.state
      : { status: 'loading' }

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setResult({ load, attempt, state: { status: 'success', data } })
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            load,
            attempt,
            state: {
              status: 'error',
              error:
                error instanceof Error
                  ? error
                  : new Error('Не вдалося завантажити дані.'),
            },
          })
      },
    )
    return () => controller.abort()
  }, [load, attempt])

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  return { state, retry }
}
