"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Edit, Eye, Plus, Star, Trash2 } from "lucide-react"

export default function MisServiciosPage() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)

  // Mock data para servicios
  const services = [
    {
      id: 1,
      title: "Diseño de logotipos profesionales",
      description:
        "Creación de logotipos únicos y memorables para tu marca. Incluye múltiples conceptos y revisiones ilimitadas.",
      price: 60,
      image: "/placeholder.svg?height=100&width=150",
      category: "Diseño",
      rating: 4.8,
      reviews: 12,
      status: "activo",
      reservations: 5,
      views: 120,
    },
    {
      id: 2,
      title: "Diseño de tarjetas de presentación",
      description:
        "Diseño de tarjetas de presentación elegantes y profesionales. Incluye diseño a doble cara y archivos listos para imprenta.",
      price: 35,
      image: "/placeholder.svg?height=100&width=150",
      category: "Diseño",
      rating: 5.0,
      reviews: 6,
      status: "activo",
      reservations: 3,
      views: 85,
    },
    {
      id: 3,
      title: "Diseño de flyers y folletos",
      description:
        "Creación de flyers y folletos atractivos para promocionar tu negocio o evento. Diseños personalizados y de alta calidad.",
      price: 45,
      image: "/placeholder.svg?height=100&width=150",
      category: "Diseño",
      rating: 4.7,
      reviews: 4,
      status: "borrador",
      reservations: 0,
      views: 0,
    },
  ]

  // Mock data para reservas
  const bookings = [
    {
      id: 1,
      service: "Diseño de logotipos profesionales",
      client: "Juan Pérez",
      date: "15 de mayo, 2023",
      time: "10:00 AM",
      status: "confirmado",
      price: 60,
    },
    {
      id: 2,
      service: "Diseño de logotipos profesionales",
      client: "María López",
      date: "18 de mayo, 2023",
      time: "3:00 PM",
      status: "pendiente",
      price: 60,
    },
    {
      id: 3,
      service: "Diseño de tarjetas de presentación",
      client: "Carlos Rodríguez",
      date: "20 de mayo, 2023",
      time: "11:00 AM",
      status: "completado",
      price: 35,
    },
  ]

  // Función para manejar la eliminación de un servicio
  const handleDeleteService = (id: number) => {
    setServiceToDelete(id)
    setOpenDeleteDialog(true)
  }

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar el servicio
    console.log(`Servicio ${serviceToDelete} eliminado`)
    setOpenDeleteDialog(false)
    setServiceToDelete(null)
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mis servicios</h1>
          <Button asChild>
            <Link href="/publicar">
              <Plus className="h-4 w-4 mr-2" />
              Publicar nuevo servicio
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">Administra los servicios que ofreces en la plataforma</p>
      </div>

      <Tabs defaultValue="servicios">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="servicios">Mis servicios</TabsTrigger>
          <TabsTrigger value="reservas">Reservas recibidas</TabsTrigger>
        </TabsList>
        <TabsContent value="servicios" className="mt-6">
          <div className="grid gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-32 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{service.category}</Badge>
                            <Badge
                              variant={service.status === "activo" ? "secondary" : "outline"}
                              className="capitalize"
                            >
                              {service.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm">{service.rating}</span>
                            <span className="text-xs text-muted-foreground">({service.reviews})</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{service.views} vistas</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{service.reservations} reservas</span>
                          </div>
                          <div className="font-bold">
                            ${service.price} <span className="text-xs font-normal text-muted-foreground">/ hora</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-2 mr-2">
                            <Switch id={`active-${service.id}`} defaultChecked={service.status === "activo"} />
                            <Label htmlFor={`active-${service.id}`} className="text-sm">
                              Activo
                            </Label>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/servicios/${service.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/publicar/editar/${service.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reservas" className="mt-6">
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{booking.service}</h3>
                      <Badge
                        variant={
                          booking.status === "confirmado"
                            ? "secondary"
                            : booking.status === "completado"
                              ? "outline"
                              : "default"
                        }
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium">{booking.client}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha y hora</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Precio</p>
                        <p className="font-bold">${booking.price}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      {booking.status === "pendiente" && (
                        <>
                          <Button variant="outline" size="sm">
                            Rechazar
                          </Button>
                          <Button size="sm">Confirmar</Button>
                        </>
                      )}
                      {booking.status === "confirmado" && (
                        <>
                          <Button variant="outline" size="sm">
                            Reprogramar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancelar
                          </Button>
                          <Button size="sm">Marcar como completado</Button>
                        </>
                      )}
                      {booking.status === "completado" && (
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu servicio y eliminará los datos de
              nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
