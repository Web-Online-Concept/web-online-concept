import { NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/auth'

export async function GET() {
  try {
    const authResult = verifyAuth()
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { authenticated: false, error: authResult.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      message: 'Authentifié'
    })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Erreur de vérification' },
      { status: 401 }
    )
  }
}