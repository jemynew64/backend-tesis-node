import { Request, Response } from "express";
import { LessonProgressSchema, LessonProgressType } from "../../schemas/index";
import * as LessonProgressService from "./LessonProgress.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Obtener progreso de lecciones
export const getLessonProgress = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Progresos por página (por defecto 10)

        const lessonProgress = await LessonProgressService.fetchLessonProgress(page, limit);

        res.status(200).json(lessonProgress);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Obtener progreso de lección por ID
export const getLessonProgressById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lessonProgress = await LessonProgressService.fetchLessonProgressById(Number(id));

        if (!lessonProgress) {
            res.status(404).json({ message: "Lesson progress not found" });
            return;
        }

        res.status(200).json(lessonProgress);
        return;
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Crear progreso de lección
export const createLessonProgress = async (req: Request, res: Response) => {
    try {
        const lessonProgressData: LessonProgressType = LessonProgressSchema.parse(req.body);

        const newLessonProgress = await LessonProgressService.createNewLessonProgress(lessonProgressData);

        res.status(201).json(newLessonProgress);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Eliminar progreso de lección
export const deleteLessonProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await LessonProgressService.removeLessonProgress(Number(id));

        res.status(200).json({ message: "Lesson progress deleted successfully" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Actualizar progreso de lección
export const updateLessonProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lessonProgressData: Partial<LessonProgressType> = LessonProgressSchema.partial().parse(req.body);

        const updatedLessonProgress = await LessonProgressService.modifyLessonProgress(Number(id), lessonProgressData);

        res.status(200).json(updatedLessonProgress);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
