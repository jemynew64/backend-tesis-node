import { z } from "zod";

// reto.ts
export const ChallengeSchema = z.object({
  type: z.string().max(20, "El tipo de reto no debe superar los 20 caracteres"),
  question: z.string(),
  order_num: z.number().min(1, "El orden debe ser un número positivo"),
  lesson_id: z.number().min(1, "Debe referenciar una lección válida"),
  image_src: z.string().optional(),
});

export type ChallengeType = z.infer<typeof ChallengeSchema>;