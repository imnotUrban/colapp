const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")
const { protect } = require("../middleware/auth")

// Rutas públicas
router.get("/service/:serviceId", reviewController.getServiceReviews)
router.get("/provider/:providerId", reviewController.getProviderReviews)

// Rutas protegidas
router.post("/", protect, reviewController.createReview)
router.get("/me", protect, reviewController.getUserReviews)
router.delete("/:id", protect, reviewController.deleteReview)

module.exports = router
