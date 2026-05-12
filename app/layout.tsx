import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IT-S Bank — Your Bank. Your Rules.',
  description: 'Complete online banking powered by IT-S Coin. Send, receive, pay bills, top-up.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>BANK</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>IT-S Bank</div>
              <div style={{ fontSize: 11, color: '#22d3ee' }}>IT-S Universe</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 20, fontSize: 14, alignItems: 'center' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</a>
            <a href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Sign In</a>
            <a href="/signup" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Open Account</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 80 }}>
          <div style={{ marginBottom: 8, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>IT-S Bank</div>
          <div>IT-S Universe © 2026 · Powered by IT-S Coin (ITS) · Your Bank. Your Rules.</div>
        </footer>
      </body>
    </html>
  )
}
