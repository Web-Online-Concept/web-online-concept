import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Supprimer le cookie d'authentification avec les mêmes options que lors de sa création
    cookies().set('admin-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0, // Expire immédiatement
      path: '/'
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}