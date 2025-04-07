import { z } from "zod";

// logroObtenido.ts
export const EarnedAchievementSchema = z.object({
  obtained_at: z.date().default(() => new Date()),
  achievement_id: z.number().min(1, "Debe referenciar un logro válido"),
  user_id: z.number().min(1, "Debe referenciar un usuario válido"),
});

export type EarnedAchievementType = z.infer<typeof EarnedAchievementSchema>;