import { ChallengeModel,LessonModel  } from "../../database/prismaClient";
import { ChallengeSchema, ChallengeType } from "./ChallengeSchema";

export const findChallengesByLessonId = async (lesson_id: number) => {
  return await ChallengeModel.findMany({
    where: { lesson_id },
    orderBy: { order_num: "asc" },
  });
};

export const findquizzez = async (lesson_id: number) => {
  // 1️⃣ Obtener la lección actual para saber su unidad y order_num
  const currentLesson = await LessonModel.findUnique({
    where: { id: lesson_id },
    select: {
      id: true,
      order_num: true,
      unit_id: true,
    },
  });

  if (!currentLesson) return [];

  // 2️⃣ Obtener la última lección de esa unidad (por order_num)
  const lastLesson = await LessonModel.findFirst({
    where: { unit_id: currentLesson.unit_id },
    orderBy: { order_num: "desc" },
    select: { id: true },
  });

  // 3️⃣ Verificamos si es la última
  const isLastLesson = currentLesson.id === lastLesson?.id;

  // 4️⃣ Buscar los challenges normales
  const challenges = await ChallengeModel.findMany({
    where: { lesson_id },
    orderBy: { order_num: "asc" },
    include: {
      challenge_option: true,
    },
  });

  // 5️⃣ Retornar challenges y marca adicional
  return {
    isLastLesson,
    challenges,
  };
};

export const findAllChallenges = async (page = 1, limit = 10) => {
  return await ChallengeModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

export const findChallengeById = async (id: number) => {
  return await ChallengeModel.findUnique({
    where: { id },
  });
};

export const createNewChallenge = async (data: ChallengeType) => {
  const validatedData = ChallengeSchema.parse(data);
  // ❌ ya no se sube nuevamente
  return await ChallengeModel.create({ data: validatedData });
};

export const updateChallengeById = async (
  id: number,
  data: Partial<ChallengeType>
) => {
  const validatedData = ChallengeSchema.partial().parse(data);
  return await ChallengeModel.update({
    where: { id },
    data: validatedData,
  });
};


export const deleteChallengeById = async (id: number) => {
  return await ChallengeModel.delete({
    where: { id },
  });
};
