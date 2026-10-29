import { useState } from 'react'
import { buttonClass, FIELD_INPUT, FIELD_LABEL } from '../components/formClasses.js'
import { isValidEmail } from '../utils/auth.js'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  confirm: '',
}

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) {
        return current
      }

      const next = { ...current }
      delete next[name]
      return next
    })

    if (error) {
      setError('')
    }
  }

  function validate() {
    const nextErrors = {}
    const name = form.name.trim()

    if (name.length < 2) {
      nextErrors.name = 'Ad soyad en az 2 karakter olmalı.'
    } else if (name.length > 60) {
      nextErrors.name = 'Ad soyad en fazla 60 karakter olabilir.'
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Geçerli bir e-posta adresi girin.'
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Şifre en az 8 karakter olmalı.'
    } else if (form.password.length > 128) {
      nextErrors.password = 'Şifre en fazla 128 karakter olabilir.'
    }

    if (form.confirm !== form.password) {
      nextErrors.confirm = 'Şifreler eşleşmiyor.'
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (busy) {
      return
    }

    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setBusy(true)
    setError('')

    const result = await onRegister({
      name: form.name,
      email: form.email,
      password: form.password,
    })

    if (result?.error) {
      setError(result.error)
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-3 py-10 sm:px-5">
      <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-brand-strong">Hesap oluştur</h1>
        <p className="mt-1.5 text-sm text-stone-600">
          Kitaplarını ayırmak için yerel bir hesap aç.
        </p>

        {error && (
          <div
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="mt-5" onSubmit={handleSubmit} noValidate>
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label htmlFor="register-name" className={FIELD_LABEL}>
              Ad soyad
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Örn. Samil Kocakavuk"
              autoComplete="name"
              maxLength={60}
              autoFocus
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'register-name-error' : undefined}
              className={FIELD_INPUT}
            />
            {errors.name && (
              <p className="m-0 text-xs text-red-600" id="register-name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="mb-3.5 flex flex-col gap-1.5">
            <label htmlFor="register-email" className={FIELD_LABEL}>
              E-posta
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ornek@eposta.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'register-email-error' : undefined
              }
              className={FIELD_INPUT}
            />
            {errors.email && (
              <p className="m-0 text-xs text-red-600" id="register-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-3.5 flex flex-col gap-1.5">
            <label htmlFor="register-password" className={FIELD_LABEL}>
              Şifre
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="En az 8 karakter"
              autoComplete="new-password"
              maxLength={128}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'register-password-error' : undefined
              }
              className={FIELD_INPUT}
            />
            {errors.password && (
              <p
                className="m-0 text-xs text-red-600"
                id="register-password-error"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="register-confirm" className={FIELD_LABEL}>
              Şifre tekrar
            </label>
            <input
              id="register-confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Şifreni tekrar gir"
              autoComplete="new-password"
              maxLength={128}
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={
                errors.confirm ? 'register-confirm-error' : undefined
              }
              className={FIELD_INPUT}
            />
            {errors.confirm && (
              <p
                className="m-0 text-xs text-red-600"
                id="register-confirm-error"
              >
                {errors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`${buttonClass('primary')} w-full`}
            disabled={busy}
          >
            {busy ? 'Hesap oluşturuluyor…' : 'Hesap oluştur'}
          </button>
        </form>

        <p className="mt-4 text-[13px] text-stone-600">
          Zaten hesabın var mı?{' '}
          <a
            href="#/giris"
            className="font-medium text-brand hover:text-brand-strong hover:underline"
          >
            Giriş yap
          </a>
        </p>
      </section>

      <p className="mt-4 text-center text-xs text-stone-500">
        Bilgiler yalnızca bu tarayıcıda saklanır; gerçek bir sunucu hesabı
        değildir.
      </p>
    </main>
  )
}
