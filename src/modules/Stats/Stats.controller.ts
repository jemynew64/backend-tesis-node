import { Request, Response } from "express";
import { updateUserStatsService,getUserStatsService,getUserStatsDiarioService,getAllUserDailyStatsService } from "./Stats.Service";

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

export const getStatsController = async (req: Request, res: Response) => {
  //solo lo modifique para hacer que el admin pueda mandar
  const indicatedId = req.query.usuarioindicadoid as string | undefined;
  const userIdFromToken = (req as any).user?.id;

  // Determinar qué ID usar
  const finalUserId = indicatedId && indicatedId.trim() !== "" ? parseInt(indicatedId) : userIdFromToken;

  if (!finalUserId) {
     res.status(401).json({ message: "No autorizado" });
     return;
  }

  try {
    const stats = await getUserStatsService(parseInt(finalUserId));
    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas generales:", error);
    res.status(500).json({ message: "Error obteniendo estadísticas", error });
  }
};


export const getStatsdiaryController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
     res.status(401).json({ message: "No autorizado" });
     return;
  }

  try {
    const stats = await getUserStatsDiarioService(parseInt(userId));
    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas diarias:", error);
    res.status(500).json({ message: "Error obteniendo estadísticas", error });
  }
};

export const getStatstotaldiaryController = async (req: Request, res: Response) => {
  const indicatedId = req.query.usuarioindicadoid as string | undefined;
  const userIdFromToken = (req as any).user?.id;

  const finalUserId = indicatedId && indicatedId.trim() !== "" ? parseInt(indicatedId) : userIdFromToken;

  if (!finalUserId || isNaN(finalUserId)) {
     res.status(401).json({ message: "No autorizado" });
     return;
  }

  try {
    const stats = await getAllUserDailyStatsService(finalUserId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas diarias:", error);
    res.status(500).json({ message: "Error obteniendo estadísticas", error });
  }
};
