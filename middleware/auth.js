const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token

  // Verificar si hay token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Obtener token del header
    token = req.headers.authorization.split(" ")[1]
  }

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No estás autorizado para acceder a esta ruta",
    })
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Obtener usuario del token
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No se encontró ningún usuario con este ID",
      })
    }

    // Agregar usuario a la request
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "No estás autorizado para acceder a esta ruta",
      error: error.message,
    })
  }
}

// Middleware para roles de administrador
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: "No tienes permiso para realizar esta acción",
    })
  }
}
