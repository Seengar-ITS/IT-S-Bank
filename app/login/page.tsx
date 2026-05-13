// IT-S OAuth Component — injected
'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', pin: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/bank/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    if (typeof window !== 'undefined') { localStorage.setItem('bank_token', data.token); window.location.href = '/dashboard' }
  }

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, margin: '0 auto 16px' }}>BANK</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Sign In to IT-S Bank</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Enter your email, password, and PIN</p>
        </div>

        
      {/* IT-S OAuth Buttons — Future Feature */}
      <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px'}}>
        <button onClick={()=>{window.location.href=`https://its-id.vercel.app/oauth/authorize?redirect_uri=${encodeURIComponent(window.location.origin+'/auth/callback')}&scope=openid+profile+email`}} style={{padding:'11px',borderRadius:'8px',border:'2px solid #f0a500',background:'transparent',color:'white',fontWeight:'600',cursor:'pointer',width:'100%',fontSize:'14px'}}>🪪 Sign in with IT-S ID</button>
        <button onClick={()=>{window.location.href=`https://its-id.vercel.app/oauth/authorize?provider=google&redirect_uri=${encodeURIComponent(window.location.origin+'/auth/callback')}`}} style={{padding:'11px',borderRadius:'8px',border:'1px solid #444',background:'transparent',color:'white',cursor:'pointer',width:'100%',fontSize:'14px'}}>G  Sign in with Google</button>
        <button onClick={()=>{window.location.href=`https://its-id.vercel.app/oauth/authorize?provider=github&redirect_uri=${encodeURIComponent(window.location.origin+'/auth/callback')}`}} style={{padding:'11px',borderRadius:'8px',border:'1px solid #444',background:'transparent',color:'white',cursor:'pointer',width:'100%',fontSize:'14px'}}>⌥ Sign in with GitHub</button>
      </div>
      {/* or continue with email */}
      <form onSubmit={handleLogin}>
          {[
            { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Your password' },
            { key: 'pin', label: '6-Digit PIN', type: 'password', placeholder: '6-digit PIN' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required />
            </div>
          ))}

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#22d3ee)', color: 'white', padding: '15px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', marginTop: 8 }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>No account? <a href="/signup" style={{ color: '#22d3ee', textDecoration: 'none' }}>Open Free Account</a></p>
      </div>
    </div>
  )
}
