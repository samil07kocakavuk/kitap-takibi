import { useState } from 'react'
import { STATUS_LABELS } from '../data/statuses.js'

export default function BookList({ books, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__mark" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 0 4 23.5V5.5Z" />
            <path d="M8 7h8M8 11h6" />
          </svg>
        </span>
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
              <div>
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
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
