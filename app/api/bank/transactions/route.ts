import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const type = searchParams.get('type')
  let query = supabaseAdmin.from('bank_transactions').select('*').eq('account_id', payload.account_id).order('created_at', { ascending: false }).limit(limit)
  if (type) query = query.eq('type', type)
  const { data } = await query
  return NextResponse.json({ data: data || [] })
}
