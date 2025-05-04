import { Request, Response } from "express";
import { prisma } from "../../database/prismaClient";
import { generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { handleErrorResponse } from "../../utils/errorHandler";

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 [Login] Petición recibida'); // Log de entrada
  
  try {
  // Paso 1: Llega la solicitud con email y password
  console.log('📦 Body recibido:', req.body);
    const { email, password } = req.body;
  // Paso 2: Validar que vengan ambos campos
    if (!email || !password) {
      console.warn('⚠️ Faltan credenciales');
      res.status(400).json({ error: "Email y contraseña son requeridos" });
      return;
    }

  // Paso 3: Buscar usuario en la base de datos por email
  console.log(`🔍 Buscando usuario: ${email}`);
    const user = await prisma.user_account.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`❌ Usuario no encontrado: ${email}`);
      res.status(404).json({ error: "Credenciales inválidas" }); // Mensaje genérico por seguridad
      return;
    }

  // Paso 4: Comparar contraseña hasheada con la que viene del usuario
  console.log('🔐 Comparando contraseña...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.warn('❌ Contraseña incorrecta');
      res.status(401).json({ error: "Credenciales inválidas" }); // Mismo mensaje que usuario no encontrado
      return;
    }

  // Paso 5: Crear un token JWT con los datos del usuario (incluye tipo_usuario)
  console.log('🛠️ Generando token...');
    const tokenPayload = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    };
    const token = generateToken(tokenPayload);
  // Paso 6: Devolver token + datos del usuario al frontend
    console.log('✅ Login exitoso para:', email);
    res.json({ 
      msg: "Login successful", 
      token,
      user 
    });

  } catch (error) {
    console.error('🔥 Error en controlador login:', error);
    handleErrorResponse(res, error);
  } finally {
    console.log('🟢 [Login] Fin de procesamiento\n');
  }
};