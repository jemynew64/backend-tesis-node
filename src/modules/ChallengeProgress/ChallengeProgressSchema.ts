import { z } from "zod";

// progresoReto.ts
export const ChallengeProgressSchema = z.object({
  completed: z.boolean(),
  challenge_id: z.number().min(1, "Debe referenciar un reto válido"),
  user_id: z.number().min(1, "Debe referenciar un usuario válido"),
});

export type ChallengeProgressType = z.infer<typeof ChallengeProgressSchema>;