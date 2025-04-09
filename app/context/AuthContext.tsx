"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService, getStoredUser, type User } from "../api/authService"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }

    // Verificar si el token es válido
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        authService.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      router.push("/perfil")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, username: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authService.register({ name, username, email, password })
      setUser(response.user)
      router.push("/perfil")
    } catch (error) {
      console.error("Error al registrar:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
