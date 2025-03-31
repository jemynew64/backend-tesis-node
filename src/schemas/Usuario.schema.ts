import { z } from "zod";
//cuanto hagas con la coneccion con s3 habilitas los del url en imagen_perfil
export const UsuarioSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  imagen_perfil: z.string().default("/default_user.png"),
  corazones: z.number().min(0).default(0),
  puntos: z.number().min(0).default(0),
  experiencia: z.number().min(0).default(0),
  nivel: z.number().min(1).default(1),
  tipo_usuario: z.enum(["estudiante", "profesor"]).default("estudiante"),
});

export type UsuarioType = z.infer<typeof UsuarioSchema>;

