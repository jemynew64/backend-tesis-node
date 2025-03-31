import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import {handleErrorResponse } from "../utils/errorHandler"

export const login = async (req:Request, res:Response) => {
  const { email, contrasena } = req.body;

  try {
    //* Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    //* Validar si existe
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //* compara contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(404).json({ error: "La contraseña esta equivocada" });
    }

    //* generar el token
    const token = generateToken({
      id: user.id,
      email: user.email,
      rolId: user.tipo_usuario,
    });

    //* Send message token
    res.json({ msg: "Login successful", token });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
