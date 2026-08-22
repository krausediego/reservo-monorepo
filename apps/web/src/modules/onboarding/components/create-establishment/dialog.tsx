import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { EstablishmentForm } from "./establishment-form";
import { useState } from "react";
import { MapForm } from "./map-form";
import { useCreateEstablishment } from "../../contexts";

type Steps = {
  name: string;
  step: number;
  availableNavigate: boolean;
};

export function CreateEstablishmentDialog() {
  const [step, setStep] = useState(1);

  const { establishmentForm, mapForm } = useCreateEstablishment();

  const steps: Steps[] = [
    {
      name: "Informações",
      step: 1,
      availableNavigate: true,
    },
    {
      name: "Mapa",
      step: 2,
      availableNavigate: establishmentForm.formState.isValid,
    },
    {
      name: "Horários",
      step: 3,
      availableNavigate: mapForm.formState.isValid,
    },
  ];

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <FormProvider {...establishmentForm}>
            <EstablishmentForm />
          </FormProvider>
        );
      case 2:
        return (
          <FormProvider {...mapForm}>
            <MapForm />
          </FormProvider>
        );
      case 3:
        return <div>form 3</div>;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (step !== 3) {
      return setStep((prev) => prev + 1);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo estabelecimento</DialogTitle>
        <DialogDescription>
          Preencha as informações principais do estabelecimento
        </DialogDescription>
      </DialogHeader>

      <div className="w-full flex gap-4">
        {steps.map((stepItem) => (
          <Button
            key={stepItem.step}
            variant={stepItem.step === step ? "default" : "outline"}
            disabled={!stepItem.availableNavigate}
            className="w-full flex-1 disabled:cursor-not-allowed"
          >
            {stepItem.name}
          </Button>
        ))}
      </div>

      {renderStepForm()}

      <DialogFooter>
        <div className="w-full flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">
            Etapa {step} de 3 ·{" "}
          </p>

          <div className="space-x-2">
            {step === 1 ? (
              <DialogClose
                render={<Button variant="outline">Cancelar</Button>}
              />
            ) : (
              <Button
                onClick={() => setStep((prev) => prev - 1)}
                variant="outline"
              >
                Voltar
              </Button>
            )}
            <Button
              disabled={
                !steps.find((stepItem) => stepItem.step === step + 1)
                  ?.availableNavigate
              }
              onClick={handleSubmit}
            >
              {step !== 3 ? "Continuar" : "Criar estabelecimento"}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
}
