"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, User, Plus, Edit, Trash2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Canteiro {
  id: string
  codigo: string
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  responsavel: string
  status: "ativo" | "inativo"
  dataCadastro: string
}

const estadosBrasil = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function CadestroCanteiros() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canteiros, setCanteiros] = useState<Canteiro[]>([])
  const [formData, setFormData] = useState<Omit<Canteiro, "id" | "dataCadastro">>({
    codigo: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    responsavel: "",
    status: "ativo",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")


   useEffect(() => {
    fetch("http://localhost:3300/canteiros")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCanteiros(data)
        } else {
          console.error("Resposta inesperada do backend:", data)
          setCanteiros([])
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar canteiros:", err)
        toast({
          title: "Erro ao carregar canteiros",
          description: "Não foi possível conectar com o servidor.",
          variant: "destructive",
        })
      })
  }, [])


  const resetForm = () => {
    setFormData({
      codigo: "",
      endereco: {
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
      responsavel: "",
      status: "ativo",
    })
    setEditingId(null)
  }

  const validateForm = () => {
    if (!formData.codigo.trim()) {
      toast({
        title: "Erro de validação",
        description: "Código do canteiro é obrigatório",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.cep.trim()) {
      toast({
        title: "Erro de validação",
        description: "CEP é obrigatório",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.rua.trim()) {
      toast({
        title: "Erro de validação",
        description: "Rua é obrigatória",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.numero.trim()) {
      toast({
        title: "Erro de validação",
        description: "Número é obrigatório",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.bairro.trim()) {
      toast({
        title: "Erro de validação",
        description: "Bairro é obrigatório",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.cidade.trim()) {
      toast({
        title: "Erro de validação",
        description: "Cidade é obrigatória",
        variant: "destructive",
      })
      return false
    }

    if (!formData.endereco.estado.trim()) {
      toast({
        title: "Erro de validação",
        description: "Estado é obrigatório",
        variant: "destructive",
      })
      return false
    }

    if (!formData.responsavel.trim()) {
      toast({
        title: "Erro de validação",
        description: "Responsável é obrigatório",
        variant: "destructive",
      })
      return false
    }

    // Verificar se o código já existe (exceto quando editando)
    const codigoExiste = canteiros.some((canteiro) => canteiro.codigo === formData.codigo && canteiro.id !== editingId)

    if (codigoExiste) {
      toast({
        title: "Erro de validação",
        description: "Código do canteiro já existe",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:3300/canteiros", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Erro ao salvar canteiro")
      const novoCanteiro = await response.json()
      setCanteiros((prev) => editingId ? prev.map((c) => (c.id === editingId ? novoCanteiro : c)) : [...prev, novoCanteiro])
      toast({ title: "Sucesso", description: editingId ? "Canteiro atualizado com sucesso!" : "Canteiro criado com sucesso!" })

      window.alert(editingId ? "Canteiro atualizado com sucesso!" : "Canteiro cadastrado com sucesso!")

      resetForm()
    } catch (error) {
      console.error(error)
      toast({ title: "Erro", description: "Erro ao salvar canteiro", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (canteiro: Canteiro) => {
    const { id, dataCadastro, ...data } = canteiro
    setFormData(data)
    setEditingId(canteiro.id)
  }

  const handleDelete = (id: string) => {
    setCanteiros((prev) => prev.filter((c) => c.id !== id))
    toast({
      title: "Sucesso",
      description: "Canteiro removido com sucesso!",
    })
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.length <= 5 ? numbers : `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const filteredCanteiros = canteiros.filter((canteiro) =>
  canteiro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
  canteiro.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
  canteiro.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
)


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Sistema de Gestão de Canteiros
          </h1>
          <p className="text-gray-600 mt-2">Gerencie todos os canteiros de obra da sua empresa</p>
        </div>

        <Tabs defaultValue="cadastro" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cadastro" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Cadastro de Canteiro
            </TabsTrigger>
            <TabsTrigger value="listagem" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Canteiros Cadastrados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {editingId ? "Editar Canteiro" : "Cadastro de Canteiro"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código do Canteiro *</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value }))}
                        placeholder="Ex: CNT001"
                        className="uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável pelo Canteiro *</Label>
                      <Input
                        id="responsavel"
                        value={formData.responsavel}
                        onChange={(e) => setFormData((prev) => ({ ...prev, responsavel: e.target.value }))}
                        placeholder="Nome do responsável"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          value={formData.endereco.cep}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, cep: formatCEP(e.target.value) },
                            }))
                          }
                          placeholder="00000-000"
                          maxLength={9}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua">Rua *</Label>
                        <Input
                          id="rua"
                          value={formData.endereco.rua}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, rua: e.target.value },
                            }))
                          }
                          placeholder="Nome da rua"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          value={formData.endereco.numero}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, numero: e.target.value },
                            }))
                          }
                          placeholder="123"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          value={formData.endereco.complemento}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, complemento: e.target.value },
                            }))
                          }
                          placeholder="Sala, andar, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          value={formData.endereco.bairro}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, bairro: e.target.value },
                            }))
                          }
                          placeholder="Nome do bairro"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          value={formData.endereco.cidade}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, cidade: e.target.value },
                            }))
                          }
                          placeholder="Nome da cidade"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                          value={formData.endereco.estado}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              endereco: { ...prev.endereco, estado: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estadosBrasil.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1">
                      {editingId ? "Atualizar Canteiro" : "Salvar Canteiro"}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listagem">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Canteiros Cadastrados ({filteredCanteiros.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por código, cidade ou responsável..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-80"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCanteiros.map((canteiro) => (
                        <TableRow key={canteiro.id}>
                          <TableCell className="font-medium">{canteiro.codigo}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {canteiro.endereco.rua}, {canteiro.endereco.numero}
                              </div>
                              <div className="text-gray-500">
                                {canteiro.endereco.bairro}, {canteiro.endereco.cidade} - {canteiro.endereco.estado}
                              </div>
                              <div className="text-gray-500">CEP: {canteiro.endereco.cep}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {canteiro.responsavel}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={canteiro.status === "ativo" ? "default" : "secondary"}>
                              {canteiro.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(canteiro.dataCadastro).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(canteiro)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(canteiro.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredCanteiros.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            {searchTerm
                              ? "Nenhum canteiro encontrado com os critérios de busca."
                              : "Nenhum canteiro cadastrado ainda."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
