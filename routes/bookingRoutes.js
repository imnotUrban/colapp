const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")
const { protect, admin } = require("../middleware/auth")

// Rutas protegidas
router.post("/", protect, bookingController.createBooking)
router.get("/me/client", protect, bookingController.getMyBookingsAsClient)
router.get("/me/provider", protect, bookingController.getMyBookingsAsProvider)
router.get("/:id", protect, bookingController.getBookingById)
router.patch("/:id/status", protect, bookingController.updateBookingStatus)
router.patch("/:id/cancel", protect, bookingController.cancelBooking)

// Rutas de administrador
router.get("/", protect, admin, bookingController.getAllBookings)

module.exports = router
