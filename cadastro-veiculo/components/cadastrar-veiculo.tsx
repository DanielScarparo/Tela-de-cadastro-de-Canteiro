"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function CadastrarVeiculo() {
  const [tipoVeiculo, setTipoVeiculo] = useState<string>("transporte")
  const [capacidadeLabel, setCapacidadeLabel] = useState<string>("CAPACIDADE DE PASSAGEIROS")
  const [frota, setFrota] = useState("")
  const [placa, setPlaca] = useState("")
  const [capacidade, setCapacidade] = useState("")

  useEffect(() => {
    if (tipoVeiculo === "transporte") {
      setCapacidadeLabel("CAPACIDADE DE PASSAGEIROS")
    } else {
      setCapacidadeLabel("CAPACIDADE DE CARGA")
    }
  }, [tipoVeiculo])

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3300/veiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ frota, tipo_veiculo: tipoVeiculo, placa, capacidade })
      })

      if (!response.ok) throw new Error("Erro ao cadastrar veículo")
      alert("Veículo cadastrado com sucesso!")
    } catch (error) {
      alert("Erro ao cadastrar veículo")
    }
  }

  return (
    <div className="w-full max-w-md border-4 border-[#c5f1eb] rounded-lg p-8 bg-white">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Cadastrar Veículo</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="frota">FROTA</Label>
          <Input id="frota" value={frota} onChange={(e) => setFrota(e.target.value)} placeholder="Número da frota" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoVeiculo">TIPO DE VEÍCULO</Label>
          <Select value={tipoVeiculo} onValueChange={(value) => setTipoVeiculo(value)}>
            <SelectTrigger id="tipoVeiculo">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="carga">Carga</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="placa">PLACA</Label>
          <Input id="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Placa do veículo" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacidade">{capacidadeLabel}</Label>
          <Select value={capacidade} onValueChange={setCapacidade}>
            <SelectTrigger id="capacidade">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {tipoVeiculo === "transporte" ? (
                <>
                  <SelectItem value="2">2 passageiros</SelectItem>
                  <SelectItem value="4">4 passageiros</SelectItem>
                  <SelectItem value="5">5 passageiros</SelectItem>
                  <SelectItem value="7">7 passageiros</SelectItem>
                  <SelectItem value="15">15 passageiros</SelectItem>
                  <SelectItem value="45">45 passageiros</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="500">500 kg</SelectItem>
                  <SelectItem value="1000">1000 kg</SelectItem>
                  <SelectItem value="3000">3000 kg</SelectItem>
                  <SelectItem value="5000">5000 kg</SelectItem>
                  <SelectItem value="10000">10000 kg</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSubmit}>CADASTRAR</Button>
      </div>
    </div>
  )
}
