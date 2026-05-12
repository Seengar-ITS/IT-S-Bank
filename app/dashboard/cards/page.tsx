'use client'
import { useEffect, useState } from 'react'

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [showCvv, setShowCvv] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/cards', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setCards(d.data); setLoading(false) })
  }, [])

  async function toggleFreeze(card: any) {
    const token = localStorage.getItem('bank_token')
    const ep = card.status === 'active' ? 'freeze' : 'unfreeze'
    const res = await fetch(`/api/bank/cards/${ep}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ card_id: card.id }) })
    const data = await res.json()
    if (data.data) setCards(cards.map(c => c.id === card.id ? data.data : c))
    setMsg(`Card ${ep}d successfully`)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.5)' }}>Loading cards...</div>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>💳 Virtual Cards</h1>
      {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', color: '#22c55e', marginBottom: 20 }}>{msg}</div>}
      {cards.map(card => (
        <div key={card.id} style={{ marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', bottom: -30, left: 100, width: 180, height: 180, borderRadius: '50%', background: 'rgba(34,211,238,0.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#22d3ee' }}>IT-S Bank</div>
              <div style={{ fontSize: 11, background: card.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', padding: '4px 10px', borderRadius: 8, fontWeight: 700, color: card.status === 'active' ? '#22c55e' : '#ef4444' }}>{card.status.toUpperCase()}</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 20, letterSpacing: 3, marginBottom: 24, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{card.card_number}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>CARD HOLDER</div>
                <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>{card.card_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>EXPIRES</div>
                <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{String(card.expiry_month).padStart(2, '0')}/{card.expiry_year}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>CVV</div>
                <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }} onClick={() => setShowCvv(!showCvv)}>{showCvv ? '***' : '👁'}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Daily Limit</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#22d3ee' }}>{Number(card.daily_limit_its).toLocaleString()} ITS</div>
            </div>
            <button onClick={() => toggleFreeze(card)} style={{ background: card.status === 'active' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${card.status === 'active' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: 14, padding: 16, color: card.status === 'active' ? '#ef4444' : '#22c55e', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              {card.status === 'active' ? '🔒 Freeze Card' : '🔓 Unfreeze Card'}
            </button>
          </div>
        </div>
      ))}
      {cards.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>No cards found</div>}
    </div>
  )
}
