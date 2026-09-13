import {
  normalizeApplication,
  validateApplication,
  type ApplicationFields,
  type ApplicationContext,
} from '../features/applications/model'
import { ApiError, mockFetch } from './mockFetch'

function parseReceipt(value: unknown): { id: string } {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    typeof value.id !== 'string' ||
    !value.id
  )
    throw new ApiError('Некоректне підтвердження заявки.')
  return { id: value.id }
}

// A local mutation simulation: no personal data is transmitted or persisted.
export async function submitApplication(
  fields: ApplicationFields,
  context: ApplicationContext,
  signal: AbortSignal,
) {
  signal.throwIfAborted()
  if (Object.keys(validateApplication(fields)).length)
    throw new ApiError('Перевір заповнення форми.', 400)
  const values = normalizeApplication(fields)
  const receipt = await mockFetch('applications', parseReceipt, signal, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, ...context }),
  })
  return { ...values, ...context, ...receipt }
}
