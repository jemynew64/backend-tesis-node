import { Request, Response } from "express";
import { updateUserStatsService } from "./Stats.Service";

export const updateStatsController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    console.warn("🔒 Usuario no autorizado al intentar enviar stats");
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  const statsToAdd = req.body;
  console.log("📥 Stats recibidas en controller:", statsToAdd);
  console.log("👤 ID de usuario:", userId);

  try {
    const result = await updateUserStatsService(parseInt(userId), statsToAdd);
    console.log("✅ Stats procesadas correctamente:", result);
    res.status(200).json({ message: "Estadísticas actualizadas correctamente", result });
  } catch (error) {
    console.error("❌ Error actualizando estadísticas:", error);
    res.status(500).json({ message: "Error actualizando estadísticas", error });
  }
};
