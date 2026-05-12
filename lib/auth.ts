import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export async function verifyToken(req: NextRequest): Promise<{ user_id: string; account_id: string; email: string } | null> {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const token = auth.slice(7)
    const secret = new TextEncoder().encode(process.env.JWT_SECRETS || 'its-bank-secret-2026')
    const { payload } = await jwtVerify(token, secret)
    return payload as { user_id: string; account_id: string; email: string }
  } catch {
    return null
  }
}
