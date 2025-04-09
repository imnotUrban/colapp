import { getToken } from "./authService"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

/**
 * Servicio para realizar peticiones a la API
 */
export const apiService = {
  /**
   * Realiza una petición GET a la API
   * @param endpoint - Endpoint de la API
   * @param requireAuth - Indica si la petición requiere autenticación
   */
  async get(endpoint: string, requireAuth = false) {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (requireAuth) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    return handleResponse(response)
  },

  /**
   * Realiza una petición POST a la API
   * @param endpoint - Endpoint de la API
   * @param data - Datos a enviar
   * @param requireAuth - Indica si la petición requiere autenticación
   */
  async post(endpoint: string, data: any, requireAuth = false) {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    if (requireAuth) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    return handleResponse(response)
  },

  /**
   * Realiza una petición PUT a la API
   * @param endpoint - Endpoint de la API
   * @param data - Datos a enviar
   * @param requireAuth - Indica si la petición requiere autenticación
   */
  async put(endpoint: string, data: any, requireAuth = false) {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    if (requireAuth) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    return handleResponse(response)
  },

  /**
   * Realiza una petición PATCH a la API
   * @param endpoint - Endpoint de la API
   * @param data - Datos a enviar
   * @param requireAuth - Indica si la petición requiere autenticación
   */
  async patch(endpoint: string, data: any, requireAuth = false) {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    if (requireAuth) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    return handleResponse(response)
  },

  /**
   * Realiza una petición DELETE a la API
   * @param endpoint - Endpoint de la API
   * @param requireAuth - Indica si la petición requiere autenticación
   */
  async delete(endpoint: string, requireAuth = false) {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (requireAuth) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, options)
    return handleResponse(response)
  },
}

/**
 * Maneja la respuesta de la API
 * @param response - Respuesta de la API
 */
async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    const error = data.message || response.statusText
    return Promise.reject(error)
  }

  return data
}
