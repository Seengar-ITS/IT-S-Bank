'use client'
import { useEffect, useState } from 'react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/notifications', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setNotifications(d.data); setLoading(false) })
  }

  useEffect(load, [])

  async function markRead() {
    const token = localStorage.getItem('bank_token')
    await fetch('/api/bank/notifications', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  async function clearAll() {
    const token = localStorage.getItem('bank_token')
    await fetch('/api/bank/notifications', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setNotifications([])
  }

  const typeIcon = (t: string) => ({ welcome: '🎉', transfer: '💸', topup: '📱', bill_payment: '🧾', security: '🔐' }[t] || '🔔')

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🔔 Notifications</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={markRead} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Mark All Read</button>
          <button onClick={clearAll} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Clear All</button>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
        {loading ? <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
          : notifications.length === 0 ? <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No notifications</div>
          : notifications.map((n, i) => (
          <div key={n.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 24px', borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: n.is_read ? 'transparent' : 'rgba(99,102,241,0.04)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{typeIcon(n.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 15, marginBottom: 4 }}>{n.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5 }}>{n.message}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
            {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', marginTop: 6, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
