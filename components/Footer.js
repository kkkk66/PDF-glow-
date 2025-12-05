import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ padding: '24px', textAlign: 'center' }}>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> |{' '}
        <Link href="/privacy-policy">Privacy Policy</Link> | <Link href="/contact">Contact</Link>
      </nav>
      <p style={{ marginTop: 8 }}>© {new Date().getFullYear()} PDF Glow</p>
    </footer>
  )
}