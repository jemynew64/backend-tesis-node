import { EarnedAchievementModel } from "../../database/prismaClient";
import { EarnedAchievementSchema, EarnedAchievementType } from "../../schemas/index";

// Obtener logros ganados con paginación
export const fetchEarnedAchievements = async (page = 1, limit = 10) => {
  return await EarnedAchievementModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

// Obtener logro ganado por ID
export const fetchEarnedAchievementById = async (id: number) => {
  return await EarnedAchievementModel.findUnique({
    where: { id },
  });
};

// Crear un nuevo logro ganado
export const createNewEarnedAchievement = async (data: EarnedAchievementType) => {
  const validatedData = EarnedAchievementSchema.parse(data);
  const exists = await EarnedAchievementModel.findFirst({
    where: {
      achievement_id: validatedData.achievement_id,
      user_id: validatedData.user_id,
    },
  });
  if (exists) {
    throw new Error("Este usuario ya ha obtenido este logro.");
  }
  return await EarnedAchievementModel.create({
    data: validatedData,
  });
};

// Eliminar logro ganado por ID
export const removeEarnedAchievementById = async (id: number) => {
  return await EarnedAchievementModel.delete({
    where: { id },
  });
};

// Actualizar logro ganado por ID
export const modifyEarnedAchievementById = async (
  id: number,
  data: Partial<EarnedAchievementType>
) => {
  const validatedData = EarnedAchievementSchema.partial().parse(data);
  return await EarnedAchievementModel.update({
    where: { id },
    data: validatedData,
  });
};
