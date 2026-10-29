import { useEffect, useState } from 'react'
import BookForm from './components/BookForm.jsx'
import BookList from './components/BookList.jsx'
import { loadBooks, saveBooks } from './utils/storage.js'

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export default function App() {
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
    <div className="page">
      <header className="page-header">
        <h1>Kitap Takibi</h1>
        <p className="lede">
          Okuduğun ve okuyacağın kitapları tek yerde takip et.
        </p>
      </header>

      {feedback && (
        <div
          className={`feedback feedback--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </div>
      )}

      <main className="layout">
        <BookForm
          editingBook={editingBook}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <section className="panel list-panel" aria-labelledby="list-title">
          <div className="panel-heading">
            <h2 id="list-title">Kitaplarım</h2>
            <p>Eklediğin kitaplar burada listelenir.</p>
          </div>

          <BookList
            books={books}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="page-footer">
        Veriler yalnızca bu tarayıcıda saklanır.
      </footer>
    </div>
  )
}
