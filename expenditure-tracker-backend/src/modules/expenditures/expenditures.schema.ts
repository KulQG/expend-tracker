import { z } from "zod";

export const createExpenditureSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Название обязательно"),
    sum: z.number().positive("Сумма должна быть положительной").min(1, "Сумма должна быть не меньше 1").max(1_000_000, "Сумма должна быть не больше 1 000 000"),
    date: z.string().datetime("Неверный формат даты (ожидается ISO 8601)"),
  }),
});

export const getExpendituresSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});

export const deleteExpenditureSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("ID должен быть положительным числом"),
  }),
});
