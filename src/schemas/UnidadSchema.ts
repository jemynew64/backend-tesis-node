import { z } from "zod";

// unidad.ts
export const UnidadSchema = z.object({
    titulo: z.string().max(255, "El título no debe superar los 255 caracteres"),
    descripcion: z.string(),
    orden: z.number().min(1, "El orden debe ser un número positivo"),
    curso_id: z.number().min(1, "Debe referenciar un curso válido"),
  });
  export type UnidadType = z.infer<typeof UnidadSchema>;