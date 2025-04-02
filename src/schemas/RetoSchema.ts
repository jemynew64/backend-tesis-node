import { z } from "zod";

// reto.ts
export const RetoSchema = z.object({
    tipo: z.string().max(20, "El tipo de reto no debe superar los 20 caracteres"),
    pregunta: z.string(),
    orden: z.number().min(1, "El orden debe ser un número positivo"),
    leccion_id: z.number().min(1, "Debe referenciar una lección válida"),
  });
  export type RetoType = z.infer<typeof RetoSchema>;