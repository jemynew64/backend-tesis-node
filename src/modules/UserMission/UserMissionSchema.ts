import { z } from "zod";

// mision_usuario.ts
export const UserMissionSchema = z.object({
  user_id: z.number().int(),
  mission_id: z.number().int(),
  completed: z.boolean().optional(),
  completed_at: z.date().optional(),
});

export type UserMissionType = z.infer<typeof UserMissionSchema>;