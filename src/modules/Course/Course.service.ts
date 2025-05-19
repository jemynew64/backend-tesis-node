import { CourseModel  } from "../../database/prismaClient";
import { CourseSchema, CourseType } from "./CourseSchema";

export const findAllCourses = async (page: number, limit: number) => {
  return await CourseModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

export const findCourseById = async (id: number) => {
  return await CourseModel.findUnique({ where: { id } });
};

export const createNewCourse = async (data: CourseType) => {
  const validatedData = CourseSchema.parse(data);
  return await CourseModel.create({ data: validatedData });
};

export const deleteCourseById = async (id: number) => {
  return await CourseModel.delete({ where: { id } });
};

export const updateCourseById = async (
  id: number,
  data: Partial<CourseType>
) => {
  const validatedData = CourseSchema.partial().parse(data);
  return await CourseModel.update({
    where: { id },
    data: validatedData,
  });
};

export const courseidunitlesson = async (id: number, user_id: number) => {
  return await CourseModel.findFirst({
    where: { id },
    select: {
      title: true,
      unit: {
        select: {
          title: true,
          description: true,
          lesson: {
            select: {
              id: true,
              title: true,
              lesson_progress: {
                where: {
                  user_id: user_id,
                },
                select: {
                  completed: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

// Función para obtener el curso con sus lecciones desbloqueadas por usuario
export const courseWithUnlockedLessons = async (courseId: number, userId: number) => {
  const course = await CourseModel.findFirst({
    where: { id: courseId },
    select: {
      title: true,
      unit: {
        orderBy: { order_num: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          order_num: true,
          lesson: {
            orderBy: { order_num: "asc" },
            select: {
              id: true,
              title: true,
              order_num: true,
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

  if (!course) return [];

  const courseWithStatus = {
    title: course.title,
    unit: course.unit.map((unit, unitIndex, allUnits) => {
      const isFirstUnit = unitIndex === 0;

      // ✅ Verificamos si TODAS las lecciones de la unidad anterior están completadas
      const previousUnitCompleted = isFirstUnit || allUnits[unitIndex - 1].lesson.every(
        (l) => l.lesson_progress?.[0]?.completed === true
      );

      const lessonWithStatus = unit.lesson.map((lesson, lessonIndex, lessonArray) => {
        const isFirstLesson = lessonIndex === 0;

        const unlocked = isFirstUnit && isFirstLesson
          ? true
          : isFirstLesson
            ? previousUnitCompleted
            : lessonArray[lessonIndex - 1].lesson_progress?.[0]?.completed === true;

        return {
          id: lesson.id,
          title: lesson.title,
          completed: lesson.lesson_progress?.[0]?.completed || false,
          unlocked,
        };
      });

      return {
        id: unit.id,
        title: unit.title,
        description: unit.description,
        lesson: lessonWithStatus,
      };
    }),
  };

  return courseWithStatus;
};
