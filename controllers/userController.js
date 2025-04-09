const User = require("../models/User")
const Service = require("../models/Service")
const Booking = require("../models/Booking")
const Review = require("../models/Review")

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Obtener servicios del usuario si es proveedor
    let services = []
    if (user.isProvider) {
      services = await Service.find({
        provider: user._id,
        status: "activo",
      }).select("title category images rating price")
    }

    res.status(200).json({
      success: true,
      user,
      services,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el perfil del usuario",
      error: error.message,
    })
  }
}

// Actualizar perfil de usuario
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, location, bio, skills, availability } = req.body

    // Buscar el usuario
    let user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Actualizar el usuario
    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        location,
        bio,
        skills,
        availability,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    ).select("-password")

    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el perfil",
      error: error.message,
    })
  }
}

// Actualizar avatar o banner
exports.updateUserImages = async (req, res) => {
  try {
    const { avatar, banner } = req.body

    // Buscar el usuario
    let user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Actualizar imágenes
    const updateData = {}
    if (avatar) updateData.avatar = avatar
    if (banner) updateData.banner = banner

    user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password")

    res.status(200).json({
      success: true,
      message: "Imágenes actualizadas exitosamente",
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar las imágenes",
      error: error.message,
    })
  }
}

// Obtener balance de la billetera
exports.getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("wallet")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    res.status(200).json({
      success: true,
      wallet: user.wallet,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el balance de la billetera",
      error: error.message,
    })
  }
}

// Transferir fondos de pendiente a disponible
exports.transferPendingFunds = async (req, res) => {
  try {
    // Buscar el usuario
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Verificar si hay fondos pendientes
    if (user.wallet.pendingBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "No hay fondos pendientes para transferir",
      })
    }

    // Transferir fondos
    const pendingAmount = user.wallet.pendingBalance
    user.wallet.balance += pendingAmount
    user.wallet.pendingBalance = 0

    await user.save()

    res.status(200).json({
      success: true,
      message: `$${pendingAmount} transferidos a tu balance disponible`,
      wallet: user.wallet,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al transferir los fondos",
      error: error.message,
    })
  }
}

// Retirar fondos
exports.withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a cero",
      })
    }

    // Buscar el usuario
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Verificar si hay fondos suficientes
    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Fondos insuficientes",
      })
    }

    // Retirar fondos
    user.wallet.balance -= amount
    await user.save()

    // Aquí iría la lógica para procesar el retiro a través de un proveedor de pagos

    res.status(200).json({
      success: true,
      message: `$${amount} retirados exitosamente`,
      wallet: user.wallet,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al retirar los fondos",
      error: error.message,
    })
  }
}
