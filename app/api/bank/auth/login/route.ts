import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(req: NextRequest) {
  try {
    const { email, password, pin } = await req.json()
    if (!email || !password || !pin) return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({ email, password })
    if (authError) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const user_id = authData.user.id
    const { data: account } = await supabaseAdmin.from('bank_accounts').select('*').eq('user_id', user_id).single()
    if (!account) return NextResponse.json({ error: 'Bank account not found' }, { status: 404 })
    if (account.status !== 'active') return NextResponse.json({ error: 'Account is suspended' }, { status: 403 })

    const pinValid = await bcrypt.compare(pin, account.pin_hash)
    if (!pinValid) return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })

    const secret = new TextEncoder().encode(process.env.JWT_SECRETS || 'its-bank-secret-2026')
    const token = await new SignJWT({ user_id, account_id: account.id, email }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret)

    return NextResponse.json({ data: { account_number: account.account_number, balance_its: account.balance_its }, token })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
