// src/modules/Stats/Stats.schema.ts
import { z } from "zod";

// Lista combinada de posibles campos válidos
export const StatsSchema = z.object({
  lessons_completed: z.number().int().min(0).optional(),
  lessons_perfect: z.number().int().min(0).optional(),
  challenges_completed: z.number().int().min(0).optional(),
  correct_answers: z.number().int().min(0).optional(),
  wrong_answers: z.number().int().min(0).optional(),
  experience_gained: z.number().int().min(0).optional(),
  points_gained: z.number().int().min(0).optional(),
  time_spent_minutes: z.number().int().min(0).optional(),
  total_lessons: z.number().int().min(0).optional(),
  total_lessons_perfect: z.number().int().min(0).optional(),
  total_challenges: z.number().int().min(0).optional(),
  total_correct_answers: z.number().int().min(0).optional(),
  total_wrong_answers: z.number().int().min(0).optional(),
  total_units_completed: z.number().int().min(0).optional(),
  total_missions: z.number().int().min(0).optional(),
  total_points: z.number().int().min(0).optional(),
  total_experience: z.number().int().min(0).optional(),
  quizzes_completed: z.number().int().min(0).optional(),
});

export type StatsInput = z.infer<typeof StatsSchema>;

