import { z } from "zod";

export const AchievementSchema = z.object({
  title: z
    .string()
    .max(255, "El título no debe superar los 255 caracteres"),

  description: z
    .string()
    .max(255, "La descripción no debe superar los 255 caracteres"),

  image_src: z
    .string()
    .max(255, "La URL de la imagen no debe superar los 255 caracteres"),

  stat_key: z
    .string()
    .max(50, "El campo evaluado no debe superar los 50 caracteres")
    .nonempty("El campo evaluado es obligatorio"),

  stat_condition: z
    .enum(["gte", "lte", "eq", "gt", "lt"], {
      message: "La condición debe ser una de: gte, lte, eq, gt, lt"
    }),

  stat_value: z
    .number()
    .int()
    .min(0, "El valor mínimo debe ser 0"),
});

export type AchievementType = z.infer<typeof AchievementSchema>;
