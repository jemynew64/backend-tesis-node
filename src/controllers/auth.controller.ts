import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { handleErrorResponse } from "../utils/errorHandler";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, contrasena } = req.body;

  try {
    //* Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    //* Validar si existe
    if (!user) {
      res.status(404).json({ error: "User not found" }); // ⬅️ Sin return
      return;
    }

    //* Comparar contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      res.status(404).json({ error: "La contraseña es incorrecta" }); // ⬅️ Sin return
      return;
    }

    //* Generar el token
    const token = generateToken({
      id: user.id,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
    });
    const usuario =({
      id: user.id,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
    });
    //* Enviar respuesta
    res.json({ msg: "Login successful", token ,usuario }); // ⬅️ Sin return
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
