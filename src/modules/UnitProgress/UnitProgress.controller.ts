import { Request, Response } from "express";
import { updateCompletedUnitsByUser } from "./UnitProgress.service"; // ajusta el path según tu estructura

export const updateUnitsProgressController = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const userId = (req as any).user?.id;
    if (!courseId || !userId) {
       res.status(400).json({ message: "Faltan parámetros: courseId o userId" });
       return;
    }

    await updateCompletedUnitsByUser(courseId, userId);

     res.status(200).json({ message: "Progreso de unidades actualizado correctamente" });
    return;
  } catch (error) {
    console.error("Error al actualizar progreso de unidades:", error);
     res.status(500).json({ message: "Error interno del servidor" });
     return;
  }
};
