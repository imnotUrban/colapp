import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Search, Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ServiciosPage() {
  const services = Array(9)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      title: `Servicio de ejemplo ${i + 1}`,
      category: ["Diseño", "Tecnología", "Bienestar", "Educación", "Hogar", "Eventos"][i % 6],
      price: Math.floor(Math.random() * 80) + 20,
      rating: (Math.random() * (5 - 4) + 4).toFixed(1),
      reviews: Math.floor(Math.random() * 150) + 10,
      image: `/placeholder.svg?height=200&width=300`,
      provider: `Proveedor ${i + 1}`,
    }))

  const categories = ["Diseño", "Tecnología", "Bienestar", "Educación", "Hogar", "Eventos"]

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Servicios disponibles</h1>
        <p className="text-muted-foreground">Encuentra el servicio perfecto para tus necesidades</p>
      </div>

      {/* Search and filters */}
      <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] mb-8">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="font-medium mb-3">Filtros</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Categorías</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category}`} />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Rango de precio</h4>
                <div className="space-y-4">
                  <Slider defaultValue={[0, 100]} max={100} step={1} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">$0</span>
                    <span className="text-sm">$100+</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Valoración mínima</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <Checkbox id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {rating}+
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">Aplicar filtros</Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar servicios..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="recientes">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recientes">Más recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{service.category}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-xs text-muted-foreground">({service.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                  <CardDescription>Por {service.provider}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <p className="font-bold">
                    ${service.price} <span className="text-xs font-normal text-muted-foreground">/ hora</span>
                  </p>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/servicios/${service.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
