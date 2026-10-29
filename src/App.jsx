import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import { navigate, useHashRoute } from './hooks/useHashRoute.js'
import AccountPage from './pages/AccountPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import {
  authenticate,
  changePassword,
  clearSession,
  createAccount,
  loadSession,
  storeSession,
  updateAccountName,
} from './utils/auth.js'
import { migrateLegacyBooks } from './utils/storage.js'

const ROUTES = ['/giris', '/kayit', '/kitaplar', '/hesabim']

export default function App() {
  const route = useHashRoute()
  const [session, setSession] = useState(loadSession)

  const targetRoute = resolveRoute(route, Boolean(session))

  useEffect(() => {
    if (targetRoute !== route) {
      navigate(targetRoute, { replace: true })
    }
  }, [route, targetRoute])

  async function handleRegister(values) {
    const result = await createAccount(values)

    if (result.error) {
      return result
    }

    if (result.isFirstAccount) {
      migrateLegacyBooks(result.account.id)
    }

    storeSession(result.account)
    setSession(result.account)
    navigate('/kitaplar', { replace: true })

    return result
  }

  async function handleLogin(values) {
    const result = await authenticate(values)

    if (result.error) {
      return result
    }

    storeSession(result.account)
    setSession(result.account)
    navigate('/kitaplar', { replace: true })

    return result
  }

  function handleLogout() {
    clearSession()
    setSession(null)
    navigate('/giris', { replace: true })
  }

  function handleUpdateName(name) {
    const result = updateAccountName(session.id, name)

    if (result.account) {
      storeSession(result.account)
      setSession(result.account)
    }

    return result
  }

  function handleChangePassword(currentPassword, newPassword) {
    return changePassword(session.id, currentPassword, newPassword)
  }

  function renderPage() {
    if (targetRoute === '/kayit') {
      return <RegisterPage onRegister={handleRegister} />
    }

    if (targetRoute === '/hesabim') {
      return (
        <AccountPage
          key={session.id}
          account={session}
          onUpdateName={handleUpdateName}
          onChangePassword={handleChangePassword}
        />
      )
    }

    if (targetRoute === '/kitaplar') {
      return <BooksPage key={session.id} accountId={session.id} />
    }

    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen">
      <Header account={session} route={targetRoute} onLogout={handleLogout} />
      {targetRoute === route ? renderPage() : null}
    </div>
  )
}

function resolveRoute(route, hasSession) {
  if (hasSession) {
    return ROUTES.includes(route) && route !== '/giris' && route !== '/kayit'
      ? route
      : '/kitaplar'
  }

  return route === '/kayit' ? '/kayit' : '/giris'
}
