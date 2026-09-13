import {
  normalizeApplication,
  validateApplication,
  type ApplicationFields,
  type ApplicationContext,
} from '../features/applications/model'
import { ApiError, delay } from './mockFetch'

// A local mutation simulation: no personal data is transmitted or persisted.
export async function submitApplication(
  fields: ApplicationFields,
  context: ApplicationContext,
  signal: AbortSignal,
) {
  signal.throwIfAborted()
  const values = normalizeApplication(fields)
  if (Object.keys(validateApplication(values)).length)
    throw new ApiError('Перевір заповнення форми.', 400)
  await delay(300 + Math.floor(Math.random() * 501), signal)
  signal.throwIfAborted()
  if (Math.random() < 0.2)
    throw new ApiError(
      'Не вдалося надіслати заявку. Дані збережено у формі — спробуй ще раз.',
    )
  return { id: crypto.randomUUID(), ...values, ...context }
}
