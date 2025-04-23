import { Request, Response } from "express";
import { prisma } from "../../database/prismaClient";
import { generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { handleErrorResponse } from "../../utils/errorHandler";

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 [Login] Petición recibida'); // Log de entrada
  
  try {
    // 1. Verificar body recibido
    console.log('📦 Body recibido:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn('⚠️ Faltan credenciales');
      res.status(400).json({ error: "Email y contraseña son requeridos" });
      return;
    }

    // 2. Buscar usuario
    console.log(`🔍 Buscando usuario: ${email}`);
    const user = await prisma.user_account.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`❌ Usuario no encontrado: ${email}`);
      res.status(404).json({ error: "Credenciales inválidas" }); // Mensaje genérico por seguridad
      return;
    }

    // 3. Comparar contraseña
    console.log('🔐 Comparando contraseña...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.warn('❌ Contraseña incorrecta');
      res.status(401).json({ error: "Credenciales inválidas" }); // Mismo mensaje que usuario no encontrado
      return;
    }

    // 4. Generar token
    console.log('🛠️ Generando token...');
    const tokenPayload = {
      id: user.id,
      email: user.email,
      tipo_usuario: user.user_type,
    };
    
    const token = generateToken(tokenPayload);
    // const usuario = {
    //   id: user.id,
    //   email: user.email,
    //   tipo_usuario: user.user_type,
    // };

    // 5. Respuesta exitosa
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