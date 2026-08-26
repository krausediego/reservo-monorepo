/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type {
  IAvailabilitiesForm,
  IEstablishmentForm,
  IMapForm,
} from "../types";
import { createEstablishmentSchema } from "@reservo/schemas";
import { checkCepExists, UFS } from "@/helpers";

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
  readonly children: React.ReactNode;
}) {
  const establishmentForm = useForm<IEstablishmentForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.omit({
        establishmentAvailabilities: true,
        latitude: true,
        longitude: true,
      }),
    ),
    defaultValues: {
      name: "",
      phone: "",
      cnpj: "",
      description: "",
      zipCode: "",
      street: "",
      number: undefined,
      neighborhood: "",
      city: "",
      state: "",
      logo: undefined,
      cover: undefined,
    },
    mode: "onChange",
  });

  const mapForm = useForm<IMapForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.pick({
        latitude: true,
        longitude: true,
      }),
    ),
    defaultValues: {
      latitude: 0,
      longitude: 0,
    },
  });

  const availabilitiesForm = useForm<IAvailabilitiesForm>({
    resolver: zodResolver(
      createEstablishmentSchema.shape.body.pick({
        establishmentAvailabilities: true,
      }),
    ),
    defaultValues: {
      establishmentAvailabilities: [
        {
          dayOfWeek: 0,
          startMinutes: 480,
          endMinutes: 1080,
          opened: false,
        },
        {
          dayOfWeek: 1,
          startMinutes: 480,
          endMinutes: 1080,
          opened: true,
        },
        {
          dayOfWeek: 2,
          startMinutes: 480,
          endMinutes: 1080,
          opened: true,
        },
        {
          dayOfWeek: 3,
          startMinutes: 480,
          endMinutes: 1080,
          opened: true,
        },
        {
          dayOfWeek: 4,
          startMinutes: 480,
          endMinutes: 1080,
          opened: true,
        },
        {
          dayOfWeek: 5,
          startMinutes: 480,
          endMinutes: 1080,
          opened: true,
        },
        {
          dayOfWeek: 6,
          startMinutes: 480,
          endMinutes: 1080,
          opened: false,
        },
      ],
    },
  });

  const value = useMemo(() => {
    return {
      establishmentForm,
      mapForm,
      availabilitiesForm,
    };
  }, [establishmentForm, mapForm, availabilitiesForm]);

  const zipCode = value.establishmentForm.watch("zipCode");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const cep = await checkCepExists(zipCode, controller.signal);
      console.log("CEP", cep);
      if (!cep) return;

      const opts = { shouldValidate: true, shouldDirty: true } as const;
      establishmentForm.setValue("street", cep.street, opts);
      establishmentForm.setValue("neighborhood", cep.neighborhood, opts);
      establishmentForm.setValue("city", cep.city, opts);
      establishmentForm.setValue(
        "state",
        UFS.find((uf) => uf.acronym === cep.state)?.name ?? "",
        opts,
      );
    })();

    return () => controller.abort();
  }, [zipCode, establishmentForm]);

  return (
    <CreateEstablishmentProviderContext.Provider value={value}>
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
