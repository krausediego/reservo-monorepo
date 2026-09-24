import z from "zod";

export const eventSchema = z
  .object({
    user: z.string(),
    title: z.string().min(1, { error: "O título é obrigatório" }),
    description: z.string().min(1, { error: "A descrição é obrigatória" }),
    startDate: z.date({ error: "A data de inicio é obrigatória" }),
    startTime: z.object(
      {
        hour: z.number(),
        minute: z.number(),
      },
      { error: "O horário de inicio é obrigatório" },
    ),
    endDate: z.date({ error: "A data de fim é obrigatória" }),
    endTime: z.object(
      {
        hour: z.number(),
        minute: z.number(),
      },
      { error: "O horário de fim é obrigatório" },
    ),
    color: z.enum(
      ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
      { error: "A cor é obrigatória" },
    ),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0);

      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0);

      return startDateTime < endDateTime;
    },
    {
      error: "A data de inicio não pode ser anterior a data de fim",
      path: ["startDate"],
    },
  );

export type EventFormData = z.infer<typeof eventSchema>;
