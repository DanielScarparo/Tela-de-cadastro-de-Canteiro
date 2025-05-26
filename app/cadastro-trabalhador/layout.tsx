import type React from "react"
export default function CadastroUsuariosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
        </div>
    )
}
