import { useEffect, useState } from 'react'

function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export function navigate(path, { replace = false } = {}) {
  const hash = `#${path}`

  if (replace) {
    window.location.replace(hash)
    return
  }

  window.location.hash = path
}

export function useHashRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const handleChange = () => setPath(currentPath())

    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return path
}
