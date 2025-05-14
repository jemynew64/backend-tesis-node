import { z } from "zod";

// 🎯 Para creación (sin id)
export const EarnedAchievementSchema = z.object({
  obtained_at: z.date().default(() => new Date()),
  achievement_id: z.number().min(1, "Debe referenciar un logro válido"),
  user_id: z.number().min(1, "Debe referenciar un usuario válido"),
});

// ✅ Tipo para creación o validación
export type EarnedAchievementFormType = z.infer<typeof EarnedAchievementSchema>;

// ✅ Tipo completo para lógica, base de datos, edición
export type EarnedAchievementType = EarnedAchievementFormType & { id: number };
