"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { reviewApi } from "@/app/api/reviewApi"
import { useToast } from "@/components/ui/use-toast"

interface ReviewFormProps {
  bookingId: string
  serviceId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ReviewForm({ bookingId, serviceId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe un comentario para tu reseña.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await reviewApi.createReview({
        bookingId,
        rating,
        comment,
      })

      toast({
        title: "¡Reseña enviada!",
        description: "Gracias por compartir tu experiencia.",
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error al enviar la reseña:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar tu reseña. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Calificación</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(value)}
              aria-label={`${value} estrellas`}
            >
              <Star
                className={`h-8 w-8 ${
                  value <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                } transition-colors hover:fill-primary/80 hover:text-primary/80`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Tu opinión</Label>
        <Textarea
          id="comment"
          placeholder="Comparte tu experiencia con este servicio..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar reseña"}
        </Button>
      </div>
    </form>
  )
}
