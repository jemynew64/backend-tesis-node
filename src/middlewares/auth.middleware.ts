import {  Response,NextFunction } from "express";

import { verifyToken } from "../utils/jwt";

// authenticate.ts
export const authenticate = (req: any, res: Response, next: NextFunction) => {
    // Extrae el token del header "Authorization: Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided' });
      return;
    }
  
    try {
      // Verifica si el token es válido → retorna el payload (id, email, tipo_usuario)
      const decoded = verifyToken(token);
  
      // Agrega el usuario decodificado a req.user
      req.user = decoded;
  
      // Pasa al siguiente middleware/controlador
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
  