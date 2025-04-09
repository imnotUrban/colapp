"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowDownUp, CreditCard, Download, Plus, Wallet } from "lucide-react"

export default function WalletPage() {
  const [showAddFunds, setShowAddFunds] = useState(false)

  // Mock wallet data
  const wallet = {
    balance: 450.75,
    pendingBalance: 120.0,
    transactions: [
      {
        id: 1,
        type: "ingreso",
        amount: 120.0,
        description: "Pago por servicio de diseño de logotipo",
        date: "12 de mayo, 2023",
        status: "completado",
      },
      {
        id: 2,
        type: "egreso",
        amount: 45.5,
        description: "Retiro a cuenta bancaria",
        date: "5 de mayo, 2023",
        status: "completado",
      },
      {
        id: 3,
        type: "ingreso",
        amount: 85.0,
        description: "Pago por servicio de diseño de tarjetas",
        date: "28 de abril, 2023",
        status: "completado",
      },
      {
        id: 4,
        type: "ingreso",
        amount: 120.0,
        description: "Pago pendiente por servicio de diseño web",
        date: "15 de mayo, 2023",
        status: "pendiente",
      },
    ],
    paymentMethods: [
      {
        id: 1,
        type: "credit",
        name: "Visa terminada en 4589",
        expiry: "05/25",
        isDefault: true,
      },
      {
        id: 2,
        type: "bank",
        name: "Cuenta bancaria terminada en 7890",
        expiry: null,
        isDefault: false,
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mi billetera</h1>
        <p className="text-muted-foreground">Administra tus fondos y transacciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Balance disponible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${wallet.balance.toFixed(2)}</div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" onClick={() => setShowAddFunds(!showAddFunds)}>
                  {showAddFunds ? "Cancelar" : "Añadir fondos"}
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownUp className="h-5 w-5" />
                  Balance pendiente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${wallet.pendingBalance.toFixed(2)}</div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Los fondos pendientes estarán disponibles una vez que se completen los servicios.
                </p>
              </CardFooter>
            </Card>
          </div>

          {showAddFunds && (
            <Card>
              <CardHeader>
                <CardTitle>Añadir fondos</CardTitle>
                <CardDescription>Selecciona un método de pago y el monto a añadir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Método de pago</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Selecciona un método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallet.paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          {method.name} {method.isDefault && "(Predeterminado)"}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Añadir nuevo método de pago
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input id="amount" type="number" placeholder="0.00" className="pl-7" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowAddFunds(false)}>
                  Cancelar
                </Button>
                <Button>Añadir fondos</Button>
              </CardFooter>
            </Card>
          )}

          <Tabs defaultValue="todas">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Historial de transacciones</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="egresos">Egresos</TabsTrigger>
            </TabsList>
            <TabsContent value="todas" className="p-4 border rounded-lg mt-4">
              <div className="space-y-4">
                {wallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "ingreso" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                      >
                        <ArrowDownUp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${transaction.type === "ingreso" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "ingreso" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                      <Badge variant={transaction.status === "completado" ? "outline" : "secondary"} className="mt-1">
                        {transaction.status === "completado" ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="ingresos" className="p-4 border rounded-lg mt-4">
              <div className="space-y-4">
                {wallet.transactions
                  .filter((t) => t.type === "ingreso")
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <ArrowDownUp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+${transaction.amount.toFixed(2)}</div>
                        <Badge variant={transaction.status === "completado" ? "outline" : "secondary"} className="mt-1">
                          {transaction.status === "completado" ? "Completado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="egresos" className="p-4 border rounded-lg mt-4">
              <div className="space-y-4">
                {wallet.transactions
                  .filter((t) => t.type === "egreso")
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                          <ArrowDownUp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">-${transaction.amount.toFixed(2)}</div>
                        <Badge variant={transaction.status === "completado" ? "outline" : "secondary"} className="mt-1">
                          {transaction.status === "completado" ? "Completado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de pago</CardTitle>
              <CardDescription>Administra tus métodos de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wallet.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      {method.expiry && <div className="text-xs text-muted-foreground">Expira: {method.expiry}</div>}
                    </div>
                  </div>
                  {method.isDefault && <Badge variant="outline">Predeterminado</Badge>}
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Añadir método de pago
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retirar fondos</CardTitle>
              <CardDescription>Transfiere tu dinero a una cuenta bancaria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-method">Método de retiro</Label>
                <Select defaultValue="2">
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Selecciona un método de retiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallet.paymentMethods
                      .filter((m) => m.type === "bank")
                      .map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          {method.name}
                        </SelectItem>
                      ))}
                    <SelectItem value="new">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Añadir nueva cuenta bancaria
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Monto a retirar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input id="withdraw-amount" type="number" placeholder="0.00" className="pl-7" />
                </div>
                <p className="text-xs text-muted-foreground">Monto máximo disponible: ${wallet.balance.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span>Comisión por retiro (2%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Total a recibir</span>
                <span>$0.00</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Retirar fondos</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
