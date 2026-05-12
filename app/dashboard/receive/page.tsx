'use client'
import { useEffect, useState } from 'react'

export default function ReceivePage() {
  const [account, setAccount] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('bank_token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/bank/account', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.data) setAccount(d.data) })
  }, [])

  function copy() {
    if (account?.account_number) { navigator.clipboard.writeText(account.account_number); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>📥 Receive ITS</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Share your account number to receive ITS</p>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 40 }}>
        <div style={{ background: 'white', width: 200, height: 200, margin: '0 auto 24px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#333' }}>
          QR Code<br />{account?.account_number}
        </div>
        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Your IT-S Bank Account Number</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee', letterSpacing: 2, fontFamily: 'monospace' }}>{account?.account_number || 'Loading...'}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={copy} style={{ flex: 1, background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(99,102,241,0.2)', border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.4)'}`, color: copied ? '#22c55e' : '#6366f1', padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
