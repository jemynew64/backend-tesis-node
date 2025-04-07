import { z } from "zod";

// unidad.ts
export const UnitSchema = z.object({
  title: z.string().max(255, "El título no debe superar los 255 caracteres"),
  description: z.string(),
  order_num: z.number().min(1, "El orden debe ser un número positivo"),
  course_id: z.number().min(1, "Debe referenciar un curso válido"),
});

export type UnitType = z.infer<typeof UnitSchema>;