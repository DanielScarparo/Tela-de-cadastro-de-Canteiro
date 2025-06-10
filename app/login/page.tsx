"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Simulando uma base de usuários cadastrados
const registeredUsers = [
  { cpf: "123.456.789-00", senha: "123456" },
  { cpf: "987.654.321-00", senha: "senha123" },
]

export default function LoginPage() {
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")

    // Aplica a máscara do CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    }
    return value
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
    setError("")
  }

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value)
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simula delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verifica se o usuário está cadastrado
    const user = registeredUsers.find((u) => u.cpf === cpf && u.senha === senha)

    if (user) {
      // Login bem-sucedido - redireciona para dashboard
      router.push("/dashboard")
    } else {
      setError("CPF ou senha incorretos. Apenas usuários cadastrados podem fazer login.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-gray-800 rounded-3xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Título */}
            <h1 className="text-xl font-bold text-gray-800 tracking-wider">BEM-VINDO</h1>

            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src="/logo-velocity4.png"
                  alt="Velocity4 Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-left">
                <Label htmlFor="cpf" className="text-sm font-semibold text-gray-800">
                  CPF:
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="Digite aqui..."
                  className="mt-1 bg-gray-300 border-0 rounded-full px-4 py-3 placeholder:text-gray-600"
                  maxLength={14}
                  required
                />
              </div>

              <div className="text-left">
                <Label htmlFor="senha" className="text-sm font-semibold text-gray-800">
                  SENHA:
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={handleSenhaChange}
                  placeholder="Digite aqui..."
                  className="mt-1 bg-gray-300 border-0 rounded-full px-4 py-3 placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Mensagem de erro */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botão Login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-sm tracking-wider"
              >
                {isLoading ? "ENTRANDO..." : "LOGIN"}
              </Button>
            </form>

            {/* Link para registro */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Não tem cadastro? Registre-se aqui!</p>
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-full text-sm"
              >
                Registre-se
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
