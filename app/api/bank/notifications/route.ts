import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('bank_notifications').select('*').eq('user_id', payload.user_id).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ data: data || [] })
}

export async function PUT(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabaseAdmin.from('bank_notifications').update({ is_read: true }).eq('user_id', payload.user_id)
  return NextResponse.json({ message: 'All marked as read' })
}

export async function DELETE(req: NextRequest) {
  const payload = await verifyToken(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabaseAdmin.from('bank_notifications').delete().eq('user_id', payload.user_id)
  return NextResponse.json({ message: 'Cleared' })
}
