'use client'
import { useEffect, useState } from 'react'

interface Txn { id: string; type: string; amount_its: number; balance_after: number; description: string; created_at: string; status: string; reference_id: string }

export default function HistoryPage() {
  const [txns, setTxns] = useState<Txn[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/transactions', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setTxns(d.data); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? txns : txns.filter(t => t.type.includes(filter))
  const typeColor = (t: string) => t === 'credit' ? '#22c55e' : t.includes('bill') ? '#f59e0b' : t.includes('topup') ? '#22d3ee' : '#ef4444'
  const typeIcon = (t: string) => t === 'credit' ? '📥' : t.includes('bill') ? '🧾' : t.includes('topup') ? '📱' : '📤'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Transaction History</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>All your IT-S Bank transactions</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'credit', 'debit', 'bill', 'topup'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filter === f ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '7px 16px', color: filter === f ? '#6366f1' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
        {loading ? <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No transactions</div>
          : filtered.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center', padding: '16px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${typeColor(t.type)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{typeIcon(t.type)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{t.description || t.type}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(t.created_at).toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: typeColor(t.type) }}>{t.type === 'credit' ? '+' : '-'}{Number(t.amount_its).toLocaleString()} ITS</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Bal: {Number(t.balance_after).toLocaleString()} ITS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
