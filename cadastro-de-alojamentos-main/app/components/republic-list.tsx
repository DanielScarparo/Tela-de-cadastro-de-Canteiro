"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PencilIcon, SearchIcon, PlusIcon } from "lucide-react"
import RepublicRegistrationForm from "./republic-registration-form"

interface Republic {
    id: string
    street: string
    number: string
    neighborhood: string
    city: string
    postalCode: string
    residents: number
    lastUpdated: string
}

export default function RepublicList() {
    const [searchTerm, setSearchTerm] = useState("")

    // Mock data
    const [republics, setRepublics] = useState<Republic[]>([
        {
            id: "1",
            street: "Rua das Flores",
            number: "123",
            neighborhood: "Centro",
            city: "São Paulo",
            postalCode: "01001-000",
            residents: 5,
            lastUpdated: "2023-05-15",
        },
        {
            id: "2",
            street: "Av. Principal",
            number: "456",
            neighborhood: "Jardins",
            city: "Rio de Janeiro",
            postalCode: "22021-001",
            residents: 3,
            lastUpdated: "2023-06-20",
        },
        {
            id: "3",
            street: "Rua dos Estudantes",
            number: "789",
            neighborhood: "Vila Universitária",
            city: "Belo Horizonte",
            postalCode: "30310-000",
            residents: 4,
            lastUpdated: "2023-07-10",
        },
    ])

    const filteredRepublics = republics.filter((republic) =>
        `${republic.street} ${republic.number} ${republic.neighborhood} ${republic.city}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Repúblicas Cadastradas</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nova República
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Cadastro da República</DialogTitle>
                        </DialogHeader>
                        <RepublicRegistrationForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Buscar por endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rua</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Bairro</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>CEP</TableHead>
                        <TableHead className="text-center">Moradores</TableHead>
                        <TableHead className="w-[100px] text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredRepublics.length > 0 ? (
                        filteredRepublics.map((republic) => (
                            <TableRow key={republic.id}>
                                <TableCell className="font-medium">{republic.street}</TableCell>
                                <TableCell>{republic.number}</TableCell>
                                <TableCell>{republic.neighborhood}</TableCell>
                                <TableCell>{republic.city}</TableCell>
                                <TableCell>{republic.postalCode}</TableCell>
                                <TableCell className="text-center">{republic.residents}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Editar República</DialogTitle>
                                                </DialogHeader>
                                                <RepublicRegistrationForm />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                Nenhuma república encontrada
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
