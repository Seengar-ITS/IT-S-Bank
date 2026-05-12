'use client'
import { useEffect, useState } from 'react'

export default function BankAdmin() {
  const [data, setData] = useState<any>({ accounts: [], stats: {} })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/bank/admin/accounts').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  async function toggleSuspend(id: string) {
    const res = await fetch(`/api/bank/admin/suspend/${id}`, { method: 'POST' })
    const d = await res.json()
    setMsg(d.message || 'Done')
    setData((prev: any) => ({ ...prev, accounts: prev.accounts.map((a: any) => a.id === id ? d.data : a) }))
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
        <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '6px 14px', fontSize: 12, color: '#ef4444', fontWeight: 700 }}>ADMIN</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>IT-S Bank Admin Panel</h1>
      </div>
      {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', color: '#22c55e', marginBottom: 24 }}>{msg}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Accounts', value: data.stats?.total_accounts || 0, color: '#6366f1' },
          { label: 'Total Balance', value: `${Number(data.stats?.total_balance || 0).toLocaleString()} ITS`, color: '#22d3ee' },
          { label: 'Total Transactions', value: data.stats?.total_transactions || 0, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 700 }}>All Accounts</div>
        {loading ? <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
          : data.accounts.map((a: any, i: number) => (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: i < data.accounts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'monospace' }}>{a.account_number}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(a.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#22d3ee' }}>{Number(a.balance_its).toLocaleString()} ITS</div>
            <div style={{ background: a.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: a.status === 'active' ? '#22c55e' : '#ef4444', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{a.status}</div>
            <button onClick={() => toggleSuspend(a.id)} style={{ background: a.status === 'active' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${a.status === 'active' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: a.status === 'active' ? '#ef4444' : '#22c55e', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              {a.status === 'active' ? 'Suspend' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
