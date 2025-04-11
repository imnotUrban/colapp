"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, MapPin, Star, Upload } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const user = {
    name: "Carlos Rodríguez",
    username: "carlos_rodriguez",
    email: "carlos@example.com",
    phone: "+52 123 456 7890",
    location: "Ciudad de México",
    bio: "Diseñador gráfico profesional con más de 5 años de experiencia en branding y diseño web.",
    avatar: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=300&width=1000",
    memberSince: "Enero 2022",
    completedServices: 24,
    rating: 4.9,
    reviews: 18,
    skills: ["Diseño gráfico", "Ilustración", "Branding", "UI/UX", "Photoshop", "Illustrator"],
    services: [
      {
        id: 1,
        title: "Diseño de logotipos profesionales",
        price: 60,
        image: "/placeholder.svg?height=100&width=150",
        category: "Diseño",
        rating: 4.8,
        reviews: 12,
      },
      {
        id: 2,
        title: "Diseño de tarjetas de presentación",
        price: 35,
        image: "/placeholder.svg?height=100&width=150",
        category: "Diseño",
        rating: 5.0,
        reviews: 6,
      },
    ],
    bookings: [
      {
        id: 1,
        service: "Clases de yoga online",
        provider: "Ana Martínez",
        date: "15 de mayo, 2023",
        time: "10:00 AM",
        status: "Completado",
      },
      {
        id: 2,
        service: "Reparación de computadora",
        provider: "Juan López",
        date: "22 de mayo, 2023",
        time: "3:00 PM",
        status: "Pendiente",
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-xl overflow-hidden">
          <img src={user.banner || "/placeholder.svg"} alt="Banner de perfil" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-16 left-4 flex items-end">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Guardar cambios" : "Editar perfil"}</Button>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{user.rating}</span>
                <span className="text-muted-foreground">({user.reviews} reseñas)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Miembro desde {user.memberSince}</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">{user.bio}</p>
          </div>

          <Tabs defaultValue="servicios">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="servicios">Mis servicios</TabsTrigger>
              <TabsTrigger value="reservas">Mis reservas</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas</TabsTrigger>
            </TabsList>
            <TabsContent value="servicios" className="p-4 border rounded-lg mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Servicios ofrecidos</h3>
                <Button>Publicar nuevo servicio</Button>
              </div>
              <div className="grid gap-4">
                {user.services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{service.category}</Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm">{service.rating}</span>
                                <span className="text-xs text-muted-foreground">({service.reviews})</span>
                              </div>
                            </div>
                            <h4 className="font-medium mt-1">{service.title}</h4>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-bold">
                              ${service.price} <span className="text-xs font-normal text-muted-foreground">/ hora</span>
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm">
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
            <TabsContent value="reservas" className="p-4 border rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-4">Mis reservas</h3>
              <div className="grid gap-4">
                {user.bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{booking.service}</h4>
                          <Badge variant={booking.status === "Completado" ? "outline" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Proveedor: {booking.provider}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {booking.status === "Completado" ? (
                            <Button variant="outline" size="sm">
                              Dejar reseña
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm">
                                Reprogramar
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resenas" className="p-4 border rounded-lg mt-4">
              <h3 className="text-lg font-medium mb-4">Reseñas recibidas</h3>
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`Usuario ${i + 1}`} />
                          <AvatarFallback>U{i + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Usuario {i + 1}</div>
                          <div className="text-xs text-muted-foreground">15 de abril, 2023</div>
                        </div>
                        <div className="ml-auto flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < 5 ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Excelente servicio, muy profesional y puntual. El trabajo entregado superó mis expectativas.
                        Definitivamente volveré a contratar sus servicios.
                      </p>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar perfil</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Foto de perfil</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar foto
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner">Imagen de portada</Label>
                  <div className="h-24 w-full rounded-md overflow-hidden">
                    <img
                      src={user.banner || "/placeholder.svg"}
                      alt="Banner de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar portada
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input id="username" defaultValue={user.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" defaultValue={user.location} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea id="bio" defaultValue={user.bio} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Habilidades</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button className="ml-1 rounded-full hover:bg-muted p-1">×</button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      Añadir
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsEditing(false)}>Guardar cambios</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                  <div className="text-muted-foreground">Email:</div>
                  <div>{user.email}</div>
                  <div className="text-muted-foreground">Teléfono:</div>
                  <div>{user.phone}</div>
                  <div className="text-muted-foreground">Ubicación:</div>
                  <div>{user.location}</div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span>{day}</span>
                    <div className="flex items-center gap-2">
                      <Switch id={`${day.toLowerCase()}-switch`} />
                      <Label htmlFor={`${day.toLowerCase()}-switch`}>Disponible</Label>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Horario de trabajo</Label>
                <div className="flex items-center gap-4">
                  <Select defaultValue="9">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Desde" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>a</span>
                  <Select defaultValue="17">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Hasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
