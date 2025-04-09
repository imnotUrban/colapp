const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { protect } = require("../middleware/auth")

// Rutas públicas
router.get("/profile/:username", userController.getUserProfile)

// Rutas protegidas
router.put("/profile", protect, userController.updateUserProfile)
router.patch("/profile/images", protect, userController.updateUserImages)
router.get("/wallet", protect, userController.getWalletBalance)
router.post("/wallet/transfer", protect, userController.transferPendingFunds)
router.post("/wallet/withdraw", protect, userController.withdrawFunds)

module.exports = router
