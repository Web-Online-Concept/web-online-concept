import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.ADMIN_PASSWORD + '_jwt_secret_key'

export function verifyAuth() {
  try {
    const token = cookies().get('admin-token')
    
    if (!token) {
      return { authenticated: false, error: 'Pas de token' }
    }

    // Vérifier le token
    const decoded = jwt.verify(token.value, JWT_SECRET)
    
    return { 
      authenticated: true, 
      data: decoded 
    }
  } catch (error) {
    // Token invalide ou expiré
    return { 
      authenticated: false, 
      error: error.message 
    }
  }
}

export function requireAuth() {
  const auth = verifyAuth()
  
  if (!auth.authenticated) {
    throw new Error('Non authentifié')
  }
  
  return auth
}