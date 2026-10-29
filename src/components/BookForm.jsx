import { useEffect, useRef, useState } from 'react'
import { STATUS_OPTIONS, isValidStatus } from '../interfaces/books.js'

const EMPTY_FORM = {
  title: '',
  author: '',
  pageCount: '',
  status: 'okunacak',
  notes: '',
}

const INPUT_CLASS =
  'w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 aria-[invalid=true]:border-red-600'

const LABEL_CLASS = 'text-[13px] font-medium text-slate-700'

const BUTTON_BASE =
  'inline-flex items-center justify-center rounded-md border px-3.5 py-2 text-sm font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

function formFromBook(book) {
  if (!book) {
    return EMPTY_FORM
  }

  return {
    title: book.title,
    author: book.author,
    pageCount: book.pageCount > 0 ? String(book.pageCount) : '',
    status: book.status,
    notes: book.notes,
  }
}

export default function BookForm({ editingBook, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(() => formFromBook(editingBook))
  const [errors, setErrors] = useState({})
  const titleRef = useRef(null)
  const authorRef = useRef(null)
  const pageCountRef = useRef(null)
  const statusRef = useRef(null)
  const notesRef = useRef(null)
  const isEditing = Boolean(editingBook)

  useEffect(() => {
    setForm(formFromBook(editingBook))
    setErrors({})

    if (editingBook) {
      titleRef.current?.focus()
    }
  }, [editingBook])

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
  }

  function validate() {
    const nextErrors = {}
    const title = form.title.trim()
    const author = form.author.trim()
    const pageCountText = form.pageCount.trim()
    const pageCount = Number(pageCountText)
    const notes = form.notes.trim()

    if (!title) {
      nextErrors.title = 'Kitap adı zorunlu.'
    } else if (title.length > 100) {
      nextErrors.title = 'Kitap adı en fazla 100 karakter olabilir.'
    }

    if (!author) {
      nextErrors.author = 'Yazar zorunlu.'
    } else if (author.length > 80) {
      nextErrors.author = 'Yazar adı en fazla 80 karakter olabilir.'
    }

    if (
      !pageCountText ||
      !Number.isInteger(pageCount) ||
      pageCount < 1 ||
      pageCount > 10000
    ) {
      nextErrors.pageCount = '1 ile 10000 arasında bir sayfa sayısı girin.'
    }

    if (!isValidStatus(form.status)) {
      nextErrors.status = 'Geçerli bir durum seçin.'
    }

    if (notes.length > 300) {
      nextErrors.notes = 'Not en fazla 300 karakter olabilir.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)

      const refs = {
        title: titleRef,
        author: authorRef,
        pageCount: pageCountRef,
        status: statusRef,
        notes: notesRef,
      }
      const firstInvalidField = [
        'title',
        'author',
        'pageCount',
        'status',
        'notes',
      ].find((field) => nextErrors[field])

      refs[firstInvalidField]?.current?.focus()
      return
    }

    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      pageCount: Number(form.pageCount),
      status: form.status,
      notes: form.notes.trim(),
    })

    if (!isEditing) {
      setForm(EMPTY_FORM)
      setErrors({})
      titleRef.current?.focus()
    }
  }

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"
      aria-labelledby="form-title"
    >
      <div className="mb-4">
        <h2 id="form-title" className="m-0 text-lg font-semibold">
          {isEditing ? 'Kitabı düzenle' : 'Yeni kitap'}
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          {isEditing
            ? 'Bilgileri güncelle ve kaydet.'
            : 'Kitabını eklemek için formu doldur.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3.5 flex flex-col gap-1.5">
          <label htmlFor="book-title" className={LABEL_CLASS}>
            Kitap adı <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            ref={titleRef}
            id="book-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Örn. Tutunamayanlar"
            maxLength={100}
            autoComplete="off"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={INPUT_CLASS}
          />
          {errors.title && (
            <p className="m-0 text-xs text-red-600" id="title-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="mb-3.5 flex flex-col gap-1.5">
          <label htmlFor="book-author" className={LABEL_CLASS}>
            Yazar <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            ref={authorRef}
            id="book-author"
            name="author"
            type="text"
            value={form.author}
            onChange={handleChange}
            placeholder="Örn. Oğuz Atay"
            maxLength={80}
            autoComplete="off"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? 'author-error' : undefined}
            className={INPUT_CLASS}
          />
          {errors.author && (
            <p className="m-0 text-xs text-red-600" id="author-error">
              {errors.author}
            </p>
          )}
        </div>

        <div className="mb-3.5 flex flex-col gap-1.5">
          <label htmlFor="book-page-count" className={LABEL_CLASS}>
            Sayfa sayısı{' '}
            <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            ref={pageCountRef}
            id="book-page-count"
            name="pageCount"
            type="number"
            value={form.pageCount}
            onChange={handleChange}
            placeholder="Örn. 320"
            min="1"
            max="10000"
            step="1"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.pageCount)}
            aria-describedby={errors.pageCount ? 'page-count-error' : undefined}
            className={INPUT_CLASS}
          />
          {errors.pageCount && (
            <p className="m-0 text-xs text-red-600" id="page-count-error">
              {errors.pageCount}
            </p>
          )}
        </div>

        <div className="mb-3.5 flex flex-col gap-1.5">
          <label htmlFor="book-status" className={LABEL_CLASS}>
            Durum <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <select
            ref={statusRef}
            id="book-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'status-error' : undefined}
            className={INPUT_CLASS}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="m-0 text-xs text-red-600" id="status-error">
              {errors.status}
            </p>
          )}
        </div>

        <div className="mb-3.5 flex flex-col gap-1.5">
          <label htmlFor="book-notes" className={LABEL_CLASS}>
            Not <span className="font-normal text-slate-500">(isteğe bağlı)</span>
          </label>
          <textarea
            ref={notesRef}
            id="book-notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Kitap hakkında kısa bir not ekleyebilirsin."
            rows={3}
            maxLength={300}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            className={`${INPUT_CLASS} min-h-[88px] resize-y`}
          />
          <span className="self-end text-xs text-slate-500">
            {form.notes.length}/300
          </span>
          {errors.notes && (
            <p className="m-0 text-xs text-red-600" id="notes-error">
              {errors.notes}
            </p>
          )}
        </div>

        <div className="mt-1 flex flex-wrap gap-2">
          <button
            type="submit"
            className={`${BUTTON_BASE} border-blue-600 bg-blue-600 text-white hover:bg-blue-700`}
          >
            {isEditing ? 'Değişiklikleri kaydet' : 'Kitap ekle'}
          </button>
          {isEditing && (
            <button
              type="button"
              className={`${BUTTON_BASE} border-slate-300 bg-white text-slate-900 hover:bg-slate-50`}
              onClick={onCancelEdit}
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
