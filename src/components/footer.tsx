import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="text-xl font-bold text-primary">
            ColApp
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Una aplicación colaborativa para ofrecer servicios de calidad y seguros
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-sm font-medium">Plataforma</h3>
            <nav className="flex flex-col items-center md:items-start gap-2">
              <Link href="/servicios" className="text-sm text-muted-foreground hover:text-foreground">
                Explorar servicios
              </Link>
              <Link href="/como-funciona" className="text-sm text-muted-foreground hover:text-foreground">
                Cómo funciona
              </Link>
              <Link href="/precios" className="text-sm text-muted-foreground hover:text-foreground">
                Precios
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-sm font-medium">Soporte</h3>
            <nav className="flex flex-col items-center md:items-start gap-2">
              <Link href="/ayuda" className="text-sm text-muted-foreground hover:text-foreground">
                Centro de ayuda
              </Link>
              <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground">
                Contacto
              </Link>
              <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground">
                Términos y condiciones
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mt-6 pt-6 border-t">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} ColApp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
