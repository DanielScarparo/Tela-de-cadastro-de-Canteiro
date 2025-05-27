"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface FormData {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  residents: string;
}

export default function RepublicRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    postalCode: "",
    residents: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResidentsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, residents: value }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5, 8);
    }
    setFormData((prev) => ({ ...prev, postalCode: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "street",
      "number",
      "neighborhood",
      "city",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData].trim()
    );

    if (missingFields.length > 0) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(formData.postalCode.trim())) {
      toast.error("CEP inválido", {
        description: "Por favor, insira um CEP válido no formato 00000-000.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3300/alojamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar");
      }

      toast.success("Sucesso", {
        description: "República cadastrada com sucesso!",
      });

      // ✅ Exibe alerta e limpa todos os campos
      alert("República cadastrada com sucesso!");
      setFormData({
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        postalCode: "",
        residents: "",
      });
    } catch (error) {
      toast.error("Erro", {
        description: "Ocorreu um erro ao cadastrar a república.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Cadastro da República
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="00000-000"
                value={formData.postalCode}
                onChange={handleCepChange}
                maxLength={9}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                name="street"
                placeholder="Rua/Avenida"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                placeholder="Número do alojamento"
                value={formData.number}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                placeholder="Bairro"
                value={formData.neighborhood}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                placeholder="Cidade"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residents">Quantidade de moradores</Label>
              <Select
                value={formData.residents}
                onValueChange={handleResidentsChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-xl py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
