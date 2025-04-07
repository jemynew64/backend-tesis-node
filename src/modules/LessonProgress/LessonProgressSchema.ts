import { z } from "zod";
//progreso_leccion 
export const LessonProgressSchema = z.object({
  user_id: z.number().min(1, "Debe referenciar un usuario válido"),
  lesson_id: z.number().min(1, "Debe referenciar una lección válida"),
  completed: z.boolean().optional(),
});

export type LessonProgressType = z.infer<typeof LessonProgressSchema>;
