import { z } from "zod";

// logroObtenido.ts
export const LogroObtenidoSchema = z.object({
    fecha_obtencion: z.date().default(() => new Date()),
    logro_id: z.number().min(1, "Debe referenciar un logro válido"),
    usuario_id: z.number().min(1, "Debe referenciar un usuario válido"),
  });
  export type LogroObtenidoType = z.infer<typeof LogroObtenidoSchema>;