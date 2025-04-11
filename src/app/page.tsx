import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

export default function Home() {
  const featuredServices = [
    {
      id: 1,
      title: "Diseño gráfico profesional",
      category: "Diseño",
      price: 45,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=200&width=300",
      provider: "María G.",
    },
    {
      id: 2,
      title: "Clases de yoga online",
      category: "Bienestar",
      price: 25,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=200&width=300",
      provider: "Carlos R.",
    },
    {
      id: 3,
      title: "Reparación de computadoras",
      category: "Tecnología",
      price: 60,
      rating: 4.7,
      reviews: 56,
      image: "/placeholder.svg?height=200&width=300",
      provider: "Ana P.",
    },
  ]

  const categories = [
    { name: "Diseño", count: 145 },
    { name: "Tecnología", count: 98 },
    { name: "Bienestar", count: 76 },
    { name: "Educación", count: 112 },
    { name: "Hogar", count: 89 },
    { name: "Eventos", count: 54 },
  ]

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-background dark:from-pink-950/20 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Servicios de calidad, conexiones seguras
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Encuentra profesionales confiables o comparte tus habilidades en nuestra plataforma colaborativa.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/servicios">Explorar servicios</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/publicar">Ofrecer un servicio</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex items-center justify-center">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  alt="ColApp en acción"
                  className="aspect-video object-cover w-full max-w-[500px]"
                  src="/placeholder.svg?height=300&width=500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Servicios destacados</h2>
          <p className="text-muted-foreground">Descubre los servicios mejor valorados por nuestra comunidad</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
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
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/servicios">Ver todos los servicios</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="container px-4 md:px-6 py-8 bg-accent/30 rounded-xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">¿Cómo funciona ColApp?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nuestra plataforma conecta a personas que necesitan servicios con profesionales de confianza en tres simples
            pasos
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
              <span className="font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Encuentra un servicio</h3>
            <p className="text-muted-foreground">
              Explora nuestra amplia gama de servicios y encuentra el profesional perfecto para tus necesidades.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
              <span className="font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Agenda una cita</h3>
            <p className="text-muted-foreground">
              Selecciona la fecha y hora que mejor te convenga en el calendario del profesional.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
              <span className="font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Disfruta y valora</h3>
            <p className="text-muted-foreground">
              Recibe el servicio y comparte tu experiencia dejando una reseña para ayudar a otros usuarios.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Explora por categorías</h2>
          <p className="text-muted-foreground">Encuentra servicios clasificados por áreas de especialidad</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categorias/${category.name.toLowerCase()}`}
              className="group flex flex-col items-center justify-center p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary transition-colors"
            >
              <h3 className="font-medium group-hover:text-primary">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.count} servicios</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 md:px-6 py-8 bg-muted/50 rounded-xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Lo que dice nuestra comunidad</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experiencias reales de usuarios que han utilizado ColApp
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-background">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img
                      alt={`Usuario ${i}`}
                      src={`/placeholder.svg?height=40&width=40`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">Usuario {i}</CardTitle>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <Star key={j} className={`h-4 w-4 ${j < 5 ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "ColApp ha transformado la forma en que encuentro servicios profesionales. La plataforma es intuitiva,
                  los profesionales son de alta calidad y el sistema de agenda hace todo muy sencillo."
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 md:px-6">
        <div className="rounded-xl bg-primary text-primary-foreground p-8 md:p-12 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">¿Tienes una habilidad para compartir?</h2>
              <p className="text-primary-foreground/90 mb-4">
                Únete a nuestra comunidad de profesionales y comienza a ofrecer tus servicios hoy mismo.
              </p>
              <ul className="space-y-2 mb-6">
                {["Crea tu perfil profesional", "Establece tu disponibilidad", "Recibe pagos seguros"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button asChild variant="secondary" size="lg">
                <Link href="/registro">Comenzar ahora</Link>
              </Button>
            </div>
            <div className="hidden lg:block">
              <img
                alt="Profesionales en ColApp"
                className="rounded-lg object-cover w-full max-w-[400px] mx-auto"
                src="/placeholder.svg?height=300&width=400"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
