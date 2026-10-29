import { useState } from 'react'
import { STATUS_LABELS } from '../data/statuses.js'

export default function BookList({ books, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <h3>Henüz kitap eklenmedi</h3>
        <p>İlk kitabını formu doldurarak ekleyebilirsin.</p>
      </div>
    )
  }

  return (
    <ul className="book-list">
      {books.map((book) => {
        const isConfirming = confirmId === book.id

        return (
          <li key={book.id} className="book-card">
            <div className="book-card__header">
              <div className="book-card__info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-meta">
                  {book.pageCount > 0
                    ? `${book.pageCount} sayfa`
                    : 'Sayfa bilgisi yok'}
                </p>
              </div>
              <span className={`status-pill status-pill--${book.status}`}>
                {STATUS_LABELS[book.status]}
              </span>
            </div>

            {book.notes && <p className="book-notes">{book.notes}</p>}

            <div className="book-card__actions">
              {isConfirming ? (
                <>
                  <p className="confirm-text">Bu kitap silinsin mi?</p>
                  <button
                    type="button"
                    className="button button--danger button--small"
                    onClick={() => {
                      onDelete(book.id)
                      setConfirmId(null)
                    }}
                  >
                    Evet, sil
                  </button>
                  <button
                    type="button"
                    className="button button--ghost button--small"
                    onClick={() => setConfirmId(null)}
                  >
                    Vazgeç
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="button button--ghost button--small"
                    onClick={() => onEdit(book)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="button button--danger-ghost button--small"
                    onClick={() => setConfirmId(book.id)}
                  >
                    Sil
                  </button>
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
