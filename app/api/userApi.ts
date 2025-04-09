import { apiService } from "./apiService"

// Tipos para los usuarios
export interface User {
  _id: string
  name: string
  username: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatar: string
  banner?: string
  skills?: string[]
  isProvider: boolean
  availability?: {
    days: {
      monday: boolean
      tuesday: boolean
      wednesday: boolean
      thursday: boolean
      friday: boolean
      saturday: boolean
      sunday: boolean
    }
    startTime: string
    endTime: string
  }
  rating: {
    average: number
    count: number
  }
  wallet: {
    balance: number
    pendingBalance: number
  }
  createdAt: string
  updatedAt: string
}

export interface UserResponse {
  success: boolean
  user: User
}

export interface UserProfileResponse {
  success: boolean
  user: User
  services?: any[]
}

export interface WalletResponse {
  success: boolean
  wallet: {
    balance: number
    pendingBalance: number
  }
}

/**
 * Servicio para la gestión de usuarios
 */
export const userApi = {
  /**
   * Obtiene el perfil de un usuario
   * @param username - Nombre de usuario
   */
  async getUserProfile(username: string) {
    return apiService.get(`/users/profile/${username}`)
  },

  /**
   * Actualiza el perfil del usuario
   * @param profileData - Datos del perfil
   */
  async updateUserProfile(profileData: {
    name?: string
    phone?: string
    location?: string
    bio?: string
    skills?: string[]
    availability?: User["availability"]
  }) {
    return apiService.put("/users/profile", profileData, true)
  },

  /**
   * Actualiza las imágenes del usuario
   * @param imageData - Datos de las imágenes
   */
  async updateUserImages(imageData: {
    avatar?: string
    banner?: string
  }) {
    return apiService.patch("/users/profile/images", imageData, true)
  },

  /**
   * Obtiene el balance de la billetera
   */
  async getWalletBalance() {
    return apiService.get("/users/wallet", true)
  },

  /**
   * Transfiere fondos pendientes a disponibles
   */
  async transferPendingFunds() {
    return apiService.post("/users/wallet/transfer", {}, true)
  },

  /**
   * Retira fondos
   * @param amount - Cantidad a retirar
   */
  async withdrawFunds(amount: number) {
    return apiService.post("/users/wallet/withdraw", { amount }, true)
  },
}
