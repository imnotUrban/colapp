const mongoose = require("mongoose")

const packageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["basico", "estandar", "premium"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
})

const availabilitySchema = new mongoose.Schema({
  days: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false },
  },
  startTime: {
    type: String,
    default: "09:00",
  },
  endTime: {
    type: String,
    default: "17:00",
  },
  sessionDuration: {
    type: Number,
    default: 60,
    enum: [30, 45, 60, 90, 120],
  },
  unavailableDates: [
    {
      type: Date,
    },
  ],
})

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "diseño",
        "tecnología",
        "bienestar",
        "educación",
        "hogar",
        "eventos",
        "marketing",
        "legal",
        "finanzas",
        "otros",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    packages: [packageSchema],
    availability: {
      type: availabilitySchema,
      default: () => ({}),
    },
    requirements: {
      type: String,
      trim: true,
    },
    hasQuestionnaire: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["borrador", "pendiente", "activo", "inactivo", "rechazado"],
      default: "borrador",
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
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
serviceSchema.index({ title: "text", description: "text", tags: "text" })
serviceSchema.index({ category: 1 })
serviceSchema.index({ provider: 1 })
serviceSchema.index({ status: 1 })
serviceSchema.index({ "rating.average": -1 })
serviceSchema.index({ createdAt: -1 })

const Service = mongoose.model("Service", serviceSchema)

module.exports = Service
