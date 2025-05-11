import { Request, Response } from "express";
import { updateUserStatsService } from "./Stats.Service";

export const updateStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
      if (!userId) {
         res.status(401).json({ message: "No autorizado" });
         return;
      }
      //eso es lo que yo mandaria
  const statsToAdd = req.body;

  try {
    const result = await updateUserStatsService(parseInt(userId), statsToAdd);
    res.status(200).json({ message: "Estadísticas actualizadas correctamente", result });
  } catch (error) {
    console.error("Error actualizando estadísticas:", error);
    res.status(500).json({ message: "Error actualizando estadísticas", error });
  }
};
