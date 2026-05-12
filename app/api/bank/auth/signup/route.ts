import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'

function generateAccountNumber() {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
  return `ITS-${digits}`
}

function generateCardNumber() {
  return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')).join(' ')
}

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, password, pin } = await req.json()
    if (!full_name || !email || !password || !pin) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (pin.length !== 6 || !/^\d+$/.test(pin)) return NextResponse.json({ error: 'PIN must be 6 digits' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 })

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({ email, password, user_metadata: { full_name } })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    const user_id = authUser.user.id
    const pin_hash = await bcrypt.hash(pin, 12)
    const account_number = generateAccountNumber()

    const { data: account, error: accError } = await supabaseAdmin.from('bank_accounts').insert({
      user_id, account_number, account_type: 'current', balance_its: 0, status: 'active', pin_hash
    }).select().single()

    if (accError) return NextResponse.json({ error: accError.message }, { status: 500 })

    const now = new Date()
    const expiry_year = now.getFullYear() + 3
    const expiry_month = now.getMonth() + 1
    const cvv_raw = String(Math.floor(100 + Math.random() * 900))
    const cvv_hash = await bcrypt.hash(cvv_raw, 10)

    await supabaseAdmin.from('bank_cards').insert({
      account_id: account.id, card_number: generateCardNumber(), card_type: 'virtual',
      expiry_month, expiry_year, cvv_hash, card_name: full_name.toUpperCase(), status: 'active', daily_limit_its: 50000
    })

    await supabaseAdmin.from('bank_notifications').insert({
      user_id, title: 'Welcome to IT-S Bank! 🎉',
      message: `Your account ${account_number} is ready. Your bank. Your rules.`,
      type: 'welcome', is_read: false
    })

    const secret = new TextEncoder().encode(process.env.JWT_SECRETS || 'its-bank-secret-2026')
    const token = await new SignJWT({ user_id, account_id: account.id, email }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret)

    return NextResponse.json({ data: { account_number, account_id: account.id }, token })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
