import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'yes')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 12,
      left: 12,
      right: 12,
      background: '#fff',
      padding: '12px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      zIndex: 9999,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: 14 }}>
        We use cookies for site functionality and analytics. See our <a href="/privacy-policy">Privacy Policy</a>.
      </div>
      <div>
        <button onClick={accept} style={{ marginLeft: 12, padding: '8px 12px' }}>Accept</button>
      </div>
    </div>
  )
}