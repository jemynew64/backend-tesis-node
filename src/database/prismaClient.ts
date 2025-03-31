import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
//aca importar todos los prismas
export const UserModel = prisma.usuario;
export const CursoModel = prisma.curso;
export const LeccionModel = prisma.leccion;
