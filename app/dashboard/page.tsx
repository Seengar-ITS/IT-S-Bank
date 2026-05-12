'use client'
import { useEffect, useState } from 'react'

interface Account { account_number: string; balance_its: number; status: string; account_type: string }
interface Transaction { id: string; type: string; amount_its: number; description: string; created_at: string; status: string }

export default function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null)
  const [txns, setTxns] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    Promise.all([
      fetch('/api/bank/account', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/bank/transactions?limit=5', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([acc, tx]) => {
      if (acc.data) setAccount(acc.data)
      if (tx.data) setTxns(tx.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const quickActions = [
    { icon: '📤', label: 'Send', href: '/dashboard/send' },
    { icon: '📥', label: 'Receive', href: '/dashboard/receive' },
    { icon: '🧾', label: 'Bills', href: '/dashboard/bills' },
    { icon: '📱', label: 'Top-up', href: '/dashboard/topup' },
    { icon: '🎯', label: 'Savings', href: '/dashboard/savings' },
    { icon: '💳', label: 'Card', href: '/dashboard/cards' },
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.5)' }}>Loading your account...</div>

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', borderRadius: 24, padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(99,102,241,0.2)' }} />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>IT-S Bank · {account?.account_type?.toUpperCase()} ACCOUNT</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, fontFamily: 'monospace', letterSpacing: 2 }}>{account?.account_number}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Available Balance</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#22d3ee', marginBottom: 4 }}>{Number(account?.balance_its || 0).toLocaleString()} <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>ITS</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>≈ PKR {Number(account?.balance_its || 0).toLocaleString()}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
        {quickActions.map(a => (
          <a key={a.href} href={a.href} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '20px 8px', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'background 0.2s' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{a.label}</div>
          </a>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Transactions</h2>
          <a href="/dashboard/history" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none' }}>View All →</a>
        </div>
        {txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>No transactions yet. Start by receiving ITS!</div>
        ) : txns.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: t.type === 'credit' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {t.type === 'credit' ? '📥' : '📤'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.description || t.type}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(t.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.type === 'credit' ? '#22c55e' : '#ef4444' }}>
                {t.type === 'credit' ? '+' : '-'}{Number(t.amount_its).toLocaleString()} ITS
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
