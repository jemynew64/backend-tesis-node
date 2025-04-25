import { Request, Response } from "express";

import { QuizUserPoint } from "./Quiz.service"


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


