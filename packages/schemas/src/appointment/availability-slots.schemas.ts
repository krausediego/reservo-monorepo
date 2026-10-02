import { z } from "zod";

export const availabilitySlotsSchema = z.object({
  query: z.object({
    professionalId: z.cuid2({ error: "O ID do profissional é obrigatório" }),
    serviceId: z.cuid2({ error: "O ID do serviço é obrigatório" }),
    date: z.string({ error: "A data é obrigatória" }),
  }),
});

export const availabilitySlotsResponseSchema = z.object({
  date: z.date(),
  timezone: z.string(),
  durationMin: z.number(),
  slots: z.array(z.iso.datetime()),
});
