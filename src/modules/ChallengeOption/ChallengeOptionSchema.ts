import { z } from "zod";

// opcionReto.ts
export const ChallengeOptionSchema = z.object({
  text: z.string(),
  is_correct: z.boolean(),
  image_src: z.string().optional(),
  audio_src: z.string().optional(),
  challenge_id: z.number().min(1, "Debe referenciar un reto válido"),
});

export type ChallengeOptionType = z.infer<typeof ChallengeOptionSchema>;