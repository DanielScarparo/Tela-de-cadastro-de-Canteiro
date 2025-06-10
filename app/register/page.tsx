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

export default function RegisterPage() {
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmSenha, setConfirmSenha] = useState("")
  const [nome, setNome] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    // Simula delay de cadastro
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...")

    setTimeout(() => {
      router.push("/login")
    }, 2000)

    setIsLoading(false)
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-gray-800 rounded-3xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Título */}
            <h1 className="text-xl font-bold text-gray-800 tracking-wider">CADASTRO</h1>

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
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-left">
                <Label htmlFor="nome" className="text-sm font-semibold text-gray-800">
                  NOME:
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome..."
                  className="mt-1 bg-gray-300 border-0 rounded-full px-4 py-3 placeholder:text-gray-600"
                  required
                />
              </div>

              <div className="text-left">
                <Label htmlFor="cpf" className="text-sm font-semibold text-gray-800">
                  CPF:
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="Digite seu CPF..."
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
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="mt-1 bg-gray-300 border-0 rounded-full px-4 py-3 placeholder:text-gray-600"
                  required
                />
              </div>

              <div className="text-left">
                <Label htmlFor="confirmSenha" className="text-sm font-semibold text-gray-800">
                  CONFIRMAR SENHA:
                </Label>
                <Input
                  id="confirmSenha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  placeholder="Confirme sua senha..."
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

              {/* Mensagem de sucesso */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700 text-sm">{success}</AlertDescription>
                </Alert>
              )}

              {/* Botão Cadastrar */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-sm tracking-wider"
              >
                {isLoading ? "CADASTRANDO..." : "CADASTRAR"}
              </Button>
            </form>

            {/* Link para login */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Já tem cadastro? Faça login aqui!</p>
              <Button
                type="button"
                onClick={handleBackToLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-full text-sm"
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
