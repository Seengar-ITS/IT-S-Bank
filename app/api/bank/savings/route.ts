import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('bank_savings').select('*').eq('account_id', payload.account_id).eq('status', 'active')
  return NextResponse.json({ data: data || [] })
}

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { goal_name, target_its, deadline } = await req.json()
  if (!goal_name || !target_its) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('bank_savings').insert({ account_id: payload.account_id, goal_name, target_its, current_its: 0, deadline, status: 'active' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
