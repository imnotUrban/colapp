"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, MapPin, MessageSquare, Share, Star, Loader2 } from "lucide-react"
import { serviceApi } from "@/app/api/serviceApi"
import ReviewsList from "@/components/reviews-list"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [refreshReviews, setRefreshReviews] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const response = await serviceApi.getServiceById(params.id)
        setService(response.service)
      } catch (err) {
        console.error("Error al cargar el servicio:", err)
        setError("No se pudo cargar la información del servicio.")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [params.id])

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: service?.title,
          text: `Mira este servicio en ColApp: ${service?.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error al compartir:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles.",
      })
    }
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

  if (error || !service) {
    return (
      <div className="container px-4 py-8 md:px-6 text-center">
        <p className="text-red-500 mb-4">{error || "No se encontró el servicio solicitado."}</p>
        <Button asChild>
          <Link href="/servicios">Ver otros servicios</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{service.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Badge variant="outline">{service.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{service.rating.average.toFixed(1)}</span>
                <span className="text-muted-foreground">({service.rating.count} reseñas)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{service.provider.location || "No especificada"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <img
              src={service.images?.[0] || "/placeholder.svg?height=400&width=600"}
              alt={service.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <Tabs defaultValue="descripcion">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" className="p-4 border rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-2">Acerca de este servicio</h3>
              <p className="text-muted-foreground">{service.description}</p>

              <h3 className="text-lg font-medium mt-6 mb-2">Lo que incluye</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.packages?.[0]?.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="proveedor" className="p-4 border rounded-lg mt-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                  <AvatarFallback>{service.provider.name?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{service.provider.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{service.provider.rating?.average?.toFixed(1) || "0.0"}</span>
                    <span className="text-muted-foreground">({service.provider.rating?.count || 0} reseñas)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Miembro desde {new Date(service.provider.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.provider.bio || "Este proveedor no ha añadido una biografía."}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contactar proveedor
              </Button>
            </TabsContent>
            <TabsContent value="resenas" className="p-4 border rounded-lg mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Reseñas de clientes</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-lg font-medium">{service.rating.average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({service.rating.count})</span>
                </div>
              </div>
              <ReviewsList serviceId={service._id} refreshTrigger={refreshReviews} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reserva este servicio</CardTitle>
              <CardDescription>Selecciona fecha y hora para agendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Selecciona una fecha</h3>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                    disabled={(date) =>
                      date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                    }
                  />
                </div>

                {selectedDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Selecciona una hora</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {service.availability?.timeSlots?.map((slot: string, index: number) => (
                        <Button key={index} variant="outline" className="justify-start">
                          {slot}
                        </Button>
                      )) || (
                        <>
                          <Button variant="outline" className="justify-start">
                            9:00 AM
                          </Button>
                          <Button variant="outline" className="justify-start">
                            11:00 AM
                          </Button>
                          <Button variant="outline" className="justify-start">
                            2:00 PM
                          </Button>
                          <Button variant="outline" className="justify-start">
                            4:00 PM
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full flex items-center justify-between text-sm">
                <span>Precio por hora</span>
                <span className="font-medium">${service.packages?.[0]?.price || 0}</span>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/servicios/${service._id}/reservar`}>Reservar ahora</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Compartir servicio
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicios similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={`/placeholder.svg?height=64&width=64`}
                      alt={`Servicio similar ${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">Servicio similar {i}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">${Math.floor(Math.random() * 80) + 20}</div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full" asChild>
                <Link href="/servicios">Ver más servicios</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
