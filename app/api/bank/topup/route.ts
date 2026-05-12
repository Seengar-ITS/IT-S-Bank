import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const payload = await verifyToken(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { phone_number, network, amount_its } = await req.json()
    if (!phone_number || !network || !amount_its) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: account } = await supabaseAdmin.from('bank_accounts').select('balance_its').eq('id', payload.account_id).single()
    if (Number(account?.balance_its) < amount_its) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    const newBalance = Number(account?.balance_its) - amount_its
    await supabaseAdmin.from('bank_accounts').update({ balance_its: newBalance }).eq('id', payload.account_id)

    const { data: topup, error } = await supabaseAdmin.from('bank_topups').insert({
      account_id: payload.account_id, phone_number, network, amount_its, status: 'completed'
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('bank_transactions').insert({
      account_id: payload.account_id, type: 'topup', amount_its,
      balance_before: account?.balance_its, balance_after: newBalance,
      description: `${network} top-up for ${phone_number}`, reference_id: topup.id, status: 'completed'
    })

    return NextResponse.json({ data: topup })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('bank_topups').select('*').eq('account_id', payload.account_id).order('created_at', { ascending: false })
  return NextResponse.json({ data: data || [] })
}
