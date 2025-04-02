import { z } from "zod";

// progresoUsuario.ts
export const ProgresoUsuarioSchema = z.object({
    curso_activo_id: z.number().min(1, "Debe referenciar un curso válido"),
    usuario_id: z.number().min(1, "Debe referenciar un usuario válido"),
  });
  export type ProgresoUsuarioType = z.infer<typeof ProgresoUsuarioSchema>;