import { useState } from 'react'
import { STATUS_LABELS } from '../interfaces/books.js'
import { buttonClass } from './formClasses.js'

const STATUS_PILL_CLASS = {
  okunacak: 'bg-stone-100 text-stone-600',
  okunuyor: 'bg-brand-soft text-brand-strong',
  okundu: 'bg-emerald-50 text-emerald-700',
}

export default function BookList({ books, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  if (books.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-white px-4 py-8 text-center">
        <h3 className="m-0 text-base font-semibold">Henüz kitap eklenmedi</h3>
        <p className="mt-1.5 text-[13px] text-slate-500">
          İlk kitabını formu doldurarak ekleyebilirsin.
        </p>
      </div>
    )
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {books.map((book) => {
        const isConfirming = confirmId === book.id

        return (
          <li
            key={book.id}
            className="rounded-md border border-stone-200 bg-white p-3.5"
          >
            <div className="flex items-start justify-between gap-3 max-sm:flex-wrap">
              <div className="min-w-0">
                <h3 className="m-0 text-base font-semibold leading-snug [overflow-wrap:anywhere]">
                  {book.title}
                </h3>
                <p className="mt-0.5 text-[13px] text-slate-500 [overflow-wrap:anywhere]">
                  {book.author}
                </p>
                <p className="mt-1 text-xs tabular-nums text-slate-500">
                  {book.pageCount > 0
                    ? `${book.pageCount} sayfa`
                    : 'Sayfa bilgisi yok'}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  STATUS_PILL_CLASS[book.status] ?? 'bg-stone-100 text-stone-600'
                }`}
              >
                {STATUS_LABELS[book.status]}
              </span>
            </div>

            {book.notes && (
              <p className="mt-2.5 whitespace-pre-wrap text-[13px] text-slate-700 [overflow-wrap:anywhere]">
                {book.notes}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 border-t border-stone-200 pt-2.5">
              {isConfirming ? (
                <>
                  <p className="mr-auto text-[13px] text-red-600 max-sm:basis-full">
                    Bu kitap silinsin mi?
                  </p>
                  <button
                    type="button"
                    className={`${buttonClass('danger', 'sm')} max-sm:flex-1`}
                    onClick={() => {
                      onDelete(book.id)
                      setConfirmId(null)
                    }}
                  >
                    Evet, sil
                  </button>
                  <button
                    type="button"
                    className={`${buttonClass('ghost', 'sm')} max-sm:flex-1`}
                    onClick={() => setConfirmId(null)}
                  >
                    Vazgeç
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${buttonClass('ghost', 'sm')} max-sm:flex-1`}
                    onClick={() => onEdit(book)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className={`${buttonClass('dangerGhost', 'sm')} max-sm:flex-1`}
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
