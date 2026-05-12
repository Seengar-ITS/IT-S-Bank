'use client'
import { useState } from 'react'

const NETWORKS = ['Jazz', 'Zong', 'Telenor', 'Ufone', 'PTCL']
const AMOUNTS = [50, 100, 200, 500, 1000]

export default function TopupPage() {
  const [phone, setPhone] = useState('')
  const [network, setNetwork] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const token = localStorage.getItem('bank_token')
    const res = await fetch('/api/bank/topup', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ phone_number: phone, network, amount_its: parseFloat(amount) }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📱</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22d3ee' }}>Top-up Done!</h2>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#22d3ee', margin: '12px 0' }}>{amount} ITS</div>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{network} — {phone}</p>
        <a href="/dashboard" style={{ display: 'inline-block', marginTop: 24, background: 'rgba(34,211,238,0.2)', color: '#22d3ee', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Back to Dashboard</a>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>📱 Mobile Top-up</h1>
        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Phone Number</label>
            <input type="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Network</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {NETWORKS.map(n => (
                <button key={n} type="button" onClick={() => setNetwork(n)}
                  style={{ background: network === n ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${network === n ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '10px 4px', color: network === n ? '#22d3ee' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Amount (ITS)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 12 }}>
              {AMOUNTS.map(a => (
                <button key={a} type="button" onClick={() => setAmount(String(a))}
                  style={{ background: amount === String(a) ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${amount === String(a) ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '10px 4px', color: amount === String(a) ? '#6366f1' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {a}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Or enter custom amount" value={amount} onChange={e => setAmount(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#22d3ee,#06b6d4)', color: '#0a0a0a', padding: '15px', borderRadius: 14, fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Processing...' : 'Top-up Now'}
          </button>
        </form>
      </div>
    </div>
  )
}
