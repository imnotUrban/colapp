"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, Clock, AlertCircle, Star, Loader2 } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { bookingApi, type Booking } from "@/app/api/bookingApi"
import { reviewApi } from "@/app/api/reviewApi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function MisReservasPage() {
  const [activeTab, setActiveTab] = useState("proximas")
  const [clientBookings, setClientBookings] = useState<Booking[]>([])
  const [providerBookings, setProviderBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reviewData, setReviewData] = useState({ bookingId: "", rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchBookings = async () => {
      setLoading(true)
      try {
        // Obtener reservas como cliente
        const clientResponse = await bookingApi.getMyBookingsAsClient()
        setClientBookings(clientResponse.bookings)

        // Si el usuario es proveedor, obtener sus reservas como proveedor
        if (user?.isProvider) {
          const providerResponse = await bookingApi.getMyBookingsAsProvider()
          setProviderBookings(providerResponse.bookings)
        }
      } catch (err) {
        setError("Error al cargar las reservas. Por favor, intenta de nuevo más tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, router, user])

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      try {
        await bookingApi.cancelBooking(bookingId)
        // Actualizar la lista de reservas
        setClientBookings(
          clientBookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelado" } : booking)),
        )
      } catch (err) {
        alert("Error al cancelar la reserva. Por favor, intenta de nuevo.")
        console.error(err)
      }
    }
  }

  const handleUpdateBookingStatus = async (bookingId: string, status: "confirmado" | "completado" | "cancelado") => {
    try {
      await bookingApi.updateBookingStatus(bookingId, status)
      // Actualizar la lista de reservas
      setProviderBookings(
        providerBookings.map((booking) => (booking._id === bookingId ? { ...booking, status } : booking)),
      )
    } catch (err) {
      alert(`Error al cambiar el estado de la reserva a ${status}. Por favor, intenta de nuevo.`)
      console.error(err)
    }
  }

  const handleSubmitReview = async () => {
    setSubmittingReview(true)
    try {
      await reviewApi.createReview({
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })
      setReviewDialogOpen(false)
      // Actualizar la UI o mostrar mensaje de éxito
      alert("¡Gracias por tu reseña!")
    } catch (err) {
      alert("Error al enviar la reseña. Por favor, intenta de nuevo.")
      console.error(err)
    } finally {
      setSubmittingReview(false)
    }
  }

  const openReviewDialog = (bookingId: string) => {
    setReviewData({ bookingId, rating: 5, comment: "" })
    setReviewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Cargando tus reservas...</p>
        </div>
      </div>
    )
  }

  // Filtrar reservas según la pestaña activa
  const filterBookingsByStatus = (bookings: Booking[], tab: string) => {
    switch (tab) {
      case "proximas":
        return bookings.filter((b) => ["pendiente", "confirmado"].includes(b.status))
      case "completadas":
        return bookings.filter((b) => b.status === "completado")
      case "canceladas":
        return bookings.filter((b) => b.status === "cancelado")
      default:
        return bookings
    }
  }

  const filteredClientBookings = filterBookingsByStatus(clientBookings, activeTab)
  const filteredProviderBookings = filterBookingsByStatus(providerBookings, activeTab)

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mis reservas</h1>
        <p className="text-muted-foreground">Gestiona tus reservas de servicios</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="cliente" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cliente">Como cliente</TabsTrigger>
          {user?.isProvider && <TabsTrigger value="proveedor">Como proveedor</TabsTrigger>}
        </TabsList>

        <TabsContent value="cliente">
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="proximas">Próximas</TabsTrigger>
                <TabsTrigger value="completadas">Completadas</TabsTrigger>
                <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredClientBookings.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No tienes reservas {activeTab} en este momento.</p>
                    <Button className="mt-4" asChild>
                      <a href="/servicios">Explorar servicios</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredClientBookings.map((booking) => (
                      <Card key={booking._id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={booking.service.images?.[0] || "/placeholder.svg"}
                                alt={booking.service.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline">{booking.service.category}</Badge>
                                  <Badge
                                    variant={
                                      booking.status === "confirmado"
                                        ? "secondary"
                                        : booking.status === "completado"
                                          ? "outline"
                                          : "destructive"
                                    }
                                    className="capitalize"
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-medium mb-1">{booking.service.title}</h3>
                                <p className="text-sm text-muted-foreground">Proveedor: {booking.provider.name}</p>
                              </div>
                              <Separator className="my-3" />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Fecha</p>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Horario</p>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>
                                      {booking.startTime} - {booking.endTime}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Precio</p>
                                  <p className="font-bold">${booking.price}</p>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                {booking.status === "pendiente" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking._id)}
                                  >
                                    Cancelar reserva
                                  </Button>
                                )}
                                {booking.status === "confirmado" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking._id)}
                                  >
                                    Cancelar reserva
                                  </Button>
                                )}
                                {booking.status === "completado" && (
                                  <Button variant="outline" size="sm" onClick={() => openReviewDialog(booking._id)}>
                                    Dejar reseña
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        {user?.isProvider && (
          <TabsContent value="proveedor">
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="proximas">Próximas</TabsTrigger>
                  <TabsTrigger value="completadas">Completadas</TabsTrigger>
                  <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredProviderBookings.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">
                        No tienes reservas {activeTab} como proveedor en este momento.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {filteredProviderBookings.map((booking) => (
                        <Card key={booking._id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={booking.service.images?.[0] || "/placeholder.svg"}
                                  alt={booking.service.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col justify-between flex-1">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">{booking.service.category}</Badge>
                                    <Badge
                                      variant={
                                        booking.status === "confirmado"
                                          ? "secondary"
                                          : booking.status === "completado"
                                            ? "outline"
                                            : booking.status === "cancelado"
                                              ? "destructive"
                                              : "default"
                                      }
                                      className="capitalize"
                                    >
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <h3 className="text-lg font-medium mb-1">{booking.service.title}</h3>
                                  <p className="text-sm text-muted-foreground">Cliente: {booking.client.name}</p>
                                </div>
                                <Separator className="my-3" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Fecha</p>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-primary" />
                                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Horario</p>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span>
                                        {booking.startTime} - {booking.endTime}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Precio</p>
                                    <p className="font-bold">${booking.price}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                  {booking.status === "pendiente" && (
                                    <>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleUpdateBookingStatus(booking._id, "cancelado")}
                                      >
                                        Rechazar
                                      </Button>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleUpdateBookingStatus(booking._id, "confirmado")}
                                      >
                                        Confirmar
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === "confirmado" && (
                                    <>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleUpdateBookingStatus(booking._id, "cancelado")}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleUpdateBookingStatus(booking._id, "completado")}
                                      >
                                        Marcar como completado
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dejar una reseña</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia con este servicio para ayudar a otros usuarios.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Calificación</Label>
              <RadioGroup
                value={reviewData.rating.toString()}
                onValueChange={(value) => setReviewData({ ...reviewData, rating: Number.parseInt(value) })}
                className="flex space-x-2"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-1">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="flex items-center">
                      <Star
                        className={`h-5 w-5 ${reviewData.rating >= rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comentario</Label>
              <Textarea
                id="comment"
                placeholder="Cuéntanos tu experiencia con este servicio..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReview} disabled={submittingReview || !reviewData.comment.trim()}>
              {submittingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
