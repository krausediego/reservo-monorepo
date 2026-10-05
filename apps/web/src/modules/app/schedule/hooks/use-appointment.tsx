/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { Customer } from "../components/dialogs/create-appointment-dialog";
import type { UseFormReturn } from "react-hook-form";
import type { ICreateManualAppointmentSchema } from "@reservo/types";
import type { AsyncComboboxValue } from "@/components/ui/async-combobox";
import { useListCustomersQuery } from "../../customers/hooks";
import { useListProfessionalsQuery } from "../../professionals/hooks";
import { useListServicesQuery } from "../../services/hooks";
import { useAvailabilitySlots } from "./use-availability-slots-query";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface UseAppointmentProps {
  form: UseFormReturn<
    ICreateManualAppointmentSchema.GetInput,
    any,
    ICreateManualAppointmentSchema.GetInput
  >;
}

export function useAppointment({ form }: UseAppointmentProps) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const customer = form.watch("customer");
  const isNew = customer.type === "new";
  const comboboxValue: AsyncComboboxValue<Customer> | null =
    customer.type === "existing"
      ? selectedCustomer && { type: "existing", item: selectedCustomer }
      : customer.name
        ? { type: "new", name: customer.name }
        : null;

  const {
    data: customers,
    isFetching: isCustomersFetching,
    isError: isCustomersError,
    refetch: customersRefetch,
  } = useListCustomersQuery(
    {
      page: 1,
      limit: 100,
      name: search,
      orderBy: "asc",
    },
    {
      gcTime: 0,
      refetchOnMount: true,
    },
  );

  const { data: professionals } = useListProfessionalsQuery({
    page: 1,
    limit: 100,
    orderBy: "asc",
  });

  const professionalId = form.watch("professionalId");
  const serviceId = form.watch("serviceId");

  const { data: services } = useListServicesQuery(
    {
      page: 1,
      limit: 100,
      professionals: [professionalId],
      orderBy: "asc",
    },
    {
      enabled: !!professionalId,
    },
  );

  const { data: availabilitySlots } = useAvailabilitySlots(
    {
      professionalId,
      serviceId,
      date: format(selectedDate, "yyyy-MM-dd"),
    },
    {
      gcTime: 0,
      enabled: !!professionalId && !!serviceId,
    },
  );

  const slots =
    availabilitySlots &&
    (availabilitySlots?.slots ?? []).map((iso) => ({
      iso,
      label: formatInTimeZone(iso, availabilitySlots.timezone, "HH:mm"),
      period:
        Number(formatInTimeZone(iso, availabilitySlots.timezone, "H")) < 12
          ? "manha"
          : "tarde",
    }));

  return {
    setSearch,
    setSelectedCustomer,
    setSelectedDate,
    selectedDate,
    isNew,
    comboboxValue,
    customers,
    isCustomersFetching,
    isCustomersError,
    customersRefetch,
    professionals,
    services,
    slots,
    professionalId,
  };
}
