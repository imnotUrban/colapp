const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    // Verificar si el email ya está en uso
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      })
    }

    // Verificar si el username ya está en uso
    user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario ya está en uso",
      })
    }

    // Crear el usuario
    user = new User({
      name,
      username,
      email,
      password,
    })

    // Guardar el usuario
    await user.save()

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isProvider: user.isProvider,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar el usuario",
      error: error.message,
    })
  }
}

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isProvider: user.isProvider,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    })
  }
}

// Obtener usuario actual
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: error.message,
    })
  }
}
