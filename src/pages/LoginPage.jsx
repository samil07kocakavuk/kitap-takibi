import { useState } from 'react'
import { buttonClass, FIELD_INPUT, FIELD_LABEL } from '../components/formClasses.js'

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({ ...current, [name]: value }))

    if (error) {
      setError('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (busy) {
      return
    }

    setBusy(true)
    setError('')

    const result = await onLogin(form)

    if (result?.error) {
      setError(result.error)
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-3 py-10 sm:px-5">
      <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-brand-strong">Giriş yap</h1>
        <p className="mt-1.5 text-sm text-stone-600">
          Kitaplarına erişmek için hesabına giriş yap.
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
            <label htmlFor="login-email" className={FIELD_LABEL}>
              E-posta
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ornek@eposta.com"
              autoComplete="email"
              autoFocus
              className={FIELD_INPUT}
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="login-password" className={FIELD_LABEL}>
              Şifre
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Şifren"
              autoComplete="current-password"
              className={FIELD_INPUT}
            />
          </div>

          <button
            type="submit"
            className={`${buttonClass('primary')} w-full`}
            disabled={busy}
          >
            {busy ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </button>
        </form>

        <p className="mt-4 text-[13px] text-stone-600">
          Hesabın yok mu?{' '}
          <a
            href="#/kayit"
            className="font-medium text-brand hover:text-brand-strong hover:underline"
          >
            Hesap oluştur
          </a>
        </p>
      </section>

      <p className="mt-4 text-center text-xs text-stone-500">
        Hesaplar yalnızca bu tarayıcıda saklanır.
      </p>
    </main>
  )
}
