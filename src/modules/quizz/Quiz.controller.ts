import { Request, Response } from "express";

import { QuizUserPoint,checkLessonCompleted } from "./Quiz.service"


//aumentar puntos en el usuario
export const quizzUserPoints = async (req: Request, res: Response) => {
    try {
        const { user_id,lesson_id } = req.body; // Asegúrate de que el ID del usuario se envíe en el cuerpo de la solicitud

        // Llama a la función para aumentar los puntos del usuario
        const datos = await QuizUserPoint(user_id,lesson_id);
        res.status(200).json({ message: "Puntos del usuario aumentados correctamente",datos });
    } catch (error) {
        res.status(500).json({ message: "Error al aumentar los puntos del usuario", error });
    }
};


// 🟢 GET: Verificar si una lección está completada
export const isLessonCompleted = async (req: Request, res: Response) => {
  try {
    const userIdFromToken = (req as any).user?.id;
    const lesson_id = parseInt(req.query.lesson_id as string);

    if (isNaN(lesson_id)) {
       res.status(400).json({ message: "lesson_id inválido o faltante en query." });
       return;
    }

    const isCompleted = await checkLessonCompleted(userIdFromToken, lesson_id);
     res.status(200).json({ lesson_id, completed: isCompleted });
     return;
  } catch (error) {
     res.status(500).json({ message: "Error al verificar lección", error });
     return;
  }
};