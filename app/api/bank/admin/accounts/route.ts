import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { data: accounts } = await supabaseAdmin.from('bank_accounts').select('id, account_number, account_type, balance_its, status, created_at').order('created_at', { ascending: false })
  const { count } = await supabaseAdmin.from('bank_transactions').select('id', { count: 'exact', head: true })
  const total_balance = accounts?.reduce((s, a) => s + Number(a.balance_its), 0) || 0
  return NextResponse.json({ data: accounts || [], stats: { total_accounts: accounts?.length || 0, total_balance, total_transactions: count || 0 } })
}
