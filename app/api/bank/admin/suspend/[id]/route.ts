import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { data: current } = await supabaseAdmin.from('bank_accounts').select('status').eq('id', params.id).single()
  const newStatus = current?.status === 'active' ? 'suspended' : 'active'
  const { data, error } = await supabaseAdmin.from('bank_accounts').update({ status: newStatus }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, message: `Account ${newStatus}` })
}
