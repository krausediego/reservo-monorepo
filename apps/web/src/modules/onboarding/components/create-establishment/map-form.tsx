import { MapPicker } from "@/components/map-picker";
import { useEffect, useState } from "react";
import { useCreateEstablishment } from "../../contexts";
import { geocodeAddress } from "@/helpers";

export function MapForm() {
  const [coords, setCoords] = useState({ lat: -26.4759, lng: -49.0886 });

  const {establishmentForm} = useCreateEstablishment();

  const handleAddressBlur = async () => {
    const result = await geocodeAddress({
      street: establishmentForm.getValues("address"),
      number: establishmentForm.getValues(""),
      neighborhood: ,
      city: ,
      state: ,
      postalCode: ,
    })
  }

  useEffect(() => {

  }, [])

  return <MapPicker value={coords} onChange={setCoords} />;
}
