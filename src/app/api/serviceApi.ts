import { apiService } from "./apiService"

// Tipos para los servicios
export interface ServicePackage {
  type: "basico" | "estandar" | "premium"
  price: number
  deliveryTime: number
  description: string
  features: string[]
}

export interface ServiceAvailability {
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
  sessionDuration: number
  unavailableDates: Date[]
}

export interface Service {
  _id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  packages: ServicePackage[]
  availability: ServiceAvailability
  requirements?: string
  hasQuestionnaire: boolean
  status: "borrador" | "pendiente" | "activo" | "inactivo" | "rechazado"
  provider: {
    _id: string
    name: string
    username: string
    avatar: string
    rating: {
      average: number
      count: number
    }
  }
  rating: {
    average: number
    count: number
  }
  views: number
  createdAt: string
  updatedAt: string
}

export interface ServiceResponse {
  success: boolean
  service: Service
}

export interface ServicesResponse {
  success: boolean
  count: number
  total: number
  totalPages: number
  currentPage: number
  services: Service[]
}

/**
 * Servicio para la gestión de servicios
 */
export const serviceApi = {
  /**
   * Obtiene todos los servicios
   * @param params - Parámetros de filtrado
   */
  async getServices(
    params: {
      category?: string
      minPrice?: number
      maxPrice?: number
      minRating?: number
      search?: string
      status?: string
      provider?: string
      sort?: string
      order?: "asc" | "desc"
      page?: number
      limit?: number
    } = {},
  ) {
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiService.get(`/services${query}`)
  },

  /**
   * Obtiene un servicio por su ID
   * @param id - ID del servicio
   */
  async getServiceById(id: string) {
    return apiService.get(`/services/${id}`)
  },

  /**
   * Crea un nuevo servicio
   * @param serviceData - Datos del servicio
   */
  async createService(serviceData: Partial<Service>) {
    return apiService.post("/services", serviceData, true)
  },

  /**
   * Actualiza un servicio
   * @param id - ID del servicio
   * @param serviceData - Datos del servicio
   */
  async updateService(id: string, serviceData: Partial<Service>) {
    return apiService.put(`/services/${id}`, serviceData, true)
  },

  /**
   * Elimina un servicio
   * @param id - ID del servicio
   */
  async deleteService(id: string) {
    return apiService.delete(`/services/${id}`, true)
  },

  /**
   * Cambia el estado de un servicio
   * @param id - ID del servicio
   * @param status - Nuevo estado
   */
  async changeServiceStatus(id: string, status: Service["status"]) {
    return apiService.patch(`/services/${id}/status`, { status }, true)
  },

  /**
   * Obtiene los servicios de un proveedor
   * @param providerId - ID del proveedor
   */
  async getServicesByProvider(providerId: string) {
    return apiService.get(`/services/provider/${providerId}`)
  },

  /**
   * Obtiene los servicios del usuario autenticado
   */
  async getMyServices() {
    return apiService.get("/services/user/me", true)
  },
}
