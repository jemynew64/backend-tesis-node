import { z } from "zod";

// leccion.ts
export const LeccionSchema = z.object({
    titulo: z.string().max(255, "El título no debe superar los 255 caracteres"),
    orden: z.number().min(1, "El orden debe ser un número positivo"),
    unidad_id: z.number().min(1, "Debe referenciar una unidad válida"),
  });
  export type LeccionType = z.infer<typeof LeccionSchema>;