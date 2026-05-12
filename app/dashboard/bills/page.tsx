'use client'
import { useState } from 'react'

const PROVIDERS: Record<string, string[]> = {
  Electricity: ['LESCO', 'MEPCO', 'HESCO', 'IESCO', 'PESCO'],
  Gas: ['SSGC', 'SNGPL'],
  Water: ['WASA', 'KW&SB'],
  Internet: ['PTCL', 'Nayatel', 'LinkDotNet'],
}

export default function BillsPage() {
  const [billType, setBillType] = useState('')
  const [provider, setProvider] = useState('')
  const [consumer, setConsumer] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const token = localStorage.getItem('bank_token')
    const res = await fetch('/api/bank/bills/pay', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bill_type: billType, provider, consumer_number: consumer, amount_its: parseFloat(amount) }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>Bill Paid!</h2>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e', margin: '12px 0' }}>{amount} ITS</div>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>{provider} — {consumer}</p>
        <a href="/dashboard/bills" onClick={() => setResult(null)} style={{ display: 'inline-block', marginTop: 24, background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Pay Another Bill</a>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>🧾 Pay Bills</h1>
        <form onSubmit={handlePay}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Bill Type</label>
            <select value={billType} onChange={e => { setBillType(e.target.value); setProvider('') }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required>
              <option value="">Select bill type</option>
              {Object.keys(PROVIDERS).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {billType && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Provider</label>
              <select value={provider} onChange={e => setProvider(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required>
                <option value="">Select provider</option>
                {PROVIDERS[billType].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          {[
            { key: 'consumer', label: 'Consumer Number', placeholder: 'Enter consumer number', setter: setConsumer, value: consumer },
            { key: 'amount', label: 'Amount (ITS)', placeholder: 'Enter amount in ITS', setter: setAmount, value: amount },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>{f.label}</label>
              <input type={f.key === 'amount' ? 'number' : 'text'} placeholder={f.placeholder} value={f.value} onChange={e => f.setter(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required />
            </div>
          ))}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '15px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Processing...' : 'Pay Bill'}
          </button>
        </form>
      </div>
    </div>
  )
}
