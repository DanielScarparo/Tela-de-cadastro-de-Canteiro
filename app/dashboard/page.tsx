"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">Dashboard - Bem-vindo!</CardTitle>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Sair
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600 mb-4">Login realizado com sucesso!</h2>
              <p className="text-gray-500">Você está agora logado no sistema Velocity4.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
