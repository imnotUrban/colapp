"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock8,
  ArrowRight,
  MessageSquare,
} from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { bookingApi, type Booking } from "@/app/api/bookingApi"
import { Progress } from "@/components/ui/progress"
import ReviewForm from "@/components/review-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Componente para mostrar el estado del servicio
const ServiceStatus = ({ booking }: { booking: Booking }) => {
  const getStatusInfo = () => {
    switch (booking.status) {
      case "pendiente":
        return {
          icon: <Clock8 className="h-8 w-8 text-amber-500" />,
          title: "Pendiente de confirmación",
          description: "El proveedor aún no ha confirmado tu reserva.",
          progress: 25,
          color: "bg-amber-500",
        }
      case "confirmado":
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-blue-500" />,
          title: "Reserva confirmada",
          description: "Tu reserva ha sido confirmada. ¡Prepárate para tu cita!",
          progress: 50,
          color: "bg-blue-500",
        }
      case "completado":
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          title: "Servicio completado",
          description: "El servicio ha sido completado exitosamente.",
          progress: 100,
          color: "bg-green-500",
        }
      case "cancelado":
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: "Reserva cancelada",
          description: "Esta reserva ha sido cancelada.",
          progress: 100,
          color: "bg-red-500",
        }
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-muted-foreground" />,
          title: "Estado desconocido",
          description: "No se puede determinar el estado actual.",
          progress: 0,
          color: "bg-muted",
        }
    }
  }

  const statusInfo = getStatusInfo()
  const bookingDate = new Date(booking.date)
  const today = new Date()
  const isPast = bookingDate < today

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {statusInfo.icon}
        <div>
          <h3 className="font-medium">{statusInfo.title}</h3>
          <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
        </div>
      </div>

      <Progress value={statusInfo.progress} className={statusInfo.color} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Fecha</p>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{bookingDate.toLocaleDateString()}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Hora</p>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Paquete</p>
          <span className="capitalize">{booking.packageType}</span>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Precio</p>
          <span className="font-bold">${booking.price}</span>
        </div>
      </div>

      {booking.status === "confirmado" && !isPast && (
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
          <p className="text-sm">
            Tu cita está programada para el {bookingDate.toLocaleDateString()} a las {booking.startTime}. Recuerda estar
            preparado 5 minutos antes.
          </p>
        </div>
      )}

      {booking.status === "confirmado" && isPast && (
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
          <p className="text-sm">
            Esta cita ya debería haberse realizado. Si el servicio se completó, pídele al proveedor que lo marque como
            completado.
          </p>
        </div>
      )}
    </div>
  )
}

export default function EstadoServiciosPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
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
        const response = await bookingApi.getMyBookingsAsClient()
        setBookings(response.bookings)
        setFilteredBookings(response.bookings)
      } catch (err) {
        setError("Error al cargar tus reservas. Por favor, intenta de nuevo más tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, router])

  useEffect(() => {
    if (activeTab === "todos") {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((booking) => booking.status === activeTab))
    }
  }, [activeTab, bookings])

  const handleOpenReviewDialog = (bookingId: string) => {
    setSelectedBooking(bookingId)
    setReviewDialogOpen(true)
  }

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false)
    // Opcionalmente, recargar las reservas para actualizar el estado
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Cargando tus servicios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/servicios")}>
          Explorar servicios
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Estado de mis servicios</h1>
        <p className="text-muted-foreground">Consulta el estado de los servicios que has contratado</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="confirmado">Confirmados</TabsTrigger>
          <TabsTrigger value="completado">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                No tienes servicios {activeTab !== "todos" ? activeTab + "s" : ""} en este momento.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/servicios">Explorar servicios</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <Card key={booking._id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <CardTitle className="text-xl">{booking.service.title}</CardTitle>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={booking.service.images?.[0] || "/placeholder.svg"}
                          alt={booking.service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Proveedor: {booking.provider.name}</p>

                        <Separator className="my-4" />

                        <ServiceStatus booking={booking} />

                        <div className="flex flex-wrap justify-end gap-2 mt-4">
                          {booking.status === "pendiente" && (
                            <Button variant="destructive" size="sm">
                              Cancelar reserva
                            </Button>
                          )}

                          {booking.status === "confirmado" && (
                            <>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/chat/${booking.provider._id}`}>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Contactar proveedor
                                </Link>
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancelar reserva
                              </Button>
                            </>
                          )}

                          {booking.status === "completado" && (
                            <Button variant="outline" size="sm" onClick={() => handleOpenReviewDialog(booking._id)}>
                              Dejar reseña
                            </Button>
                          )}

                          <Button variant="default" size="sm" asChild>
                            <Link href={`/servicios/${booking.service._id}`}>
                              Ver servicio
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
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

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dejar una reseña</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia con este servicio para ayudar a otros usuarios.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <ReviewForm
              bookingId={selectedBooking}
              serviceId={bookings.find((b) => b._id === selectedBooking)?.service._id || ""}
              onSuccess={handleReviewSuccess}
              onCancel={() => setReviewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
