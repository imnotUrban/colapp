"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"
import { reviewApi, type Review } from "@/app/api/reviewApi"

interface ReviewsListProps {
  serviceId: string
  refreshTrigger?: number
}

export default function ReviewsList({ serviceId, refreshTrigger = 0 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const response = await reviewApi.getServiceReviews(serviceId)
        setReviews(response.reviews)
        setError("")
      } catch (err) {
        console.error("Error al cargar las reseñas:", err)
        setError("No se pudieron cargar las reseñas. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [serviceId, refreshTrigger])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-muted-foreground py-4">{error}</p>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">Este servicio aún no tiene reseñas.</p>
        <p className="text-sm mt-1">¡Sé el primero en compartir tu experiencia!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium">{review.reviewer.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
