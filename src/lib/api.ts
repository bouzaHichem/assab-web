const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://assab-backend.onrender.com'

// Store backend token in localStorage (in real app, use more secure storage)
let backendToken: string | null = null

// Login to backend and get token
export async function loginToBackend(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Backend login failed')
    }

    const data = await response.json()
    backendToken = data.token
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('backendToken', data.token)
    }
    
    return data
  } catch (error) {
    console.error('Backend login error:', error)
    throw error
  }
}

// Get token from memory or localStorage
export function getBackendToken(): string | null {
  if (backendToken) return backendToken
  
  if (typeof window !== 'undefined') {
    backendToken = localStorage.getItem('backendToken')
  }
  
  return backendToken
}

// Make authenticated API calls to backend
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getBackendToken()
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    // Token expired, try to re-login with default admin credentials
    try {
      await loginToBackend('admin@assab.com', 'admin123')
      // Retry the original request
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getBackendToken()}`,
          ...options.headers,
        },
      })
    } catch (error) {
      console.error('Re-authentication failed:', error)
      throw new Error('Authentication failed')
    }
  }

  return response
}

// Initialize backend token on app start
export async function initializeBackendAuth() {
  try {
    if (!getBackendToken()) {
      await loginToBackend('admin@assab.com', 'admin123')
    }
  } catch (error) {
    console.error('Failed to initialize backend auth:', error)
  }
}