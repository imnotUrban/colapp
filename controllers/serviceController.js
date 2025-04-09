const Service = require("../models/Service")
const User = require("../models/User")
const mongoose = require("mongoose")

// Obtener todos los servicios (con filtros)
exports.getServices = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      search,
      status,
      provider,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query

    // Construir el filtro
    const filter = {}

    if (category) filter.category = category
    if (status) filter.status = status
    if (provider) filter.provider = provider

    // Filtro de precio
    if (minPrice || maxPrice) {
      filter["packages.price"] = {}
      if (minPrice) filter["packages.price"].$gte = Number(minPrice)
      if (maxPrice) filter["packages.price"].$lte = Number(maxPrice)
    }

    // Filtro de rating
    if (minRating) {
      filter["rating.average"] = { $gte: Number(minRating) }
    }

    // Búsqueda por texto
    if (search) {
      filter.$text = { $search: search }
    }

    // Por defecto, solo mostrar servicios activos a menos que se especifique otro estado
    if (!status) {
      filter.status = "activo"
    }

    // Calcular skip para paginación
    const skip = (Number(page) - 1) * Number(limit)

    // Determinar el orden
    const sortOption = {}
    sortOption[sort] = order === "asc" ? 1 : -1

    // Ejecutar la consulta
    const services = await Service.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("provider", "name username avatar rating")

    // Contar total de documentos para la paginación
    const total = await Service.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      services,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los servicios",
      error: error.message,
    })
  }
}

// Obtener un servicio por ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "name username avatar rating bio location",
    )

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      })
    }

    // Incrementar contador de vistas
    service.views += 1
    await service.save()

    res.status(200).json({
      success: true,
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el servicio",
      error: error.message,
    })
  }
}

// Crear un nuevo servicio
exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      images,
      packages,
      availability,
      requirements,
      hasQuestionnaire,
      status,
    } = req.body

    // Verificar que el usuario existe
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Crear el servicio
    const service = new Service({
      title,
      description,
      category,
      tags: tags || [],
      images,
      packages,
      availability: availability || {},
      requirements,
      hasQuestionnaire: hasQuestionnaire || false,
      status: status || "borrador",
      provider: req.user.id,
    })

    // Guardar el servicio
    await service.save()

    // Actualizar al usuario como proveedor si aún no lo es
    if (!user.isProvider) {
      user.isProvider = true
      await user.save()
    }

    res.status(201).json({
      success: true,
      message: "Servicio creado exitosamente",
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el servicio",
      error: error.message,
    })
  }
}

// Actualizar un servicio
exports.updateService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      images,
      packages,
      availability,
      requirements,
      hasQuestionnaire,
      status,
    } = req.body

    // Buscar el servicio
    let service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      })
    }

    // Verificar que el usuario es el propietario del servicio
    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar este servicio",
      })
    }

    // Actualizar el servicio
    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        tags,
        images,
        packages,
        availability,
        requirements,
        hasQuestionnaire,
        status,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      message: "Servicio actualizado exitosamente",
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el servicio",
      error: error.message,
    })
  }
}

// Eliminar un servicio
exports.deleteService = async (req, res) => {
  try {
    // Buscar el servicio
    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      })
    }

    // Verificar que el usuario es el propietario del servicio
    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este servicio",
      })
    }

    // Eliminar el servicio
    await Service.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Servicio eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el servicio",
      error: error.message,
    })
  }
}

// Cambiar el estado de un servicio
exports.changeServiceStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["borrador", "pendiente", "activo", "inactivo"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Estado no válido",
      })
    }

    // Buscar el servicio
    let service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      })
    }

    // Verificar que el usuario es el propietario del servicio
    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para cambiar el estado de este servicio",
      })
    }

    // Actualizar el estado del servicio
    service = await Service.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true })

    res.status(200).json({
      success: true,
      message: `Estado del servicio cambiado a ${status}`,
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado del servicio",
      error: error.message,
    })
  }
}

// Obtener servicios por proveedor
exports.getServicesByProvider = async (req, res) => {
  try {
    const { status, sort = "createdAt", order = "desc" } = req.query

    // Construir el filtro
    const filter = { provider: req.params.providerId }

    if (status) {
      filter.status = status
    }

    // Determinar el orden
    const sortOption = {}
    sortOption[sort] = order === "asc" ? 1 : -1

    // Ejecutar la consulta
    const services = await Service.find(filter).sort(sortOption).populate("provider", "name username avatar")

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los servicios del proveedor",
      error: error.message,
    })
  }
}

// Obtener mis servicios (del usuario autenticado)
exports.getMyServices = async (req, res) => {
  try {
    const { status, sort = "createdAt", order = "desc" } = req.query

    // Construir el filtro
    const filter = { provider: req.user.id }

    if (status) {
      filter.status = status
    }

    // Determinar el orden
    const sortOption = {}
    sortOption[sort] = order === "asc" ? 1 : -1

    // Ejecutar la consulta
    const services = await Service.find(filter).sort(sortOption)

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tus servicios",
      error: error.message,
    })
  }
}
