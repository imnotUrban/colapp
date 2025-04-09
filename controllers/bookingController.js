const Booking = require("../models/Booking")
const Service = require("../models/Service")
const User = require("../models/User")
const mongoose = require("mongoose")

// Crear una nueva reserva
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, packageType, date, startTime, endTime, clientNotes } = req.body

    // Verificar que el servicio existe
    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      })
    }

    // Verificar que el servicio está activo
    if (service.status !== "activo") {
      return res.status(400).json({
        success: false,
        message: "Este servicio no está disponible actualmente",
      })
    }

    // Verificar que el paquete existe
    const selectedPackage = service.packages.find((pkg) => pkg.type === packageType)
    if (!selectedPackage) {
      return res.status(404).json({
        success: false,
        message: "Paquete no encontrado",
      })
    }

    // Verificar disponibilidad
    const bookingDate = new Date(date)
    const dayOfWeek = bookingDate.getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[dayOfWeek]

    // Verificar si el día está disponible
    if (!service.availability.days[dayName]) {
      return res.status(400).json({
        success: false,
        message: "El proveedor no está disponible en esta fecha",
      })
    }

    // Verificar si la fecha está en las fechas no disponibles
    const isUnavailable = service.availability.unavailableDates.some(
      (unavailableDate) => unavailableDate.toDateString() === bookingDate.toDateString(),
    )

    if (isUnavailable) {
      return res.status(400).json({
        success: false,
        message: "Esta fecha no está disponible",
      })
    }

    // Verificar si el horario está dentro del rango disponible
    if (startTime < service.availability.startTime || endTime > service.availability.endTime) {
      return res.status(400).json({
        success: false,
        message: "El horario seleccionado está fuera del rango disponible",
      })
    }

    // Verificar si ya existe una reserva en ese horario
    const existingBooking = await Booking.findOne({
      service: serviceId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
      },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $in: ["pendiente", "confirmado"] },
    })

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una reserva en este horario",
      })
    }

    // Crear la reserva
    const booking = new Booking({
      service: serviceId,
      client: req.user.id,
      provider: service.provider,
      packageType,
      date: bookingDate,
      startTime,
      endTime,
      price: selectedPackage.price,
      clientNotes,
      status: "pendiente",
      paymentStatus: "pendiente",
    })

    // Guardar la reserva
    await booking.save()

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      booking,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la reserva",
      error: error.message,
    })
  }
}

// Obtener todas las reservas (para administradores)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("service", "title images")
      .populate("client", "name username avatar")
      .populate("provider", "name username avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservas",
      error: error.message,
    })
  }
}

// Obtener una reserva por ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service", "title description images packages")
      .populate("client", "name username avatar email phone")
      .populate("provider", "name username avatar email phone")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      })
    }

    // Verificar que el usuario es el cliente, el proveedor o un administrador
    if (
      booking.client._id.toString() !== req.user.id &&
      booking.provider._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver esta reserva",
      })
    }

    res.status(200).json({
      success: true,
      booking,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la reserva",
      error: error.message,
    })
  }
}

// Obtener reservas como cliente
exports.getMyBookingsAsClient = async (req, res) => {
  try {
    const { status, sort = "date", order = "asc" } = req.query

    // Construir el filtro
    const filter = { client: req.user.id }

    if (status) {
      filter.status = status
    }

    // Determinar el orden
    const sortOption = {}
    sortOption[sort] = order === "asc" ? 1 : -1

    // Ejecutar la consulta
    const bookings = await Booking.find(filter)
      .populate("service", "title images category")
      .populate("provider", "name username avatar")
      .sort(sortOption)

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tus reservas",
      error: error.message,
    })
  }
}

// Obtener reservas como proveedor
exports.getMyBookingsAsProvider = async (req, res) => {
  try {
    const { status, sort = "date", order = "asc" } = req.query

    // Construir el filtro
    const filter = { provider: req.user.id }

    if (status) {
      filter.status = status
    }

    // Determinar el orden
    const sortOption = {}
    sortOption[sort] = order === "asc" ? 1 : -1

    // Ejecutar la consulta
    const bookings = await Booking.find(filter)
      .populate("service", "title images category")
      .populate("client", "name username avatar")
      .sort(sortOption)

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservas de tus servicios",
      error: error.message,
    })
  }
}

// Actualizar el estado de una reserva
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["pendiente", "confirmado", "completado", "cancelado"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Estado no válido",
      })
    }

    // Buscar la reserva
    let booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      })
    }

    // Verificar permisos según el estado solicitado
    if (status === "confirmado" || status === "cancelado") {
      // Solo el proveedor puede confirmar o cancelar
      if (booking.provider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para actualizar esta reserva",
        })
      }
    } else if (status === "completado") {
      // Solo el proveedor puede marcar como completado
      if (booking.provider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para marcar esta reserva como completada",
        })
      }

      // Verificar que la reserva estaba confirmada
      if (booking.status !== "confirmado") {
        return res.status(400).json({
          success: false,
          message: "Solo se pueden completar reservas confirmadas",
        })
      }
    }

    // Actualizar el estado de la reserva
    booking = await Booking.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true })

    // Si se completa la reserva, actualizar el balance del proveedor
    if (status === "completado" && booking.paymentStatus === "pendiente") {
      const provider = await User.findById(booking.provider)
      provider.wallet.pendingBalance += booking.price
      await provider.save()

      // Actualizar el estado de pago
      booking.paymentStatus = "completado"
      await booking.save()
    }

    res.status(200).json({
      success: true,
      message: `Estado de la reserva actualizado a ${status}`,
      booking,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el estado de la reserva",
      error: error.message,
    })
  }
}

// Cancelar una reserva (como cliente)
exports.cancelBooking = async (req, res) => {
  try {
    // Buscar la reserva
    let booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      })
    }

    // Verificar que el usuario es el cliente
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para cancelar esta reserva",
      })
    }

    // Verificar que la reserva no está ya completada o cancelada
    if (["completado", "cancelado"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `No se puede cancelar una reserva que ya está ${booking.status}`,
      })
    }

    // Actualizar el estado de la reserva
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelado", updatedAt: Date.now() },
      { new: true },
    )

    res.status(200).json({
      success: true,
      message: "Reserva cancelada exitosamente",
      booking,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cancelar la reserva",
      error: error.message,
    })
  }
}
