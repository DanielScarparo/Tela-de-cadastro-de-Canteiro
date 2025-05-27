"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { validarCPF, formatarCPF } from "../utils/cpf-validator";

const formSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
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
  alocacao: z.string().min(1, { message: "Selecione uma alocação" }),
});

type FormValues = z.infer<typeof formSchema>;

// Tipagem para as opções de alojamento
type AlojamentoOption = {
  value: string;
  label: string;
};

const perfisOptions = [
  { value: "colaborador", label: "Colaborador" },
  { value: "gerente", label: "Gerente" },
  { value: "motorista", label: "Motorista" },
  { value: "administrativo", label: "Administrativo" },
  { value: "supervisor", label: "Supervisor" },
];

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "afastado", label: "Afastado" },
  { value: "desligado", label: "Desligado" },
];

export default function CadastroTrabalhadores() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alocacaoOptions, setAlocacaoOptions] = useState<AlojamentoOption[]>(
    []
  );

  useEffect(() => {
    fetch("http://localhost:3300/alojamentos")
      .then((res) => res.json())
      .then((data) => {
        const opcoesFormatadas: AlojamentoOption[] = data.map((alo: any) => ({
          value: String(alo.id),
          label: `${alo.rua}, ${alo.numero} - ${alo.bairro}`,
        }));
        setAlocacaoOptions(opcoesFormatadas);
      })
      .catch((err) => console.error("Erro ao carregar alojamentos:", err));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      perfil: "",
      matricula: "",
      cpf: "",
      funcao: "",
      status: "ativo",
      alocacao: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3300/funcionarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.nomeCompleto,
          perfil: data.perfil,
          matricula: data.matricula,
          cpf: data.cpf,
          funcao: data.funcao,
          status: data.status,
          alocacao: data.alocacao, // esse é o id do alojamento
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar funcionário");

      const alocacaoSelecionada =
        alocacaoOptions.find((option) => option.value === data.alocacao)
          ?.label || "não especificada";

      toast.success(
        `Cadastro realizado com sucesso! O colaborador ${data.nomeCompleto} foi cadastrado na alocação: ${alocacaoSelecionada}`,
        { duration: 5000 }
      );

      form.reset();
    } catch (err) {
      toast.error("Erro ao cadastrar funcionário.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200 rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          Cadastro de Trabalhadores
        </CardTitle>
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
                      <Input
                        placeholder="Nome completo do colaborador"
                        {...field}
                        className="h-10 w-full"
                      />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                        <Input
                          placeholder="Número de matrícula"
                          {...field}
                          className="h-10 w-full"
                        />
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
                            const formatted = formatarCPF(e.target.value);
                            field.onChange(formatted);
                          }}
                          onBlur={() => {
                            form.trigger("cpf");
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
                      <Input
                        placeholder="Função do colaborador"
                        {...field}
                        className="h-10 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <h3 className="font-bold text-base mb-6">Alocação</h3>
              <FormField
                control={form.control}
                name="alocacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Alojamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              className="h-10 px-4 font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-4 font-medium bg-black hover:bg-gray-800"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
