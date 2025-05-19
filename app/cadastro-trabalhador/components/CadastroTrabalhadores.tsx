"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { validarCPF, formatarCPF } from "../utils/cpf-validator"

// Definição do schema de validação
const formSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  perfil: z.string().min(1, { message: "Selecione um perfil" }),
  matricula: z.string().min(1, { message: "Matrícula é obrigatória" }),
  cpf: z
    .string()
    .min(14, { message: "CPF deve ter 11 dígitos" })
    .max(14, { message: "CPF deve ter 11 dígitos" })
    .refine((cpf) => validarCPF(cpf), {
      message: "CPF inválido. Verifique os dígitos informados.",
    }),
  funcao: z.string().min(1, { message: "Função é obrigatória" }),
  status: z.string().min(1, { message: "Status é obrigatório" }),
  alocacao: z.string().min(1, { message: "Selecione uma alocação" }), // Alterado para string simples
})

type FormValues = z.infer<typeof formSchema>

// Opções para os selects
const perfisOptions = [
  { value: "colaborador", label: "Colaborador" },
  { value: "gerente", label: "Gerente" },
  { value: "motorista", label: "Motorista" },
  { value: "administrativo", label: "Administrativo" },
  { value: "supervisor", label: "Supervisor" },
]

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "afastado", label: "Afastado" },
  { value: "desligado", label: "Desligado" },
]

// Opções de alocação (exemplo - futuramente virá do banco de dados)
const alocacaoOptions = [
  { value: "alojamento-1", label: "Alojamento Central - Rua Principal, 123" },
  { value: "alojamento-2", label: "Alojamento Norte - Av. das Flores, 456" },
  { value: "alojamento-3", label: "Alojamento Sul - Rua dos Pinheiros, 789" },
  { value: "alojamento-4", label: "Alojamento Leste - Av. Brasil, 1000" },
  { value: "alojamento-5", label: "Alojamento Oeste - Rua das Palmeiras, 250" },
  { value: "alojamento-6", label: "Alojamento Sede - Av. Central, 888" },
]

export default function CadastroTrabalhadores() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      perfil: "",
      matricula: "",
      cpf: "",
      funcao: "",
      status: "ativo",
      alocacao: "", // Inicializa como string vazia
    },
    mode: "onChange",
  })

  // Função para salvar o formulário
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true)

    // Simulando uma chamada de API
    setTimeout(() => {
      // Encontrar o nome da alocação selecionada
      const alocacaoSelecionada =
        alocacaoOptions.find((option) => option.value === data.alocacao)?.label || "não especificada"

      // Mostrar toast de sucesso
      toast.success(
        `Cadastro realizado com sucesso! O colaborador ${data.nomeCompleto} foi cadastrado na alocação: ${alocacaoSelecionada}`,
        {
          duration: 5000,
        },
      )

      // Limpar o formulário após o envio bem-sucedido
      form.reset({
        nomeCompleto: "",
        perfil: "",
        matricula: "",
        cpf: "",
        funcao: "",
        status: "ativo",
        alocacao: "",
      })

      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Card className="w-full shadow-sm border border-gray-200 rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Cadastro de Trabalhadores</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="px-8 py-6 space-y-6">
            <div>
              <h3 className="font-bold text-base mb-6">Dados Pessoais</h3>

              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="font-medium">Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do colaborador" {...field} className="h-10 w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Perfil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {perfisOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de matrícula" {...field} className="h-10 w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          maxLength={14}
                          {...field}
                          className="h-10 w-full"
                          onChange={(e) => {
                            const formatted = formatarCPF(e.target.value)
                            field.onChange(formatted)
                          }}
                          onBlur={() => {
                            form.trigger("cpf")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel className="font-medium">Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Função do colaborador" {...field} className="h-10 w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <h3 className="font-bold text-base mb-6">Alocação</h3>

              {/* Combobox para seleção de alocação */}
              <FormField
                control={form.control}
                name="alocacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Alojamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Selecione um alojamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {alocacaoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-sm text-gray-500 mt-2">
                      Selecione o alojamento onde o trabalhador será alocado.
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-8 py-4 border-t">
            <Button variant="outline" type="button" onClick={() => form.reset()} className="h-10 px-4 font-medium">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-10 px-4 font-medium bg-black hover:bg-gray-800">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
