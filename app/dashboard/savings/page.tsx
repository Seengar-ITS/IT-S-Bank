'use client'
import { useEffect, useState } from 'react'

export default function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [form, setForm] = useState({ goal_name: '', target_its: '', deadline: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = () => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/savings', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setGoals(d.data); setLoading(false) })
  }

  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('bank_token')
    const res = await fetch('/api/bank/savings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, target_its: parseFloat(form.target_its) }) })
    const data = await res.json()
    if (data.data) { setMsg('Goal created!'); setForm({ goal_name: '', target_its: '', deadline: '' }); load() }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>🎯 Savings Goals</h1>
      {msg && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', color: '#22c55e', marginBottom: 20 }}>{msg}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Create New Goal</h2>
            <form onSubmit={create}>
              {[
                { key: 'goal_name', label: 'Goal Name', placeholder: 'e.g. New Phone', type: 'text' },
                { key: 'target_its', label: 'Target (ITS)', placeholder: 'e.g. 10000', type: 'number' },
                { key: 'deadline', label: 'Deadline (optional)', placeholder: '', type: 'date' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', width: '100%', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} required={f.key !== 'deadline'} />
                </div>
              ))}
              <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: 'white', padding: '13px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 4 }}>Create Goal</button>
            </form>
          </div>
        </div>
        <div>
          {loading ? <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 40 }}>Loading...</div>
            : goals.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>No savings goals yet</div>
            : goals.map(g => {
              const pct = Math.min(100, (Number(g.current_its) / Number(g.target_its)) * 100)
              return (
                <div key={g.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{g.goal_name}</div>
                    <div style={{ fontSize: 13, color: '#22d3ee', fontWeight: 600 }}>{pct.toFixed(0)}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 100, height: 8, marginBottom: 12, overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(90deg,#6366f1,#22d3ee)', height: '100%', borderRadius: 100, width: `${pct}%`, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    <span>{Number(g.current_its).toLocaleString()} ITS saved</span>
                    <span>Target: {Number(g.target_its).toLocaleString()} ITS</span>
                  </div>
                  {g.deadline && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Deadline: {new Date(g.deadline).toLocaleDateString()}</div>}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
