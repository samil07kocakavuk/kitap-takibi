const ACCOUNTS_KEY = 'kitap-takibi.accounts.v1'
const SESSION_KEY = 'kitap-takibi.session.v1'
const PASSWORD_ITERATIONS = 150000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function bytesToBase64(bytes) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function base64ToBytes(value) {
  const binary = atob(value)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function safeEqual(left, right) {
  if (left.length !== right.length) {
    return false
  }

  let difference = 0

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return difference === 0
}

async function derivePassword(password, salt, iterations) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    256,
  )

  return bytesToBase64(new Uint8Array(bits))
}

async function createPasswordRecord(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePassword(password, salt, PASSWORD_ITERATIONS)

  return { salt: bytesToBase64(salt), hash, iterations: PASSWORD_ITERATIONS }
}

async function matchesPassword(password, record) {
  if (!record || typeof record.salt !== 'string' || typeof record.hash !== 'string') {
    return false
  }

  const salt = base64ToBytes(record.salt)
  const iterations = Number.isInteger(record.iterations)
    ? record.iterations
    : PASSWORD_ITERATIONS
  const hash = await derivePassword(password, salt, iterations)

  return safeEqual(hash, record.hash)
}

function isValidAccount(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      asText(value.id) &&
      asText(value.name) &&
      asText(value.email) &&
      typeof value.password === 'object' &&
      value.password &&
      typeof value.password.hash === 'string' &&
      typeof value.password.salt === 'string' &&
      typeof value.createdAt === 'string',
  )
}

function toPublicAccount(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  }
}

function readAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)

    if (raw === null) {
      return { accounts: [], error: '' }
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return { accounts: [], error: 'Kayıtlı hesap verisi okunamadı.' }
    }

    const accounts = parsed.filter(isValidAccount)

    return {
      accounts,
      error:
        accounts.length === parsed.length
          ? ''
          : 'Bazı hesap kayıtları okunamadığı için yüklenemedi.',
    }
  } catch {
    return { accounts: [], error: 'Kayıtlı hesap verisi okunamadı.' }
  }
}

function writeAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
    return true
  } catch {
    return false
  }
}

function createId() {
  return `acc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function normalizeEmail(value) {
  return asText(value).toLowerCase()
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(normalizeEmail(value))
}

export async function createAccount({ name, email, password }) {
  const cleanName = asText(name)
  const cleanEmail = normalizeEmail(email)
  const cleanPassword = typeof password === 'string' ? password : ''

  if (cleanName.length < 2) {
    return { error: 'Ad soyad en az 2 karakter olmalı.' }
  }

  if (cleanName.length > 60) {
    return { error: 'Ad soyad en fazla 60 karakter olabilir.' }
  }

  if (!isValidEmail(cleanEmail)) {
    return { error: 'Geçerli bir e-posta adresi girin.' }
  }

  if (cleanPassword.length < 8) {
    return { error: 'Şifre en az 8 karakter olmalı.' }
  }

  if (cleanPassword.length > 128) {
    return { error: 'Şifre en fazla 128 karakter olabilir.' }
  }

  const { accounts, error } = readAccounts()

  if (error) {
    return { error }
  }

  if (accounts.some((account) => account.email === cleanEmail)) {
    return { error: 'Bu e-posta ile bir hesap zaten var.' }
  }

  let passwordRecord

  try {
    passwordRecord = await createPasswordRecord(cleanPassword)
  } catch {
    return {
      error:
        'Bu tarayıcıda güvenli şifreleme kullanılamıyor. Başka bir tarayıcı deneyin.',
    }
  }

  const account = {
    id: createId(),
    name: cleanName,
    email: cleanEmail,
    password: passwordRecord,
    createdAt: new Date().toISOString(),
  }

  if (!writeAccounts([...accounts, account])) {
    return {
      error:
        'Hesap kaydedilemedi. Tarayıcı depolaması kapalı veya dolu olabilir.',
    }
  }

  return { account: toPublicAccount(account), isFirstAccount: accounts.length === 0 }
}

export async function authenticate({ email, password }) {
  const cleanEmail = normalizeEmail(email)
  const cleanPassword = typeof password === 'string' ? password : ''

  if (!cleanEmail || !cleanPassword) {
    return { error: 'E-posta ve şifre gerekli.' }
  }

  const { accounts, error } = readAccounts()

  if (error) {
    return { error }
  }

  const account = accounts.find((candidate) => candidate.email === cleanEmail)
  let valid = false

  if (account) {
    try {
      valid = await matchesPassword(cleanPassword, account.password)
    } catch {
      return {
        error:
          'Bu tarayıcıda güvenli şifreleme kullanılamıyor. Başka bir tarayıcı deneyin.',
      }
    }
  }

  if (!account || !valid) {
    return { error: 'E-posta veya şifre hatalı.' }
  }

  return { account: toPublicAccount(account) }
}

export function updateAccountName(accountId, name) {
  const cleanName = asText(name)

  if (cleanName.length < 2) {
    return { error: 'Ad soyad en az 2 karakter olmalı.' }
  }

  if (cleanName.length > 60) {
    return { error: 'Ad soyad en fazla 60 karakter olabilir.' }
  }

  const { accounts, error } = readAccounts()

  if (error) {
    return { error }
  }

  const account = accounts.find((candidate) => candidate.id === accountId)

  if (!account) {
    return { error: 'Hesap bulunamadı.' }
  }

  const updated = { ...account, name: cleanName }
  const nextAccounts = accounts.map((candidate) =>
    candidate.id === accountId ? updated : candidate,
  )

  if (!writeAccounts(nextAccounts)) {
    return { error: 'Değişiklik kaydedilemedi. Tarayıcı depolaması kullanılamıyor.' }
  }

  return { account: toPublicAccount(updated) }
}

export async function changePassword(accountId, currentPassword, newPassword) {
  const cleanCurrent = typeof currentPassword === 'string' ? currentPassword : ''
  const cleanNew = typeof newPassword === 'string' ? newPassword : ''

  if (cleanNew.length < 8) {
    return { error: 'Yeni şifre en az 8 karakter olmalı.' }
  }

  if (cleanNew.length > 128) {
    return { error: 'Yeni şifre en fazla 128 karakter olabilir.' }
  }

  const { accounts, error } = readAccounts()

  if (error) {
    return { error }
  }

  const account = accounts.find((candidate) => candidate.id === accountId)

  if (!account) {
    return { error: 'Hesap bulunamadı.' }
  }

  let valid = false

  try {
    valid = await matchesPassword(cleanCurrent, account.password)
  } catch {
    return {
      error:
        'Bu tarayıcıda güvenli şifreleme kullanılamıyor. Başka bir tarayıcı deneyin.',
    }
  }

  if (!valid) {
    return { error: 'Mevcut şifre hatalı.' }
  }

  let passwordRecord

  try {
    passwordRecord = await createPasswordRecord(cleanNew)
  } catch {
    return {
      error:
        'Bu tarayıcıda güvenli şifreleme kullanılamıyor. Başka bir tarayıcı deneyin.',
    }
  }

  const nextAccounts = accounts.map((candidate) =>
    candidate.id === accountId
      ? { ...candidate, password: passwordRecord }
      : candidate,
  )

  if (!writeAccounts(nextAccounts)) {
    return { error: 'Şifre kaydedilemedi. Tarayıcı depolaması kullanılamıyor.' }
  }

  return { ok: true }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)

    if (raw === null) {
      return null
    }

    const parsed = JSON.parse(raw)
    const accountId = parsed && typeof parsed.accountId === 'string' ? parsed.accountId : ''

    if (!accountId) {
      return null
    }

    const { accounts } = readAccounts()
    const account = accounts.find((candidate) => candidate.id === accountId)

    if (!account) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }

    return toPublicAccount(account)
  } catch {
    return null
  }
}

export function storeSession(account) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ accountId: account.id }))
    return true
  } catch {
    return false
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    return undefined
  }

  return undefined
}
