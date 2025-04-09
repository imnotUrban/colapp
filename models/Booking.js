const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageType: {
      type: String,
      enum: ["basico", "estandar", "premium"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pendiente", "confirmado", "completado", "cancelado"],
      default: "pendiente",
    },
    clientNotes: {
      type: String,
      trim: true,
    },
    providerNotes: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pendiente", "completado", "reembolsado"],
      default: "pendiente",
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
bookingSchema.index({ service: 1 })
bookingSchema.index({ client: 1 })
bookingSchema.index({ provider: 1 })
bookingSchema.index({ date: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ createdAt: -1 })

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
