"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ImagePlus, Info, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PublicarServicioPage() {
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Categorías disponibles
  const categories = [
    "Diseño",
    "Tecnología",
    "Bienestar",
    "Educación",
    "Hogar",
    "Eventos",
    "Marketing",
    "Legal",
    "Finanzas",
    "Otros",
  ]

  // Función para manejar la adición de imágenes
  const handleAddImage = () => {
    // En una implementación real, aquí se manejaría la carga de imágenes
    // Por ahora, simplemente agregamos una imagen de placeholder
    const newImage = `/placeholder.svg?height=200&width=300&text=Imagen ${selectedImages.length + 1}`
    setSelectedImages([...selectedImages, newImage])
  }

  // Función para eliminar una imagen
  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages]
    newImages.splice(index, 1)
    setSelectedImages(newImages)
  }

  // Función para agregar una etiqueta
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  // Función para eliminar una etiqueta
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulamos un envío de formulario
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirigimos a la página de servicios
      router.push("/mis-servicios")
    }, 1500)
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Publicar un nuevo servicio</h1>
        <p className="text-muted-foreground">Comparte tus habilidades y ofrece tus servicios a la comunidad</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Completa todos los campos obligatorios y proporciona información detallada para aumentar la visibilidad de tu
          servicio.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
                <CardDescription>Detalles principales de tu servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título del servicio <span className="text-destructive">*</span>
                  </Label>
                  <Input id="title" placeholder="Ej: Diseño de logotipos profesionales" required />
                  <p className="text-xs text-muted-foreground">
                    Elige un título claro y descriptivo (máximo 60 caracteres)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoría <span className="text-destructive">*</span>
                  </Label>
                  <Select required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente el servicio que ofreces..."
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Incluye qué ofreces, tu experiencia, y por qué deberían elegirte (mínimo 100 caracteres)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Etiquetas</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Añade palabras clave"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 rounded-full hover:bg-muted p-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Añade hasta 5 etiquetas para ayudar a los usuarios a encontrar tu servicio
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>Añade fotos que muestren tu servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-md overflow-hidden border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {selectedImages.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="aspect-video rounded-md border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                    >
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Añadir imagen</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Puedes subir hasta 5 imágenes (JPG, PNG). La primera imagen será la principal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precios y paquetes</CardTitle>
                <CardDescription>Define cuánto cobrarás por tu servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="basico">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basico">Básico</TabsTrigger>
                    <TabsTrigger value="estandar">Estándar</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basico" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price-basic">
                          Precio <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input id="price-basic" type="number" min="1" className="pl-7" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-basic">
                          Tiempo de entrega <span className="text-destructive">*</span>
                        </Label>
                        <Select required>
                          <SelectTrigger id="delivery-basic">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day} {day === 1 ? "día" : "días"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-basic">Descripción del paquete básico</Label>
                      <Textarea id="description-basic" placeholder="¿Qué incluye este paquete?" rows={3} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Características incluidas</Label>
                      <div className="grid gap-2">
                        {["Entrega de archivos fuente", "1 revisión", "Licencia comercial"].map((feature, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`feature-basic-${i}`} />
                            <Label htmlFor={`feature-basic-${i}`} className="text-sm font-normal">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="estandar" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price-standard">Precio</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input id="price-standard" type="number" min="1" className="pl-7" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-standard">Tiempo de entrega</Label>
                        <Select>
                          <SelectTrigger id="delivery-standard">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day} {day === 1 ? "día" : "días"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-standard">Descripción del paquete estándar</Label>
                      <Textarea id="description-standard" placeholder="¿Qué incluye este paquete?" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Características incluidas</Label>
                      <div className="grid gap-2">
                        {["Entrega de archivos fuente", "3 revisiones", "Licencia comercial", "Entrega express"].map(
                          (feature, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox id={`feature-standard-${i}`} />
                              <Label htmlFor={`feature-standard-${i}`} className="text-sm font-normal">
                                {feature}
                              </Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="premium" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price-premium">Precio</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input id="price-premium" type="number" min="1" className="pl-7" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-premium">Tiempo de entrega</Label>
                        <Select>
                          <SelectTrigger id="delivery-premium">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day} {day === 1 ? "día" : "días"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-premium">Descripción del paquete premium</Label>
                      <Textarea id="description-premium" placeholder="¿Qué incluye este paquete?" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Características incluidas</Label>
                      <div className="grid gap-2">
                        {[
                          "Entrega de archivos fuente",
                          "Revisiones ilimitadas",
                          "Licencia comercial",
                          "Entrega express",
                          "Soporte prioritario",
                        ].map((feature, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Checkbox id={`feature-premium-${i}`} />
                            <Label htmlFor={`feature-premium-${i}`} className="text-sm font-normal">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
                <CardDescription>Configura tu horario de trabajo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Días disponibles</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                      <div key={day} className="flex items-center justify-between">
                        <Label htmlFor={`day-${day.toLowerCase()}`} className="text-sm">
                          {day}
                        </Label>
                        <Switch id={`day-${day.toLowerCase()}`} defaultChecked={day !== "Domingo"} />
                      </div>
                    ))}
                  </div>
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

                <Separator />

                <div className="space-y-2">
                  <Label>Duración de las sesiones</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                    <SelectContent>
                      {[30, 45, 60, 90, 120].map((minutes) => (
                        <SelectItem key={minutes} value={minutes.toString()}>
                          {minutes} minutos
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Fechas no disponibles</Label>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requisitos adicionales</CardTitle>
                <CardDescription>Información que necesitas de tus clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos para el cliente</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Ej: Información específica, archivos, preferencias..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Especifica qué información o materiales necesitas que te proporcione el cliente
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="questionnaire" />
                  <Label htmlFor="questionnaire" className="text-sm font-normal">
                    Solicitar que el cliente complete un cuestionario antes de la reserva
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publicación</CardTitle>
                <CardDescription>Revisa y publica tu servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Acepto los{" "}
                    <a href="/terminos" className="text-primary hover:underline">
                      términos y condiciones
                    </a>{" "}
                    de ColApp
                  </Label>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Tu servicio será revisado por nuestro equipo antes de ser publicado. Este proceso puede tomar
                        hasta 24 horas.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Publicando..." : "Publicar servicio"}
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Guardar como borrador
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
