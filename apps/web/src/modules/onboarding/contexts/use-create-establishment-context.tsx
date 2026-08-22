/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type {
  IAvailabilitiesForm,
  IEstablishmentForm,
  IMapForm,
} from "../types";
import { createEstablishmentSchema } from "@reservo/schemas";

type CreateEstablishmentProviderState = {
  establishmentForm: UseFormReturn<IEstablishmentForm, any, IEstablishmentForm>;
  mapForm: UseFormReturn<IMapForm, any, IMapForm>;
  availabilitiesForm: UseFormReturn<
    IAvailabilitiesForm,
    any,
    IAvailabilitiesForm
  >;
};

const CreateEstablishmentProviderContext =
  createContext<CreateEstablishmentProviderState>(
    {} as CreateEstablishmentProviderState,
  );

function CreateEstablishmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const establishmentForm = useForm<IEstablishmentForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.omit({
        establishmentAvailabilities: true,
        latitude: true,
        longitude: true,
      }),
    ),
    mode: "onChange",
  });

  const mapForm = useForm<IMapForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.pick({
        latitude: true,
        longitude: true,
      }),
    ),
  });

  const availabilitiesForm = useForm<IAvailabilitiesForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.pick({
        establishmentAvailabilities: true,
      }),
    ),
  });

  return (
    <CreateEstablishmentProviderContext.Provider
      value={{ establishmentForm, mapForm, availabilitiesForm }}
    >
      {children}
    </CreateEstablishmentProviderContext.Provider>
  );
}

const useCreateEstablishment = () => {
  const context = useContext(CreateEstablishmentProviderContext);

  if (context === undefined) {
    throw new Error(
      "useCreateEstablishment must be user within a CreateEstablishmentProvider",
    );
  }

  return context;
};

export { useCreateEstablishment, CreateEstablishmentProvider };
