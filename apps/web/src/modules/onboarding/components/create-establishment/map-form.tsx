import { MapPicker } from "@/components/map-picker";
import { useEffect, useState } from "react";
import { useCreateEstablishment } from "../../contexts";
import { geocodeAddress } from "@/helpers";
import { useFormContext } from "react-hook-form";
import type { IMapForm } from "../../types";

export function MapForm() {
  const [coords, setCoords] = useState({ lat: -26.4759, lng: -49.0886 });
  const form = useFormContext<IMapForm>();

  const { establishmentForm } = useCreateEstablishment();

  useEffect(() => {
    (async () => {
      const result = await geocodeAddress({
        street: establishmentForm.getValues("street"),
        number: String(establishmentForm.getValues("number")),
        neighborhood: establishmentForm.getValues("neighborhood"),
        city: establishmentForm.getValues("city"),
        state: establishmentForm.getValues("state"),
        postalCode: establishmentForm.getValues("zipCode"),
      });

      if (result) {
        setCoords({ lat: result.lat, lng: result.lng });
        form.setValue("latitude", result.lat);
        form.setValue("longitude", result.lng);
      }
    })();
  }, [establishmentForm, form]);

  return (
    <MapPicker
      value={coords}
      onChange={(value) => {
        setCoords(value);
        form.setValue("latitude", value.lat);
        form.setValue("longitude", value.lng);
      }}
    />
  );
}
