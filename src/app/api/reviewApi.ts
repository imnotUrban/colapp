import { apiService } from "./apiService"

// Tipos para las reseñas
export interface Review {
  _id: string
  service: {
    _id: string
    title: string
    images?: string[]
  }
  booking: string
  reviewer: {
    _id: string
    name: string
    username: string
    avatar: string
  }
  provider: {
    _id: string
    name: string
    username: string
    avatar: string
  }
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ReviewResponse {
  success: boolean
  review: Review
}

export interface ReviewsResponse {
  success: boolean
  count: number
  reviews: Review[]
}

/**
 * Servicio para la gestión de reseñas
 */
export const reviewApi = {
  /**
   * Crea una nueva reseña
   * @param reviewData - Datos de la reseña
   */
  async createReview(reviewData: {
    bookingId: string
    rating: number
    comment: string
  }) {
    return apiService.post("/reviews", reviewData, true)
  },

  /**
   * Obtiene las reseñas de un servicio
   * @param serviceId - ID del servicio
   */
  async getServiceReviews(serviceId: string) {
    return apiService.get(`/reviews/service/${serviceId}`)
  },

  /**
   * Obtiene las reseñas de un proveedor
   * @param providerId - ID del proveedor
   */
  async getProviderReviews(providerId: string) {
    return apiService.get(`/reviews/provider/${providerId}`)
  },

  /**
   * Obtiene las reseñas del usuario autenticado
   */
  async getUserReviews() {
    return apiService.get("/reviews/me", true)
  },

  /**
   * Elimina una reseña
   * @param id - ID de la reseña
   */
  async deleteReview(id: string) {
    return apiService.delete(`/reviews/${id}`, true)
  },
}
