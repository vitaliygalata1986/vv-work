import { useEffect, useRef, useState, type FormEvent } from 'react'
import { submitApplication } from '../../api/applications'
import { Icon } from '../../components/ui/Icon'
import {
  emptyApplication,
  normalizeApplication,
  validateApplication,
  type ApplicationContext,
  type ApplicationErrors,
  type ApplicationFields,
} from './model'

const inputs = [
  {
    name: 'name',
    label: 'Ім’я',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Як до тебе звертатися?',
    maxLength: 80,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'name@example.com',
    maxLength: 254,
  },
  {
    name: 'phone',
    label: 'Телефон (необов’язково)',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: '+380',
    maxLength: 30,
  },
] as const

export function ApplicationForm({ context }: { context: ApplicationContext }) {
  const [fields, setFields] = useState<ApplicationFields>(emptyApplication)
  const [errors, setErrors] = useState<ApplicationErrors>({})
  const [failure, setFailure] = useState('')
  const [receipt, setReceipt] = useState<{
    name: string
    pending: boolean
  } | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const pending = receipt?.pending ?? false

  useEffect(() => () => controllerRef.current?.abort(), [])

  function change(name: keyof ApplicationFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (controllerRef.current) return
    const values = normalizeApplication(fields)
    const nextErrors = validateApplication(values)
    setErrors(nextErrors)
    setFailure('')
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus()
      return
    }
    const controller = new AbortController()
    controllerRef.current = controller
    // Show the submitted card immediately; roll it back if the API rejects it.
    setReceipt({ name: values.name, pending: true })
    try {
      await submitApplication(values, context, controller.signal)
      if (controller.signal.aborted) return
      setReceipt({ name: values.name, pending: false })
      setFields(emptyApplication)
      statusRef.current?.focus()
    } catch {
      if (controller.signal.aborted) return
      setReceipt(null)
      setFailure(
        'Не вдалося надіслати заявку. Дані залишилися у формі. Спробуй ще раз.',
      )
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }

  return (
    <section
      aria-labelledby="application-title"
      className="min-w-0 rounded-3xl border border-line bg-white p-6 md:p-9"
    >
      <p className="section-eyebrow">ПОЧНІМО ЗІ ЗНАЙОМСТВА</p>
      <h2
        id="application-title"
        className="mt-3 text-2xl font-bold tracking-tight"
      >
        {context.audience === 'employer'
          ? 'Розкажи про свою команду'
          : 'Залиш заявку'}
      </h2>
      <p id="application-hint" className="mt-3 text-sm leading-6 text-muted">
        Усі поля, крім телефону, обов’язкові. Це демонстраційна форма: дані не
        надсилаються роботодавцям і не зберігаються після виходу зі сторінки.
      </p>
      {context.jobTitle ? (
        <p className="mt-5 rounded-xl bg-brand-light p-4 text-sm font-semibold text-brand">
          Відгук на вакансію: {context.jobTitle}
        </p>
      ) : null}
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="rounded-xl wrap-anywhere"
      >
        {receipt ? (
          <div className="mt-6 rounded-xl border border-brand/20 bg-brand-light p-5">
            <p className="flex items-center gap-2 font-bold text-brand">
              <Icon name={receipt.pending ? 'arrow' : 'check'} />
              {receipt.pending
                ? 'Заявку додано — надсилаємо…'
                : 'Демонстраційну заявку прийнято'}
            </p>
            <p className="mt-2 text-sm leading-6">
              {receipt.name},{' '}
              {receipt.pending
                ? 'очікуємо підтвердження.'
                : 'дякуємо! Ти успішно перевірив форму.'}
            </p>
          </div>
        ) : null}
      </div>
      {!receipt || receipt.pending ? (
        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          aria-describedby="application-hint"
          className="mt-7"
        >
          <fieldset
            disabled={pending}
            className="min-w-0 space-y-5 disabled:opacity-60"
          >
            <legend className="sr-only">Контактні дані та повідомлення</legend>
            {inputs.map(({ label, ...input }) => (
              <div key={input.name}>
                <label
                  htmlFor={`application-${input.name}`}
                  className="mb-2 block text-sm font-semibold"
                >
                  {label}
                </label>
                <input
                  {...input}
                  id={`application-${input.name}`}
                  value={fields[input.name]}
                  onChange={(event) => change(input.name, event.target.value)}
                  required={input.name !== 'phone'}
                  aria-invalid={Boolean(errors[input.name])}
                  aria-describedby={
                    errors[input.name] ? `error-${input.name}` : undefined
                  }
                  className="form-input"
                />
                {errors[input.name] ? (
                  <p
                    id={`error-${input.name}`}
                    className="mt-2 text-xs text-red-700"
                  >
                    {errors[input.name]}
                  </p>
                ) : null}
              </div>
            ))}
            <div>
              <label
                htmlFor="application-message"
                className="mb-2 block text-sm font-semibold"
              >
                Повідомлення
              </label>
              <textarea
                id="application-message"
                name="message"
                value={fields.message}
                onChange={(event) => change('message', event.target.value)}
                required
                maxLength={2000}
                rows={4}
                placeholder={
                  context.audience === 'employer'
                    ? 'Кого шукаєш, у якій країні та на яких умовах?'
                    : 'Розкажи про свій досвід і яку роботу шукаєш.'
                }
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'message-hint error-message' : 'message-hint'
                }
                className="form-input resize-y"
              />
              <p id="message-hint" className="mt-2 text-xs text-muted">
                Від 10 до 2000 символів · {fields.message.length}/2000
              </p>
              {errors.message ? (
                <p id="error-message" className="mt-2 text-xs text-red-700">
                  {errors.message}
                </p>
              ) : null}
            </div>
            {failure ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
              >
                {failure}
              </p>
            ) : null}
            <button
              type="submit"
              className="button-primary w-full disabled:cursor-wait"
            >
              {pending
                ? 'Надсилаємо…'
                : failure
                  ? 'Спробувати ще раз'
                  : 'Надіслати заявку'}
              <Icon name="arrow" className="size-4" />
            </button>
          </fieldset>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setReceipt(null)}
          className="button-primary mt-6"
        >
          Нова заявка <Icon name="arrow" className="size-4" />
        </button>
      )}
    </section>
  )
}
