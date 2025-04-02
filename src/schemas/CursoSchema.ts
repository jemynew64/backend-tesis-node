import { z } from "zod";

// curso.ts
export const CursoSchema = z.object({
    titulo: z.string().max(255, "El título no debe superar los 255 caracteres"),
    imagen_src: z.string().max(255, "La URL de la imagen no debe superar los 255 caracteres"),
  });
  export type CursoType = z.infer<typeof CursoSchema>;