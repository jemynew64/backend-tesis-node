// middlewares/authorize.ts
import { Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    console.log('🧾 Usuario decodificado:', req.user);
    console.log('🧪 Rol requerido:', roles);
    const userRole = req.user?.user_type;

    if (!roles.includes(userRole)) {
       res.status(403).json({ error: 'Access denied. permisos insuficientes' });
       return;
    }

    next();
  };
};
    