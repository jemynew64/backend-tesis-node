import { z } from "zod";

// opcionReto.ts
export const OpcionRetoSchema = z.object({
    texto: z.string(),
    correcto: z.boolean(),
    imagen_src: z.string().optional(),
    audio_src: z.string().optional(),
    reto_id: z.number().min(1, "Debe referenciar un reto válido"),
  });
  export type OpcionRetoType = z.infer<typeof OpcionRetoSchema>;