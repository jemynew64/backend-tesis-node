import { z } from "zod";

// mision_usuario.ts
export const MisionUsuarioSchema = z.object({
    usuario_id: z.number().int(),
    mision_id: z.number().int(),
    completado: z.boolean().optional(),
    fecha_completado: z.date().optional(),
  });
  export type MisionUsuarioType = z.infer<typeof MisionUsuarioSchema>;