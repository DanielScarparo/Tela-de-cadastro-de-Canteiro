import { NextResponse } from "next/server"

// Simulação de dados do banco de dados
// Em um ambiente real, você buscaria esses dados do seu banco
const locaisArmazenamento = [
  { id: "1", nome: "Almoxarifado Central" },
  { id: "2", nome: "Depósito A" },
  { id: "3", nome: "Depósito B" },
  { id: "4", nome: "Estoque Principal" },
  { id: "5", nome: "Sala de Materiais" },
  { id: "6", nome: "Galpão 1" },
  { id: "7", nome: "Galpão 2" },
]

export async function GET() {
  // Simula um delay para demonstrar carregamento
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(locaisArmazenamento)
}
