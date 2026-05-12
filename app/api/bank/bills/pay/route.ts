import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const payload = await verifyToken(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { bill_type, provider, consumer_number, amount_its } = await req.json()
    if (!bill_type || !provider || !consumer_number || !amount_its) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: account } = await supabaseAdmin.from('bank_accounts').select('balance_its').eq('id', payload.account_id).single()
    if (Number(account?.balance_its) < amount_its) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    const newBalance = Number(account?.balance_its) - amount_its
    await supabaseAdmin.from('bank_accounts').update({ balance_its: newBalance }).eq('id', payload.account_id)

    const { data: bill, error } = await supabaseAdmin.from('bank_bills').insert({
      account_id: payload.account_id, bill_type, provider, consumer_number, amount_its, status: 'completed', paid_at: new Date().toISOString()
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('bank_transactions').insert({
      account_id: payload.account_id, type: 'bill_payment', amount_its,
      balance_before: account?.balance_its, balance_after: newBalance,
      description: `${bill_type} - ${provider} (${consumer_number})`, reference_id: bill.id, status: 'completed'
    })

    return NextResponse.json({ data: bill })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
