import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('bank_beneficiaries').select('*').eq('account_id', payload.account_id)
  return NextResponse.json({ data: data || [] })
}

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { beneficiary_name, beneficiary_account, nickname } = await req.json()
  if (!beneficiary_name || !beneficiary_account) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const { data: acct } = await supabaseAdmin.from('bank_accounts').select('id').eq('account_number', beneficiary_account).single()
  if (!acct) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  const { data, error } = await supabaseAdmin.from('bank_beneficiaries').insert({ account_id: payload.account_id, beneficiary_name, beneficiary_account, nickname, bank_name: 'IT-S Bank' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
