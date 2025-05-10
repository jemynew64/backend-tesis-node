import { z } from "zod";
//mision
export const MissionSchema = z.object({
  title: z
    .string()
    .max(255, "El título no debe superar los 255 caracteres"),

  description: z
    .string()
    .nonempty("La descripción es obligatoria"),

  granted_experience: z
    .number()
    .int()
    .min(0, "La experiencia no puede ser negativa"),

  stat_key: z
    .string()
    .max(50, "El campo 'stat_key' no debe superar los 50 caracteres")
    .nonempty("El campo 'stat_key' es obligatorio"),

  stat_condition: z
    .enum(["gte", "lte", "eq", "gt", "lt"], {
      message: "La condición debe ser una de: gte, lte, eq, gt, lt"
    }),

  stat_value: z
    .number()
    .int()
    .min(0, "El valor de comparación debe ser mayor o igual a 0"),
});


export type MissionType = z.infer<typeof MissionSchema>;
