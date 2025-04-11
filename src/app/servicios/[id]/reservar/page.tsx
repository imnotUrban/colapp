"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon, Clock, Loader2 } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { serviceApi, type Service } from "@/app/api/serviceApi"
import { bookingApi } from "@/app/api/bookingApi"

// Componente para mostrar las horas disponibles
const TimeSlots = ({
  selectedDate,
  availability,
  onSelectTime,
}: {
  selectedDate: Date | undefined
  availability: Service["availability"] | undefined
  onSelectTime: (start: string, end: string) => void
}) => {
  if (!selectedDate || !availability) return null

  const dayOfWeek = selectedDate.getDay()
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayName = dayNames[dayOfWeek]

  // Verificar si el día está disponible
  if (!availability.days[dayName as keyof typeof availability.days]) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Este día no está disponible. Por favor, selecciona otra fecha.
      </div>
    )
  }

  // Verificar si la fecha está en las fechas no disponibles
  const isUnavailableDate = availability.unavailableDates?.some(
    (unavailableDate) => new Date(unavailableDate).toDateString() === selectedDate.toDateString(),
  )

  if (isUnavailableDate) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Esta fecha no está disponible. Por favor, selecciona otra fecha.
      </div>
    )
  }

  // Generar slots de tiempo basados en la disponibilidad
  const startTime = availability.startTime || "09:00"
  const endTime = availability.endTime || "17:00"
  const sessionDuration = availability.sessionDuration || 60

  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  const slots = []
  for (let time = startMinutes; time + sessionDuration <= endMinutes; time += sessionDuration) {
    const hour = Math.floor(time / 60)
    const minute = time % 60
    const startTimeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    const endTimeMinutes = time + sessionDuration
    const endHour = Math.floor(endTimeMinutes / 60)
    const endMinute = endTimeMinutes % 60
    const endTimeStr = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

    slots.push({ start: startTimeStr, end: endTimeStr })
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Horarios disponibles:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((slot, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start"
            onClick={() => onSelectTime(slot.start, slot.end)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {slot.start} - {slot.end}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default function ReservarPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<{ start: string; end: string } | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<"basico" | "estandar" | "premium">("basico")
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/servicios/" + params.id + "/reservar")
      return
    }

    const fetchService = async () => {
      setLoading(true)
      try {
        const response = await serviceApi.getServiceById(params.id)
        setService(response.service)
      } catch (err) {
        setError("Error al cargar el servicio. Por favor, intenta de nuevo más tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [isAuthenticated, params.id, router])

  const handleSelectTime = (start: string, end: string) => {
    setSelectedTime({ start, end })
  }

  const handleSubmit = async () => {
    if (!service || !selectedDate || !selectedTime) return

    setSubmitting(true)
    try {
      await bookingApi.createBooking({
        serviceId: service._id,
        packageType: selectedPackage,
        date: selectedDate.toISOString(),
        startTime: selectedTime.start,
        endTime: selectedTime.end,
        clientNotes: notes,
      })

      // Redireccionar a la página de mis reservas
      router.push("/mis-reservas")
    } catch (err) {
      setError("Error al crear la reserva. Por favor, intenta de nuevo.")
      console.error(err)
      setSubmitting(false)
    }
  }

  // Función para deshabilitar fechas pasadas y fechas no disponibles
  const disabledDates = (date: Date) => {
    // Deshabilitar fechas pasadas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true

    // Deshabilitar fechas más allá de 2 meses
    const twoMonthsLater = new Date()
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2)
    if (date > twoMonthsLater) return true

    // Deshabilitar días no disponibles según la disponibilidad del servicio
    if (service?.availability) {
      const dayOfWeek = date.getDay()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const dayName = dayNames[dayOfWeek]

      if (!service.availability.days[dayName as keyof typeof service.availability.days]) {
        return true
      }

      // Deshabilitar fechas específicas no disponibles
      if (
        service.availability.unavailableDates?.some(
          (unavailableDate) => new Date(unavailableDate).toDateString() === date.toDateString(),
        )
      ) {
        return true
      }
    }

    return false
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Cargando información del servicio...</p>
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
        <Button className="mt-4" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se encontró el servicio solicitado.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/servicios")}>
          Ver otros servicios
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reservar servicio</h1>
        <p className="text-muted-foreground">Selecciona fecha y hora para "{service.title}"</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Selecciona fecha y hora</CardTitle>
            <CardDescription>Elige un día y horario disponible para tu reserva</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Selecciona una fecha</h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
                disabled={disabledDates}
              />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Selecciona una hora</h3>
                </div>
                <TimeSlots
                  selectedDate={selectedDate}
                  availability={service.availability}
                  onSelectTime={handleSelectTime}
                />
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">Notas adicionales (opcional)</h3>
              <Textarea
                placeholder="Añade cualquier información adicional que el proveedor deba saber..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de la reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={service.images?.[0] || "/placeholder.svg"}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">Por {service.provider.name}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Selecciona un paquete</h3>
                <div className="grid gap-2">
                  {service.packages.map((pkg) => (
                    <Button
                      key={pkg.type}
                      variant={selectedPackage === pkg.type ? "default" : "outline"}
                      className="justify-between"
                      onClick={() => setSelectedPackage(pkg.type as "basico" | "estandar" | "premium")}
                    >
                      <span className="capitalize">{pkg.type}</span>
                      <span>${pkg.price}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {selectedDate && selectedTime ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Detalles de la reserva</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Fecha:</div>
                    <div>{selectedDate.toLocaleDateString()}</div>
                    <div className="text-muted-foreground">Hora:</div>
                    <div>
                      {selectedTime.start} - {selectedTime.end}
                    </div>
                    <div className="text-muted-foreground">Paquete:</div>
                    <div className="capitalize">{selectedPackage}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Selecciona una fecha y hora para ver los detalles de la reserva.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full flex items-center justify-between">
                <span>Total a pagar</span>
                <span className="font-bold text-lg">
                  ${service.packages.find((p) => p.type === selectedPackage)?.price || 0}
                </span>
              </div>
              <Button className="w-full" disabled={!selectedDate || !selectedTime || submitting} onClick={handleSubmit}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirmar reserva
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Política de cancelación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Puedes cancelar tu reserva hasta 24 horas antes de la hora programada sin cargos. Las cancelaciones
                posteriores pueden estar sujetas a cargos según la política del proveedor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
