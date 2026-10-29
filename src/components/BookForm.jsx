import { useEffect, useRef, useState } from 'react'
import { STATUS_OPTIONS, isValidStatus } from '../data/statuses.js'

const EMPTY_FORM = {
  title: '',
  author: '',
  pageCount: '',
  status: 'okunacak',
  notes: '',
}

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
    <section className="panel form-panel" aria-labelledby="form-title">
      <div className="panel-heading">
        <h2 id="form-title">{isEditing ? 'Kitabı düzenle' : 'Yeni kitap'}</h2>
        <p>
          {isEditing
            ? 'Bilgileri güncelle ve kaydet.'
            : 'Kitabını eklemek için formu doldur.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="book-title">
            Kitap adı <span aria-hidden="true">*</span>
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
          />
          {errors.title && (
            <p className="field-error" id="title-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="book-author">
            Yazar <span aria-hidden="true">*</span>
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
          />
          {errors.author && (
            <p className="field-error" id="author-error">
              {errors.author}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="book-page-count">
            Sayfa sayısı <span aria-hidden="true">*</span>
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
          />
          {errors.pageCount && (
            <p className="field-error" id="page-count-error">
              {errors.pageCount}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="book-status">
            Durum <span aria-hidden="true">*</span>
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
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="field-error" id="status-error">
              {errors.status}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="book-notes">
            Not <span className="optional">(isteğe bağlı)</span>
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
          />
          <span className="field-foot">{form.notes.length}/300</span>
          {errors.notes && (
            <p className="field-error" id="notes-error">
              {errors.notes}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            {isEditing ? 'Değişiklikleri kaydet' : 'Kitap ekle'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="button button--ghost"
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
