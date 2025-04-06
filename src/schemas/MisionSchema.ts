import { z } from "zod";

// mision.ts
export const MisionSchema = z.object({
  titulo: z.string().max(255, "El título no debe superar los 255 caracteres"),
  descripcion: z.string().nonempty("La descripción es obligatoria"),
  experiencia_otorgada: z.number().int().min(0, "La experiencia no puede ser negativa"),
});
export type MisionType = z.infer<typeof MisionSchema>;
