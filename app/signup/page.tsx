'use client'
import { useState } from 'react'

export default function SignupPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', pin: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ account_number: string } | null>(null)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (form.pin.length !== 6 || !/^\d+$/.test(form.pin)) { setError('PIN must be exactly 6 digits'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/bank/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 24, padding: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>Account Created!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>Welcome to IT-S Bank. Your account is ready.</p>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Your Account Number</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee', letterSpacing: 2 }}>{result.account_number}</div>
        </div>
        <a href="/login" style={{ display: 'block', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '14px', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Sign In to Dashboard</a>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Open IT-S Bank Account</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Free account · Virtual card included · Instant setup</p>

        <form onSubmit={handleSignup}>
          {[
            { key: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Secure password (min 8 chars)' },
            { key: 'pin', label: '6-Digit PIN', type: 'password', placeholder: 'Your 6-digit PIN (e.g. 123456)' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} maxLength={f.key === 'pin' ? 6 : undefined}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required />
            </div>
          ))}

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 20 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', color: 'white', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Already have an account? <a href="/login" style={{ color: '#6366f1', textDecoration: 'none' }}>Sign In</a></p>
      </div>
    </div>
  )
}
