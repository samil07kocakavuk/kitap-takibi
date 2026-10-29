import { isValidStatus } from '../data/statuses.js'

export const STORAGE_KEY = 'kitap-takibi.books.v1'

function asText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeBook(value) {
  if (!value || typeof value !== 'object') {
    return null
  }

  const id = asText(value.id)
  const title = asText(value.title)
  const author = asText(value.author)
  const notes = asText(value.notes)

  if (!id || !title || !author || !isValidStatus(value.status)) {
    return null
  }

  return {
    id,
    title,
    author,
    status: value.status,
    notes: notes.slice(0, 300),
  }
}

export function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw === null) {
      return { books: [], error: '' }
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return {
        books: [],
        error: 'Kayıtlı kitap verisi beklenen biçimde değil. Boş bir listeyle devam edebilirsin.',
      }
    }

    const books = parsed.map(normalizeBook).filter(Boolean)
    const hasInvalidRecords = books.length !== parsed.length

    return {
      books,
      error: hasInvalidRecords
        ? 'Bazı kayıtlar okunamadığı için listeye eklenmedi.'
        : '',
    }
  } catch {
    return {
      books: [],
      error: 'Kayıtlı veriler okunamadı. Yeni kayıtlarla devam edebilirsin.',
    }
  }
}

export function saveBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    return true
  } catch {
    return false
  }
}
