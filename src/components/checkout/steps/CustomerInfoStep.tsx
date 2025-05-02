
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface CustomerInfoStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  nextStep: () => void;
}

const CustomerInfoStep = ({
  register,
  errors,
  nextStep,
}: CustomerInfoStepProps) => {
  return (
    <>
      <CardTitle className="mb-4">Informações do Cliente</CardTitle>
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome completo
            </label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              {...register("name", { required: "Nome é obrigatório" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Seu e-mail"
              {...register("email", {
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Endereço de e-mail inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              placeholder="Seu telefone"
              {...register("phone", { required: "Telefone é obrigatório" })}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Endereço
            </label>
            <Input
              id="address"
              placeholder="Seu endereço completo"
              {...register("address", { required: "Endereço é obrigatório" })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message as string}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={nextStep}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomerInfoStep;
