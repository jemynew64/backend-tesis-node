// progresoLeccion.ts
import { z } from "zod";

export const ProgresoLeccionSchema = z.object({
  usuario_id: z.number().min(1, "Debe referenciar un usuario válido"),
  leccion_id: z.number().min(1, "Debe referenciar una lección válida"),
  completado: z.boolean().optional(), // opcional porque puede ser por defecto false
});

export type ProgresoLeccionType = z.infer<typeof ProgresoLeccionSchema>;
