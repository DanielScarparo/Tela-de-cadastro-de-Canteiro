"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LocalArmazenamentoCombobox } from "./local-armazenamento-combobox"
import { cadastrarMaterial } from "@/actions/material-actions"

const formSchema = z.object({
  nome: z.string().min(1, "Nome do material é obrigatório"),
  quantidade: z.coerce
    .number()
    .min(0, "A quantidade não pode ser negativa")
    .nonnegative("A quantidade não pode ser negativa"),
  localArmazenamento: z.string().min(1, "Local de armazenamento é obrigatório"),
})

type FormValues = z.infer<typeof formSchema>

export function CadastroMateriais() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      quantidade: 0,
      localArmazenamento: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await cadastrarMaterial(data)
      form.reset()
    } catch (error) {
      console.error("Erro ao cadastrar material:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="pt-6">
        <h1 className="text-3xl font-bold mb-6">Cadastro de materiais</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-medium">Nome do material</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-medium">Quantidade disponível</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      onKeyDown={(e) => {
                        // Impede a digitação de números negativos
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault()
                        }
                      }}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localArmazenamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-medium">Local de armazenamento</FormLabel>
                  <FormControl>
                    <LocalArmazenamentoCombobox value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Material"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
