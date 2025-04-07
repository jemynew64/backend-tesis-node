import { z } from "zod";
//logro.ts
export const AchievementSchema = z.object({
  title: z.string().max(255, "El título no debe superar los 255 caracteres"),
  description: z.string().max(255, "La descripción no debe superar los 255 caracteres"),
  image_src: z.string().max(255, "La URL de la imagen no debe superar los 255 caracteres"),
  required_experience: z.number().min(0, "La experiencia requerida no puede ser negativa"),
  required_level: z.number().min(1, "El nivel requerido debe ser al menos 1"),
});

export type AchievementType = z.infer<typeof AchievementSchema>;