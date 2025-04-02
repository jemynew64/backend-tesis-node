import { z } from "zod";
export const LogroSchema = z.object({
    titulo: z.string().max(255, "El título no debe superar los 255 caracteres"),
    descripcion: z.string().max(255, "La descripción no debe superar los 255 caracteres"),
    imagen_src: z.string().max(255, "La URL de la imagen no debe superar los 255 caracteres"),
    experiencia_requerida: z.number().min(0, "La experiencia requerida no puede ser negativa"),
    nivel_requerido: z.number().min(1, "El nivel requerido debe ser al menos 1"),
  });
  export type LogroType = z.infer<typeof LogroSchema>;