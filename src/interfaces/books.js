/**
 * @typedef {'okunacak' | 'okunuyor' | 'okundu'} BookStatus
 */

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {number} pageCount
 * @property {BookStatus} status
 * @property {string} notes
 */

/**
 * @typedef {Object} BookFormValues
 * @property {string} title
 * @property {string} author
 * @property {number} pageCount
 * @property {BookStatus} status
 * @property {string} notes
 */

export const STATUS_OPTIONS = [
  { value: 'okunacak', label: 'Okunacak' },
  { value: 'okunuyor', label: 'Okunuyor' },
  { value: 'okundu', label: 'Okundu' },
]

export const STATUS_LABELS = {
  okunacak: 'Okunacak',
  okunuyor: 'Okunuyor',
  okundu: 'Okundu',
}

/**
 * @param {unknown} value
 * @returns {value is BookStatus}
 */
export function isValidStatus(value) {
  return STATUS_OPTIONS.some((option) => option.value === value)
}
