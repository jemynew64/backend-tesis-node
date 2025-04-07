import { z } from "zod";

// mision.ts
export const MissionSchema = z.object({
  title: z.string().max(255, "El título no debe superar los 255 caracteres"),
  description: z.string().nonempty("La descripción es obligatoria"),
  granted_experience: z.number().int().min(0, "La experiencia no puede ser negativa"),
});

export type MissionType = z.infer<typeof MissionSchema>;
