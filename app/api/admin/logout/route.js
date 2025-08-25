import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Supprimer le cookie d'authentification
    cookies().delete('admin-token')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}