import { describe, expect, it } from 'vitest'
import { emptyApplication, normalizeApplication, validateApplication } from './model'

const fields = { name: 'Олена', contact: '@olena_work', message: '' }

describe('application validation', () => {
  it('requires only a name and contact', () => {
    expect(validateApplication(emptyApplication)).toEqual({
      name: expect.any(String), contact: expect.any(String),
    })
    expect(validateApplication(fields)).toEqual({})
  })

  it('validates name boundaries after trimming', () => {
    for (const name of [' О ', 'x'.repeat(81)])
      expect(validateApplication({ ...fields, name })).toHaveProperty('name')
    for (const name of [' Ол ', 'x'.repeat(80)])
      expect(validateApplication({ ...fields, name })).toEqual({})
  })

  it.each([
    '+380 (67) 123-45-67', '(067) 123-45-67', '1234567', '+123456789012345',
    ' @olena_work ', '@Olena', `@${'a'.repeat(32)}`,
    't.me/olena_work', 'https://t.me/olena_work',
  ])('accepts a phone or Telegram contact: %s', (contact) => {
    expect(validateApplication({ ...fields, contact })).toEqual({})
  })

  it.each([
    '', '   ', '123456', '+1234567890123456', '+380abc1234567',
    '+380 (67 123-45-67', '1234567-', '12+34567', 'olena@example.com',
    'olena_work', '@olen', `@${'a'.repeat(33)}`, '@olena-work',
    '@1olena', '@олена', 'https://example.com/olena', 't.me/olena?start=1',
  ])('rejects an invalid contact: %s', (contact) => {
    expect(validateApplication({ ...fields, contact })).toEqual({ contact: expect.any(String) })
  })

  it('accepts an optional message up to 500 characters, including short messages', () => {
    for (const message of ['', ' ', 'Дякую', 'x'.repeat(500)])
      expect(validateApplication({ ...fields, message })).toEqual({})
    for (const message of ['x'.repeat(501), `${'x'.repeat(500)} `])
      expect(validateApplication({ ...fields, message })).toHaveProperty('message')
  })

  it('trims submitted values without changing their contents', () => {
    expect(normalizeApplication({ name: ' Олена ', contact: ' @olena_work ', message: ' Є досвід. ' }))
      .toEqual({ name: 'Олена', contact: '@olena_work', message: 'Є досвід.' })
  })
})
