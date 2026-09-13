export interface ApplicationFields {
  name: string
  contact: string
  message: string
}

export interface ApplicationContext {
  audience: 'candidate' | 'employer'
  jobId?: string
  partnerSlug?: string
  jobTitle?: string
}

export type ApplicationErrors = Partial<Record<keyof ApplicationFields, string>>

export const MAX_MESSAGE_LENGTH = 500

export const emptyApplication: ApplicationFields = {
  name: '',
  contact: '',
  message: '',
}

export function normalizeApplication(
  fields: ApplicationFields,
): ApplicationFields {
  return {
    name: fields.name.trim(),
    contact: fields.contact.trim(),
    message: fields.message.trim(),
  }
}

export function validateApplication(
  fields: ApplicationFields,
): ApplicationErrors {
  const value = normalizeApplication(fields)
  const errors: ApplicationErrors = {}
  if (value.name.length < 2 || value.name.length > 80)
    errors.name = 'Вкажи ім’я: від 2 до 80 символів.'
  const isPhone =
    /^\+?\d(?:[ -]?\d)*$/.test(value.contact.replace(/\((\d+)\)/g, '$1')) &&
    /^\d{7,15}$/.test(value.contact.replace(/\D/g, ''))
  const isTelegram =
    /^(?:@|(?:https:\/\/)?t\.me\/)[a-z][a-z0-9_]{4,31}$/i.test(value.contact)
  if (!isPhone && !isTelegram)
    errors.contact =
      'Вкажи телефон із 7–15 цифр або Telegram: @username чи t.me/username.'
  // Match the textarea counter, including whitespace, before normalization.
  if (fields.message.length > MAX_MESSAGE_LENGTH)
    errors.message = `Повідомлення має містити не більше ${MAX_MESSAGE_LENGTH} символів.`
  return errors
}
