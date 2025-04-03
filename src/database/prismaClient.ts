import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
//aca importar todos los prismas
export const UserModel = prisma.usuario;
export const CursoModel = prisma.curso;
export const LeccionModel = prisma.leccion;
export const LogroModel = prisma.logro;
export const RetoModel = prisma.reto;
export const UnidadModel = prisma.unidad;
export const Logro_obtenidoModel = prisma.logro_obtenido;
export const Progreso_retoModel = prisma.progreso_reto;
export const Progreso_usuarioModel = prisma.progreso_usuario;
export const OpcionRetoModel = prisma.opcion_reto;
