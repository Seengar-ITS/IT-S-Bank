import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { current_pin, new_pin } = await req.json()
  if (!current_pin || !new_pin) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (new_pin.length !== 6) return NextResponse.json({ error: 'PIN must be 6 digits' }, { status: 400 })
  const { data: account } = await supabaseAdmin.from('bank_accounts').select('pin_hash').eq('id', payload.account_id).single()
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  const valid = await bcrypt.compare(current_pin, account.pin_hash)
  if (!valid) return NextResponse.json({ error: 'Invalid current PIN' }, { status: 401 })
  const pin_hash = await bcrypt.hash(new_pin, 12)
  await supabaseAdmin.from('bank_accounts').update({ pin_hash, updated_at: new Date().toISOString() }).eq('id', payload.account_id)
  return NextResponse.json({ message: 'PIN updated successfully' })
}
