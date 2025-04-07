import { LessonProgressModel } from "../../database/prismaClient";
import { LessonProgressType } from "../../schemas";

// Obtener progreso de lecciones
export const fetchLessonProgress = async (page: number, limit: number) => {
    return await LessonProgressModel.findMany({
        take: limit,  // Número de progresos por página
        skip: (page - 1) * limit, // Cuántos saltar antes de empezar
    });
};

// Obtener progreso de lección por ID
export const fetchLessonProgressById = async (id: number) => {
    return await LessonProgressModel.findUnique({
        where: { id },
    });
};

// Crear progreso de lección
export const createNewLessonProgress = async (lessonProgressData: LessonProgressType) => {
    return await LessonProgressModel.create({
        data: lessonProgressData,
    });
};

// Eliminar progreso de lección
export const removeLessonProgress = async (id: number) => {
    return await LessonProgressModel.delete({
        where: { id },
    });
};

// Actualizar progreso de lección
export const modifyLessonProgress = async (id: number, lessonProgressData: Partial<LessonProgressType>) => {
    return await LessonProgressModel.update({
        where: { id },
        data: lessonProgressData,
    });
};
