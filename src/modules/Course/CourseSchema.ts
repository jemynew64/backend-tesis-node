import { z } from "zod";

// curso.ts
export const CourseSchema = z.object({
  title: z.string().max(255, "El título no debe superar los 255 caracteres"),
  image_src: z.string().max(255, "La URL de la imagen no debe superar los 255 caracteres"),
});

export type CourseType = z.infer<typeof CourseSchema>;