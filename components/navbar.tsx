"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Calendar, Home, Menu, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const routes = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/servicios", label: "Servicios", icon: Calendar },
    { href: "/billetera", label: "Billetera", icon: Wallet, requireAuth: true },
    { href: "/perfil", label: "Perfil", icon: User, requireAuth: true },
  ]

  // Filtrar rutas según autenticación
  const filteredRoutes = routes.filter((route) => !route.requireAuth || isAuthenticated)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">ColApp</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 px-2 pt-8">
                {filteredRoutes.map((route) => {
                  const Icon = route.icon
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground",
                        pathname === route.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  )
                })}
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/auth/registro"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">ColApp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {filteredRoutes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground",
                  pathname === route.href && "text-foreground font-medium",
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Notificaciones</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "Usuario"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">Mi perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/billetera">Mi billetera</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-servicios">Mis servicios</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-reservas">Mis reservas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/registro">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
