import { Request, Response } from "express";
import { handleErrorResponse } from "../../utils/errorHandler";
import {
  comparePassword,
  findUserByEmail,
  generateDailyMissionsIfNeeded,
  generateUserToken,
  asignarMisionesDelDiaAlUsuario
} from "./auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("🔵 [Login] Petición recibida");

  try {
    const { email, password } = req.body;
    console.log("📦 Body recibido:", req.body);

    if (!email || !password) {
      console.warn("⚠️ Faltan credenciales");
      res.status(400).json({ error: "Email y contraseña son requeridos" });
      return;
    }

    const user = await findUserByEmail(email);

    if (!user) {
      console.warn(`❌ Usuario no encontrado: ${email}`);
      res.status(404).json({ error: "Credenciales inválidas" });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.warn("❌ Contraseña incorrecta");
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    await generateDailyMissionsIfNeeded();
    await asignarMisionesDelDiaAlUsuario(user.id);

    const token = generateUserToken(user);

    console.log("✅ Login exitoso para:", email);
    res.json({
      msg: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("🔥 Error en controlador login:", error);
    handleErrorResponse(res, error);
  } finally {
    console.log("🟢 [Login] Fin de procesamiento\n");
  }
};
