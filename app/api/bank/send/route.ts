import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const payload = await verifyToken(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { receiver_account, amount_its, description, pin } = await req.json()
    if (!receiver_account || !amount_its || !pin) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (amount_its <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const { data: sender } = await supabaseAdmin.from('bank_accounts').select('*').eq('id', payload.account_id).single()
    if (!sender) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

    const pinValid = await bcrypt.compare(pin, sender.pin_hash)
    if (!pinValid) return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })

    if (Number(sender.balance_its) < amount_its) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    const { data: receiver } = await supabaseAdmin.from('bank_accounts').select('*').eq('account_number', receiver_account).single()
    if (!receiver) return NextResponse.json({ error: 'Receiver account not found' }, { status: 404 })

    const ref = uuidv4()
    const newSenderBalance = Number(sender.balance_its) - amount_its
    const newReceiverBalance = Number(receiver.balance_its) + amount_its

    await supabaseAdmin.from('bank_accounts').update({ balance_its: newSenderBalance, updated_at: new Date().toISOString() }).eq('id', sender.id)
    await supabaseAdmin.from('bank_accounts').update({ balance_its: newReceiverBalance, updated_at: new Date().toISOString() }).eq('id', receiver.id)

    const { data: txn } = await supabaseAdmin.from('bank_transactions').insert({
      account_id: sender.id, type: 'debit', amount_its, balance_before: sender.balance_its,
      balance_after: newSenderBalance, description: description || `Transfer to ${receiver_account}`,
      reference_id: ref, receiver_account, status: 'completed'
    }).select().single()

    await supabaseAdmin.from('bank_transactions').insert({
      account_id: receiver.id, type: 'credit', amount_its, balance_before: receiver.balance_its,
      balance_after: newReceiverBalance, description: description || `Transfer from ${sender.account_number}`,
      reference_id: `${ref}-in`, sender_account: sender.account_number, status: 'completed'
    })

    await supabaseAdmin.from('bank_notifications').insert([
      { user_id: sender.user_id, title: `You sent ${amount_its} ITS`, message: `Transfer to ${receiver_account} — Ref: ${ref.slice(0, 8)}`, type: 'transfer' },
      { user_id: receiver.user_id, title: `You received ${amount_its} ITS`, message: `Transfer from ${sender.account_number} — Ref: ${ref.slice(0, 8)}`, type: 'transfer' }
    ])

    return NextResponse.json({ data: txn })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
