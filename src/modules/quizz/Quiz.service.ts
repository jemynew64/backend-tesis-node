import { UserModel, LessonProgressModel } from "../../database/prismaClient";

export async function QuizUserPoint(user_id: number, lesson_id: number) {
  // Paso 1: Buscar lesson_progress por userId y lessonId
  const lessonProgress = await LessonProgressModel.findFirst({
    where: {
      user_id: user_id,
      lesson_id: lesson_id,
    },
  });

  if (!lessonProgress) {
    throw new Error("No se encontró el progreso de la lección");
  }

  // Paso 2: Según si está completado, asignar puntos y experiencia
  const isCompleted = lessonProgress.completed;

  const points = isCompleted ? 30 : 75;
  const experience = isCompleted ? 25 : 100;

  // Paso 3: Actualizar al usuario con los puntos y experiencia correspondientes
  // Actualizar al usuario
   await UserModel.update({
    where: { id: user_id },
    data: {
      points: {
        increment: points,
      },
      experience: {
        increment: experience,
      },
    },
  });

  // Retornar los valores aplicados (para mostrar en el frontend)
  return {
      points,
      experience,
  };
}

export async function checkLessonCompleted(user_id: number, lesson_id: number) {
  const lessonProgress = await LessonProgressModel.findFirst({
    where: {
      user_id,
      lesson_id,
    },
  });

  if (!lessonProgress) {
    return false; // No se encontró progreso, se asume no completado
  }

  return lessonProgress.completed;
}
