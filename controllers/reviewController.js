const Review = require("../models/Review")
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const User = require("../models/User")

// Crear una nueva reseña
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      })
    }

    // Verificar que la reserva existe
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      })
    }

    // Verificar que el usuario es el cliente de la reserva
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para dejar una reseña en esta reserva",
      })
    }

    // Verificar que la reserva está completada
    if (booking.status !== "completado") {
      return res.status(400).json({
        success: false,
        message: "Solo puedes dejar reseñas en reservas completadas",
      })
    }

    // Verificar que no existe una reseña previa para esta reserva
    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Ya has dejado una reseña para esta reserva",
      })
    }

    // Crear la reseña
    const review = new Review({
      service: booking.service,
      booking: bookingId,
      reviewer: req.user.id,
      provider: booking.provider,
      rating,
      comment,
    })

    // Guardar la reseña
    await review.save()

    // Actualizar el rating del servicio
    const service = await Service.findById(booking.service)
    const serviceReviews = await Review.find({ service: booking.service })

    const totalRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / serviceReviews.length

    service.rating.average = averageRating
    service.rating.count = serviceReviews.length
    await service.save()

    // Actualizar el rating del proveedor
    const provider = await User.findById(booking.provider)
    const providerReviews = await Review.find({ provider: booking.provider })

    const totalProviderRating = providerReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageProviderRating = totalProviderRating / providerReviews.length

    provider.rating.average = averageProviderRating
    provider.rating.count = providerReviews.length
    await provider.save()

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la reseña",
      error: error.message,
    })
  }
}

// Obtener reseñas de un servicio
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate("reviewer", "name username avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reseñas",
      error: error.message,
    })
  }
}

// Obtener reseñas de un proveedor
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("reviewer", "name username avatar")
      .populate("service", "title")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reseñas",
      error: error.message,
    })
  }
}

// Obtener reseñas dejadas por un usuario
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("service", "title images")
      .populate("provider", "name username avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tus reseñas",
      error: error.message,
    })
  }
}

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
  try {
    // Buscar la reseña
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      })
    }

    // Verificar que el usuario es el autor de la reseña
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta reseña",
      })
    }

    // Eliminar la reseña
    await Review.findByIdAndDelete(req.params.id)

    // Actualizar el rating del servicio
    const serviceReviews = await Review.find({ service: review.service })

    if (serviceReviews.length > 0) {
      const totalRating = serviceReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / serviceReviews.length

      await Service.findByIdAndUpdate(review.service, {
        "rating.average": averageRating,
        "rating.count": serviceReviews.length,
      })
    } else {
      await Service.findByIdAndUpdate(review.service, {
        "rating.average": 0,
        "rating.count": 0,
      })
    }

    // Actualizar el rating del proveedor
    const providerReviews = await Review.find({ provider: review.provider })

    if (providerReviews.length > 0) {
      const totalProviderRating = providerReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageProviderRating = totalProviderRating / providerReviews.length

      await User.findByIdAndUpdate(review.provider, {
        "rating.average": averageProviderRating,
        "rating.count": providerReviews.length,
      })
    } else {
      await User.findByIdAndUpdate(review.provider, {
        "rating.average": 0,
        "rating.count": 0,
      })
    }

    res.status(200).json({
      success: true,
      message: "Reseña eliminada exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reseña",
      error: error.message,
    })
  }
}
