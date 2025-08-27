import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// Créer une clé secrète à partir du mot de passe admin
const JWT_SECRET = process.env.ADMIN_PASSWORD + '_jwt_secret_key'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Vérifier l'email et le mot de passe
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Vérifier l'email
    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Vérifier le mot de passe
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    // Créer le token JWT (expire dans 24h)
    const token = jwt.sign(
      { 
        authenticated: true,
        email: email,
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Stocker le token dans un cookie sécurisé
    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Connexion réussie'
    })
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Déconnexion
export async function DELETE() {
  try {
    // Supprimer le cookie
    cookies().delete('admin-token')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}