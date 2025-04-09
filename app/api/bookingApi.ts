import { apiService } from "./apiService"

// Tipos para las reservas
export interface Booking {
  _id: string
  service: {
    _id: string
    title: string
    images: string[]
    category: string
  }
  client: {
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
  packageType: "basico" | "estandar" | "premium"
  date: string
  startTime: string
  endTime: string
  price: number
  status: "pendiente" | "confirmado" | "completado" | "cancelado"
  clientNotes?: string
  providerNotes?: string
  paymentStatus: "pendiente" | "completado" | "reembolsado"
  createdAt: string
  updatedAt: string
}

export interface BookingResponse {
  success: boolean
  booking: Booking
}

export interface BookingsResponse {
  success: boolean
  count: number
  bookings: Booking[]
}

/**
 * Servicio para la gestión de reservas
 */
export const bookingApi = {
  /**
   * Crea una nueva reserva
   * @param bookingData - Datos de la reserva
   */
  async createBooking(bookingData: {
    serviceId: string
    packageType: "basico" | "estandar" | "premium"
    date: string
    startTime: string
    endTime: string
    clientNotes?: string
  }) {
    return apiService.post("/bookings", bookingData, true)
  },

  /**
   * Obtiene las reservas del usuario como cliente
   */
  async getMyBookingsAsClient() {
    return apiService.get("/bookings/me/client", true)
  },

  /**
   * Obtiene las reservas del usuario como proveedor
   */
  async getMyBookingsAsProvider() {
    return apiService.get("/bookings/me/provider", true)
  },

  /**
   * Obtiene una reserva por su ID
   * @param id - ID de la reserva
   */
  async getBookingById(id: string) {
    return apiService.get(`/bookings/${id}`, true)
  },

  /**
   * Actualiza el estado de una reserva
   * @param id - ID de la reserva
   * @param status - Nuevo estado
   */
  async updateBookingStatus(id: string, status: Booking["status"]) {
    return apiService.patch(`/bookings/${id}/status`, { status }, true)
  },

  /**
   * Cancela una reserva
   * @param id - ID de la reserva
   */
  async cancelBooking(id: string) {
    return apiService.patch(`/bookings/${id}/cancel`, {}, true)
  },
}
