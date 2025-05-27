"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LocalArmazenamento {
  id: string
  nome: string
}

interface LocalArmazenamentoComboboxProps {
  value: string
  onChange: (value: string) => void
}

export function LocalArmazenamentoCombobox({ value, onChange }: LocalArmazenamentoComboboxProps) {
  const [open, setOpen] = useState(false)
  const [locais, setLocais] = useState<LocalArmazenamento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLocais() {
      try {
        const response = await fetch("/api/locais-armazenamento")
        const data = await response.json()
        setLocais(data)
      } catch (error) {
        console.error("Erro ao buscar locais de armazenamento:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocais()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-12">
          {value ? locais.find((local) => local.id === value)?.nome || "Selecione um local" : "Selecione um local"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar local..." />
          <CommandList>
            <CommandEmpty>{isLoading ? "Carregando..." : "Nenhum local encontrado."}</CommandEmpty>
            <CommandGroup>
              {locais.map((local) => (
                <CommandItem
                  key={local.id}
                  value={local.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === local.id ? "opacity-100" : "opacity-0")} />
                  {local.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
