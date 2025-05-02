
import React from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoStepProps {
  register: any;
  errors: any;
  nextStep: () => void;
}

const CustomerInfoStep = ({ register, errors, nextStep }: CustomerInfoStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informações do Cliente</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input 
            id="name"
            {...register("name", { required: "Nome é obrigatório" })} 
            placeholder="Seu nome completo"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email" 
            {...register("email", { 
              required: "Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            })}
            placeholder="seu@email.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone"
            type="tel" 
            {...register("phone", { required: "Telefone é obrigatório" })}
            placeholder="Seu número de telefone"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input 
            id="address"
            {...register("address", { required: "Endereço é obrigatório" })}
            placeholder="Seu endereço completo"
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="button" onClick={nextStep} className="w-full">
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default CustomerInfoStep;
