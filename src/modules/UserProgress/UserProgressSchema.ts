import { z } from "zod";

// progresoUsuario.ts
export const UserProgressSchema = z.object({
  active_course_id: z.number().min(1, "Debe referenciar un curso válido"),
  user_id: z.number().min(1, "Debe referenciar un usuario válido"),
});

export type UserProgressType = z.infer<typeof UserProgressSchema>;