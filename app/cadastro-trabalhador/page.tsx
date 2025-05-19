import type { Metadata } from "next"
import CadastroTrabalhadores from "./components/CadastroTrabalhadores"

export const metadata: Metadata = {
  title: "Cadastro de Usuários",
  description: "Cadastro e gerenciamento de usuários do sistema",
}

export default function CadastroUsuariosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4">
        <CadastroTrabalhadores />
      </div>
    </div>
  )
}
