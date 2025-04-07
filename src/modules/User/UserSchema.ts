import { z } from "zod";

// When integrating with S3, enable URL validation for profileImage
export const UserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  profile_image: z.string().default("/default_user.png"),
  hearts: z.number().min(0).default(5),
  points: z.number().min(0).default(0),
  experience: z.number().min(0).default(0),
  level: z.number().min(1).default(1),
  user_type: z.enum(["estudiante", "profesor"]).default("estudiante"),
});

export type UserType = z.infer<typeof UserSchema>;