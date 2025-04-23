import { LessonModel ,LessonProgressModel } from "../../database/prismaClient";
import { LessonSchema, LessonType } from "./LessonSchema";

// Fetch lessons with pagination
export const fetchLessons = async (page = 1, limit = 10) => {
  return await LessonModel.findMany({
    include: {
      unit: {
        select: {
          title: true,
        },
      },
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      order_num: 'asc',
    },
  });
};

// Fetch a lesson by ID
export const fetchLessonById = async (id: number) => {
  return await LessonModel.findUnique({
    where: { id },
    include: {
      unit: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

// Create a new lesson
export const createNewLesson = async (data: LessonType) => {
  const validatedData = LessonSchema.parse(data);
  return await LessonModel.create({
    data: validatedData,
  });
};

// Remove a lesson by ID
export const removeLessonById = async (id: number) => {
  return await LessonModel.delete({
    where: { id },
  });
};

// Modify a lesson by ID
export const modifyLessonById = async (id: number, data: Partial<LessonType>) => {
  const validatedData = LessonSchema.partial().parse(data);
  return await LessonModel.update({
    where: { id },
    data: validatedData,
  });
};

// Crear progreso si no existe
export const iniciarProgresoLeccion = async (lessonId: number, userId: number) => {
  const existe = await LessonProgressModel.findFirst({
    where: {
      lesson_id: lessonId,
      user_id: userId,
    },
  });

  if (!existe) {
    await LessonProgressModel.create({
      data: {
        lesson_id: lessonId,
        user_id: userId,
        completed: false,
      },
    });
  }
};

// Marcar lección como completada
export const completarProgresoLeccion = async (lessonId: number, userId: number) => {
  await LessonProgressModel.updateMany({
    where: {
      lesson_id: lessonId,
      user_id: userId,
    },
    data: {
      completed: true,
    },
  });
};