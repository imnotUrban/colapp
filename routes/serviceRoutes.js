const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/serviceController")
const { protect } = require("../middleware/auth")

// Rutas públicas
router.get("/ping/ping/ping", (req, res) => {
    res.status(200).json({ message: "Pong!" })
    })
router.get("/", serviceController.getServices)
router.get("/:id", serviceController.getServiceById)
router.get("/provider/:providerId", serviceController.getServicesByProvider)


// Rutas protegidas
router.post("/", protect, serviceController.createService)
router.put("/:id", protect, serviceController.updateService)
router.delete("/:id", protect, serviceController.deleteService)
router.patch("/:id/status", protect, serviceController.changeServiceStatus)
router.get("/user/me", protect, serviceController.getMyServices)

module.exports = router
