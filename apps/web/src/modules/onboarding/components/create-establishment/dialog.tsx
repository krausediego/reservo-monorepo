import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useFormState } from "react-hook-form";
import { EstablishmentForm } from "./establishment-form";
import { useState } from "react";
import { MapForm } from "./map-form";
import { useCreateEstablishment } from "../../contexts";
import { AvailabilitiesForm } from "./availabilities-form";
import { useCreateEstablishmentMutation } from "../../hooks";
import { Spinner } from "@/components/ui/spinner";

type Steps = {
  name: string;
  step: number;
  availableNavigate: boolean;
};

export function CreateEstablishmentDialog() {
  const [step, setStep] = useState(1);

  const { establishmentForm, mapForm, availabilitiesForm } =
    useCreateEstablishment();
  const {
    mutateAsync: createEstablishmentFn,
    isPending: isCreateEstablishmentPending,
  } = useCreateEstablishmentMutation();

  const { isValid: isEstablishmentFormValid } = useFormState({
    control: establishmentForm.control,
  });
  const { isValid: isMapFormValid } = useFormState({
    control: mapForm.control,
  });
  const { isValid: isAvailabilitiesValid } = useFormState({
    control: availabilitiesForm.control,
  });

  const steps: Steps[] = [
    {
      name: "Informações",
      step: 1,
      availableNavigate: isEstablishmentFormValid,
    },
    {
      name: "Mapa",
      step: 2,
      availableNavigate: isEstablishmentFormValid && isMapFormValid,
    },
    {
      name: "Horários",
      step: 3,
      availableNavigate:
        isEstablishmentFormValid && isMapFormValid && isAvailabilitiesValid,
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
        return (
          <FormProvider {...availabilitiesForm}>
            <AvailabilitiesForm />
          </FormProvider>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (step !== 3) {
      return setStep((prev) => prev + 1);
    }

    await createEstablishmentFn({
      ...establishmentForm.getValues(),
      ...mapForm.getValues(),
      ...availabilitiesForm.getValues(),
    });
  };

  return (
    <DialogContent className="h-[90%] lg:min-w-2xl">
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
            onClick={() => {
              if (!stepItem.availableNavigate) {
                return;
              }

              setStep(stepItem.step);
            }}
            disabled={!stepItem.availableNavigate}
            className="w-full flex-1 disabled:cursor-not-allowed"
          >
            {stepItem.name}
          </Button>
        ))}
      </div>

      <div className="overflow-y-scroll lg:overflow-y-auto">
        {renderStepForm()}
      </div>

      <DialogFooter>
        <div className="w-full flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">
            Etapa {step} de 3 ·{" "}
          </p>

          <div className="space-x-2">
            {step === 1 ? (
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
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
                !steps.find((stepItem) => stepItem.step === step)
                  ?.availableNavigate || isCreateEstablishmentPending
              }
              onClick={handleSubmit}
            >
              {isCreateEstablishmentPending && <Spinner />}
              {step !== 3 ? "Continuar" : "Criar estabelecimento"}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
