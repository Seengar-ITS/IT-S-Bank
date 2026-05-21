// IT-S Universe — Open Access
export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 13, color: '#22d3ee' }}>
          🏦 IT-S Bank — Powered by IT-S Coin
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginBottom: 24, background: 'linear-gradient(135deg,#ffffff 40%,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Bank.<br />Your Rules.
        </h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          A complete online bank running on IT-S Coin (ITS). Send money, pay bills, top-up mobiles, save goals — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', color: 'white', padding: '16px 40px', borderRadius: 16, fontWeight: 800, fontSize: 17, textDecoration: 'none', display: 'inline-block' }}>Open Free Account</a>
          <a href="/login" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: 16, fontWeight: 600, fontSize: 17, textDecoration: 'none', display: 'inline-block' }}>Sign In</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
        {[
          { icon: '💸', title: 'Send & Receive ITS', desc: 'Transfer ITS to any account number instantly. 0% transfer fee within IT-S Bank.', color: '#6366f1' },
          { icon: '💳', title: 'Virtual Card', desc: 'Auto-generated virtual card with 16-digit number, CVV, and expiry. Freeze anytime.', color: '#22d3ee' },
          { icon: '🧾', title: 'Pay Bills', desc: 'Pay electricity, gas, water, internet bills directly from your ITS balance.', color: '#22c55e' },
          { icon: '📱', title: 'Mobile Top-up', desc: 'Top up any Pakistani network — Jazz, Zong, Telenor, Ufone, PTCL.', color: '#f59e0b' },
          { icon: '🎯', title: 'Savings Goals', desc: 'Create savings goals, set targets and deadlines. Watch your money grow.', color: '#8b5cf6' },
          { icon: '🔔', title: 'Smart Notifications', desc: 'Real-time alerts for every transaction, security event, and account update.', color: '#ec4899' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.color}25`, borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: f.color }}>{f.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center', background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(34,211,238,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 24, padding: 48 }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Like Sadapay.<br />But for IT-S Universe.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>Premium banking experience powered by ITS. No hidden fees. No minimum balance. Instant account opening.</p>
          <a href="/signup" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>Get Started Free</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Account Opening', value: 'Free' },
            { label: 'Min Balance', value: 'None' },
            { label: 'Virtual Card', value: 'Free' },
            { label: 'Bill Payment', value: 'Free' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
