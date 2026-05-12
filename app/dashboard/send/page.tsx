'use client'
import { useEffect, useState } from 'react'

export default function SendPage() {
  const [form, setForm] = useState({ receiver_account: '', amount_its: '', description: '', pin: '' })
  const [beneficiaries, setBeneficiaries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (token) fetch('/api/bank/beneficiaries', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setBeneficiaries(d.data) })
  }, [])

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const token = localStorage.getItem('bank_token')
    const res = await fetch('/api/bank/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, amount_its: parseFloat(form.amount_its) }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    setResult(data.data); setLoading(false)
  }

  if (result) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>Sent!</h2>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e', margin: '12px 0' }}>{form.amount_its} ITS</div>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Ref: {result.reference_id?.slice(0, 16)}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <a href="/dashboard/send" onClick={() => { setResult(null); setForm({ receiver_account: '', amount_its: '', description: '', pin: '' }) }} style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Send Again</a>
          <a href="/dashboard" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Dashboard</a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>📤 Send ITS</h1>
        {beneficiaries.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Saved Beneficiaries</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {beneficiaries.map(b => (
                <button key={b.id} onClick={() => setForm({ ...form, receiver_account: b.beneficiary_account })}
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '6px 12px', color: '#6366f1', cursor: 'pointer', fontSize: 13 }}>
                  {b.nickname || b.beneficiary_name}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handle}>
          {[
            { key: 'receiver_account', label: 'Receiver Account Number', placeholder: 'ITS-XXXXXXXXXXXX', type: 'text' },
            { key: 'amount_its', label: 'Amount (ITS)', placeholder: 'Enter ITS amount', type: 'number' },
            { key: 'description', label: 'Description (optional)', placeholder: 'What is this for?', type: 'text' },
            { key: 'pin', label: 'Confirm PIN', placeholder: '6-digit PIN', type: 'password' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 16px', color: 'white', width: '100%', outline: 'none', fontSize: 15, boxSizing: 'border-box' }} required={f.key !== 'description'} />
            </div>
          ))}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '15px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Sending...' : 'Send ITS'}
          </button>
        </form>
      </div>
    </div>
  )
}
