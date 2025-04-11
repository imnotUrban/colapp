import { apiService } from "./apiService"

// Tipos para la autenticación
export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  isProvider: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

/**
 * Servicio para la autenticación
 */
export const authService = {
  /**
   * Registra un nuevo usuario
   * @param userData - Datos del usuario
   */
  async register(userData: { name: string; username: string; email: string; password: string }) {
    const response = await apiService.post("/auth/register", userData)
    if (response.success) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  },

  /**
   * Inicia sesión
   * @param credentials - Credenciales del usuario
   */
  async login(credentials: { email: string; password: string }) {
    const response = await apiService.post("/auth/login", credentials)
    if (response.success) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  },

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await apiService.get("/auth/me", true)
      return response.user
    } catch (error) {
      this.logout()
      return null
    }
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated() {
    return !!getToken()
  },
}

/**
 * Obtiene el token de autenticación
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

/**
 * Obtiene el usuario actual del localStorage
 */
export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}
