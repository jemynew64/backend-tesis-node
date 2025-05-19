import {
  CourseModel,
  UserUnitProgressModel,
  GeneralStatsModel,
} from "../../database/prismaClient";

export const updateCompletedUnitsByUser = async (
  courseId: number,
  userId: number
) => {
  const course = await CourseModel.findFirst({
    where: { id: courseId },
    select: {
      unit: {
        select: {
          id: true,
          lesson: {
            select: {
              id: true,
              lesson_progress: {
                where: { user_id: userId },
                select: { completed: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return;

  for (const unit of course.unit) {
    const allLessonsCompleted = unit.lesson.every(
      (lesson) => lesson.lesson_progress?.[0]?.completed === true
    );

    if (allLessonsCompleted) {
      // Verificamos si ya existe un registro previo
      const existingProgress = await UserUnitProgressModel.findUnique({
        where: {
          user_id_unit_id: {
            user_id: userId,
            unit_id: unit.id,
          },
        },
      });

      // Si no existía progreso, vamos a contar como una nueva unidad completada
      const isFirstTimeCompleted = !existingProgress;

      await UserUnitProgressModel.upsert({
        where: {
          user_id_unit_id: {
            user_id: userId,
            unit_id: unit.id,
          },
        },
        create: {
          user_id: userId,
          unit_id: unit.id,
          completed: true,
        },
        update: {
          completed: true,
        },
      });

      if (isFirstTimeCompleted) {
        // Aumentamos el contador solo si es la primera vez que completa la unidad
        await GeneralStatsModel.update({
          where: { user_id: userId },
          data: {
            total_units_completed: {
              increment: 1,
            },
          },
        });
      }
    }
  }
};
