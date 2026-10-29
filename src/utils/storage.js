import { isValidStatus } from '../interfaces/books.js'

export const LEGACY_STORAGE_KEY = 'kitap-takibi.books.v1'

export function booksStorageKey(userId) {
  return `${LEGACY_STORAGE_KEY}.${userId}`
}

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
  const pageCount = Number(value.pageCount)

  if (!id || !title || !author || !isValidStatus(value.status)) {
    return null
  }

  return {
    id,
    title,
    author,
    pageCount:
      Number.isInteger(pageCount) && pageCount > 0 && pageCount <= 10000
        ? pageCount
        : 0,
    status: value.status,
    notes: notes.slice(0, 300),
  }
}

export function loadBooks(userId) {
  if (!userId) {
    return { books: [], error: '' }
  }

  try {
    const raw = localStorage.getItem(booksStorageKey(userId))

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

export function saveBooks(userId, books) {
  if (!userId) {
    return false
  }

  try {
    localStorage.setItem(booksStorageKey(userId), JSON.stringify(books))
    return true
  } catch {
    return false
  }
}

export function migrateLegacyBooks(userId) {
  if (!userId) {
    return false
  }

  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)

    if (legacy === null) {
      return false
    }

    if (localStorage.getItem(booksStorageKey(userId)) !== null) {
      return false
    }

    localStorage.setItem(booksStorageKey(userId), legacy)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
