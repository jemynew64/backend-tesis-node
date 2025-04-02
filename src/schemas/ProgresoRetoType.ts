import { z } from "zod";

// progresoReto.ts
export const ProgresoRetoSchema = z.object({
    completado: z.boolean(),
    reto_id: z.number().min(1, "Debe referenciar un reto válido"),
    usuario_id: z.number().min(1, "Debe referenciar un usuario válido"),
  });
  export type ProgresoRetoType = z.infer<typeof ProgresoRetoSchema>;