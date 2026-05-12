'use client'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [account, setAccount] = useState<any>(null)
  const [pin, setPin] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/account', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setAccount(d.data); setLoading(false) })
  }, [])

  async function changePin(e: React.FormEvent) {
    e.preventDefault()
    if (pin.new !== pin.confirm) { setError('New PINs do not match'); return }
    if (pin.new.length !== 6) { setError('PIN must be 6 digits'); return }
    const token = localStorage.getItem('bank_token')
    const res = await fetch('/api/bank/account/pin', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ current_pin: pin.current, new_pin: pin.new }) })
    const data = await res.json()
    if (data.error) { setError(data.error); return }
    setMsg('PIN updated successfully!'); setError(''); setPin({ current: '', new: '', confirm: '' })
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.5)' }}>Loading...</div>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>👤 Account Profile</h1>
      {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', color: '#22c55e', marginBottom: 20 }}>{msg}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Account Details</h2>
          {[
            { label: 'Account Number', value: account?.account_number, mono: true, color: '#22d3ee' },
            { label: 'Account Type', value: account?.account_type?.toUpperCase(), mono: false, color: '#6366f1' },
            { label: 'Balance', value: `${Number(account?.balance_its || 0).toLocaleString()} ITS`, mono: false, color: '#22c55e' },
            { label: 'Status', value: account?.status?.toUpperCase(), mono: false, color: account?.status === 'active' ? '#22c55e' : '#ef4444' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: f.mono ? 16 : 18, fontWeight: 700, color: f.color, fontFamily: f.mono ? 'monospace' : 'inherit', letterSpacing: f.mono ? 2 : 0 }}>{f.value}</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Member since {account?.created_at ? new Date(account.created_at).toLocaleDateString() : ''}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Change PIN</h2>
          <form onSubmit={changePin}>
            {[
              { key: 'current', label: 'Current PIN', placeholder: 'Current 6-digit PIN' },
              { key: 'new', label: 'New PIN', placeholder: 'New 6-digit PIN' },
              { key: 'confirm', label: 'Confirm New PIN', placeholder: 'Confirm new PIN' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type="password" placeholder={f.placeholder} value={pin[f.key as keyof typeof pin]} onChange={e => setPin({ ...pin, [f.key]: e.target.value })} maxLength={6}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>Update PIN</button>
          </form>
        </div>
      </div>
    </div>
  )
}
