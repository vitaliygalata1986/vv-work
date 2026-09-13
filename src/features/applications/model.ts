export interface ApplicationFields {
  name: string
  email: string
  phone: string
  message: string
}

export interface ApplicationContext {
  audience: 'candidate' | 'employer'
  jobId?: string
  partnerSlug?: string
  jobTitle?: string
}

export type ApplicationErrors = Partial<Record<keyof ApplicationFields, string>>

export const emptyApplication: ApplicationFields = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

export function normalizeApplication(
  fields: ApplicationFields,
): ApplicationFields {
  return {
    name: fields.name.trim(),
    email: fields.email.trim(),
    phone: fields.phone.trim(),
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
  if (
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    errors.email = 'Вкажи коректну електронну адресу.'
  if (
    value.phone &&
    (!/^\+?[\d\s()-]+$/.test(value.phone) ||
      !/^\d{7,15}$/.test(value.phone.replace(/\D/g, '')))
  )
    errors.phone = 'Вкажи телефон із 7–15 цифр або залиш поле порожнім.'
  if (value.message.length < 10 || value.message.length > 2000)
    errors.message = 'Напиши повідомлення: від 10 до 2000 символів.'
  return errors
}
