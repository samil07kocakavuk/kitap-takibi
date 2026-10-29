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

export function isValidStatus(value) {
  return STATUS_OPTIONS.some((option) => option.value === value)
}
