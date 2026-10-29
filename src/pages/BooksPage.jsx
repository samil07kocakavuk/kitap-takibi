import { useEffect, useState } from 'react'
import BookForm from '../components/BookForm.jsx'
import BookList from '../components/BookList.jsx'
import { loadBooks, saveBooks } from '../utils/storage.js'

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export default function BooksPage() {
  const [data, setData] = useState(loadBooks)
  const [editingBook, setEditingBook] = useState(null)
  const [feedback, setFeedback] = useState(() =>
    data.error ? { type: 'error', message: data.error } : null,
  )

  const books = data.books

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(
      () => setFeedback(null),
      feedback.type === 'error' ? 6000 : 4000,
    )

    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  function commit(nextBooks, successMessage) {
    setData({ books: nextBooks, error: '' })

    if (saveBooks(nextBooks)) {
      setFeedback({ type: 'success', message: successMessage })
    } else {
      setFeedback({
        type: 'error',
        message:
          'Değişiklik tarayıcıya kaydedilemedi. Tarayıcı depolaması kapalı veya dolu olabilir.',
      })
    }
  }

  function handleSubmit(values) {
    if (editingBook) {
      if (!books.some((book) => book.id === editingBook.id)) {
        setEditingBook(null)
        setFeedback({ type: 'error', message: 'Düzenlenecek kitap bulunamadı.' })
        return
      }

      const nextBooks = books.map((book) =>
        book.id === editingBook.id ? { ...book, ...values } : book,
      )

      commit(nextBooks, 'Kitap güncellendi.')
      setEditingBook(null)
      return
    }

    const newBook = { id: createId(), ...values }
    commit([newBook, ...books], 'Kitap eklendi.')
  }

  function handleEdit(book) {
    setEditingBook(book)
  }

  function handleCancelEdit() {
    setEditingBook(null)
  }

  function handleDelete(id) {
    if (!books.some((book) => book.id === id)) {
      setFeedback({ type: 'error', message: 'Silinecek kitap bulunamadı.' })
      return
    }

    commit(
      books.filter((book) => book.id !== id),
      'Kitap silindi.',
    )

    if (editingBook?.id === id) {
      setEditingBook(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-3 pb-8 pt-6 sm:px-5 sm:pt-8">
      <header className="mb-6">
        <h1 className="m-0 text-2xl font-bold leading-tight tracking-tight sm:text-[28px]">
          Kitap Takibi
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Okuduğun ve okuyacağın kitapları tek yerde takip et.
        </p>
      </header>

      {feedback && (
        <div
          className={`mb-4 rounded-md border px-3 py-2.5 text-[13px] ${
            feedback.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </div>
      )}

      <main className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <BookForm
          editingBook={editingBook}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="m-0 text-lg font-semibold">Kitaplarım</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Eklediğin kitaplar burada listelenir.
            </p>
          </div>

          <BookList
            books={books}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="mt-6 text-center text-xs text-slate-500">
        Veriler yalnızca bu tarayıcıda saklanır.
      </footer>
    </div>
  )
}
