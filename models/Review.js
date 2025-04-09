const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Índices para búsquedas eficientes
reviewSchema.index({ service: 1 })
reviewSchema.index({ booking: 1 })
reviewSchema.index({ reviewer: 1 })
reviewSchema.index({ provider: 1 })
reviewSchema.index({ rating: -1 })
reviewSchema.index({ createdAt: -1 })

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
