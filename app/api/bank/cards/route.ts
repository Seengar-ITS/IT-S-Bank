import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('bank_cards').select('id, card_number, card_type, expiry_month, expiry_year, card_name, status, daily_limit_its, created_at').eq('account_id', payload.account_id)
  return NextResponse.json({ data: data || [] })
}
