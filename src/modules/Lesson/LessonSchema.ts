import { z } from "zod";

// leccion.ts
export const LessonSchema = z.object({
  title: z.string().max(255, "El título no debe superar los 255 caracteres"),
  order_num: z.number().min(1, "El orden debe ser un número positivo"),
  unit_id: z.number().min(1, "Debe referenciar una unidad válida"),
});

export type LessonType = z.infer<typeof LessonSchema>;