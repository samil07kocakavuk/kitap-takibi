import { useState } from 'react'
import { buttonClass, FIELD_INPUT, FIELD_LABEL } from '../components/formClasses.js'
import { loadBooks } from '../utils/storage.js'

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('')
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(
      new Date(value),
    )
  } catch {
    return ''
  }
}

function summarize(books) {
  const read = books.filter((book) => book.status === 'okundu')
  const reading = books.filter((book) => book.status === 'okunuyor')
  const toRead = books.filter((book) => book.status === 'okunacak')
  const readPages = read.reduce((total, book) => total + book.pageCount, 0)

  return { total: books.length, read: read.length, reading: reading.length, toRead: toRead.length, readPages }
}

function messageClass(type) {
  return type === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-green-200 bg-green-50 text-green-800'
}

export default function AccountPage({
  account,
  onUpdateName,
  onChangePassword,
}) {
  const [books] = useState(() => loadBooks(account.id).books)
  const [name, setName] = useState(account.name)
  const [nameMessage, setNameMessage] = useState(null)
  const [nameBusy, setNameBusy] = useState(false)
  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  const [passwordMessage, setPasswordMessage] = useState(null)
  const [passwordBusy, setPasswordBusy] = useState(false)

  const stats = summarize(books)
  const statCards = [
    { label: 'Toplam kitap', value: stats.total },
    { label: 'Okundu', value: stats.read },
    { label: 'Okunuyor', value: stats.reading },
    { label: 'Okunacak', value: stats.toRead },
    { label: 'Okunan sayfa', value: stats.readPages },
  ]

  async function handleNameSubmit(event) {
    event.preventDefault()

    if (nameBusy) {
      return
    }

    setNameBusy(true)
    setNameMessage(null)

    const result = await onUpdateName(name)

    if (result.error) {
      setNameMessage({ type: 'error', text: result.error })
    } else {
      setName(result.account.name)
      setNameMessage({ type: 'success', text: 'Adın güncellendi.' })
    }

    setNameBusy(false)
  }

  function handlePasswordChange(event) {
    const { name: field, value } = event.target

    setPassword((current) => ({ ...current, [field]: value }))
    setPasswordMessage(null)
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()

    if (passwordBusy) {
      return
    }

    if (password.next.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: 'Yeni şifre en az 8 karakter olmalı.',
      })
      return
    }

    if (password.next === password.current) {
      setPasswordMessage({
        type: 'error',
        text: 'Yeni şifre mevcut şifreyle aynı olamaz.',
      })
      return
    }

    if (password.next !== password.confirm) {
      setPasswordMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' })
      return
    }

    setPasswordBusy(true)
    setPasswordMessage(null)

    const result = await onChangePassword(password.current, password.next)

    if (result.error) {
      setPasswordMessage({ type: 'error', text: result.error })
    } else {
      setPassword({ current: '', next: '', confirm: '' })
      setPasswordMessage({ type: 'success', text: 'Şifren güncellendi.' })
    }

    setPasswordBusy(false)
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-3 pb-10 pt-6 sm:px-5 sm:pt-8">
      <section className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand-strong"
            aria-hidden="true"
          >
            {initials(account.name)}
          </span>
          <div className="min-w-0">
            <h1 className="m-0 text-2xl font-bold tracking-tight text-brand-strong">
              {account.name}
            </h1>
            <p className="mt-0.5 truncate text-sm text-stone-600">
              {account.email}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Üyelik: {formatDate(account.createdAt)}
            </p>
          </div>
          <span className="ml-auto rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-strong">
            Yerel hesap
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {statCards.map((card, index) => {
            const isLast = index === statCards.length - 1

            return (
              <div
                key={card.label}
                className={`rounded-md border px-3 py-2.5 text-center ${
                  isLast
                    ? 'col-span-2 border-brand/25 bg-brand-soft sm:col-span-1'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <p className="m-0 text-xl font-semibold tabular-nums text-brand-strong">
                  {card.value}
                </p>
                <p className="m-0 mt-0.5 text-xs text-stone-600">
                  {card.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
          <h2 className="m-0 text-lg font-semibold">Hesap bilgileri</h2>
          <p className="mt-1 text-[13px] text-stone-600">
            Görünen adını değiştirebilirsin.
          </p>

          {nameMessage && (
            <div
              className={`mt-4 rounded-md border px-3 py-2.5 text-[13px] ${messageClass(nameMessage.type)}`}
              role={nameMessage.type === 'error' ? 'alert' : 'status'}
            >
              {nameMessage.text}
            </div>
          )}

          <form className="mt-4" onSubmit={handleNameSubmit} noValidate>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label htmlFor="account-name" className={FIELD_LABEL}>
                Ad soyad
              </label>
              <input
                id="account-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setNameMessage(null)
                }}
                autoComplete="name"
                maxLength={60}
                className={FIELD_INPUT}
              />
            </div>

            <div className="mb-4 flex flex-col gap-1.5">
              <label htmlFor="account-email" className={FIELD_LABEL}>
                E-posta
              </label>
              <input
                id="account-email"
                type="email"
                value={account.email}
                readOnly
                className={`${FIELD_INPUT} bg-stone-50 text-stone-500`}
              />
            </div>

            <button
              type="submit"
              className={buttonClass('primary')}
              disabled={nameBusy}
            >
              {nameBusy ? 'Kaydediliyor…' : 'Adı kaydet'}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
          <h2 className="m-0 text-lg font-semibold">Şifre değiştir</h2>
          <p className="mt-1 text-[13px] text-stone-600">
            Mevcut şifreni doğrulayarak yeni bir şifre belirle.
          </p>

          {passwordMessage && (
            <div
              className={`mt-4 rounded-md border px-3 py-2.5 text-[13px] ${messageClass(passwordMessage.type)}`}
              role={passwordMessage.type === 'error' ? 'alert' : 'status'}
            >
              {passwordMessage.text}
            </div>
          )}

          <form className="mt-4" onSubmit={handlePasswordSubmit} noValidate>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label htmlFor="account-current-password" className={FIELD_LABEL}>
                Mevcut şifre
              </label>
              <input
                id="account-current-password"
                name="current"
                type="password"
                value={password.current}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                className={FIELD_INPUT}
              />
            </div>

            <div className="mb-3.5 flex flex-col gap-1.5">
              <label htmlFor="account-new-password" className={FIELD_LABEL}>
                Yeni şifre
              </label>
              <input
                id="account-new-password"
                name="next"
                type="password"
                value={password.next}
                onChange={handlePasswordChange}
                placeholder="En az 8 karakter"
                autoComplete="new-password"
                maxLength={128}
                className={FIELD_INPUT}
              />
            </div>

            <div className="mb-4 flex flex-col gap-1.5">
              <label htmlFor="account-confirm-password" className={FIELD_LABEL}>
                Yeni şifre tekrar
              </label>
              <input
                id="account-confirm-password"
                name="confirm"
                type="password"
                value={password.confirm}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                maxLength={128}
                className={FIELD_INPUT}
              />
            </div>

            <button
              type="submit"
              className={buttonClass('primary')}
              disabled={passwordBusy}
            >
              {passwordBusy ? 'Kaydediliyor…' : 'Şifreyi değiştir'}
            </button>
          </form>
        </section>
      </div>

      <p className="mt-5 text-center text-xs text-stone-500">
        Bu hesap yalnızca bu tarayıcıda saklanır ve gerçek bir sunucu hesabı
        değildir. Tarayıcı verilerini temizlersen hesap ve kitaplar silinir.
      </p>
    </main>
  )
}
