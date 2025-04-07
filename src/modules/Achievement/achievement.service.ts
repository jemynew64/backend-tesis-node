// src/services/achievement.service.ts
import { AchievementModel } from "../../database/prismaClient";
import { AchievementSchema, AchievementType } from "./AchievementSchema";

export const findAllAchievements = async (page = 1, limit = 10) => {
  return await AchievementModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

export const findAchievementById = async (id: number) => {
  return await AchievementModel.findUnique({
    where: { id },
  });
};

export const createNewAchievement = async (data: AchievementType) => {
  const validatedData = AchievementSchema.parse(data);
  return await AchievementModel.create({
    data: validatedData,
  });
};

export const deleteAchievementById = async (id: number) => {
  return await AchievementModel.delete({
    where: { id },
  });
};

export const updateAchievementById = async (
  id: number,
  data: Partial<AchievementType>
) => {
  const validatedData = AchievementSchema.partial().parse(data);
  return await AchievementModel.update({
    where: { id },
    data: validatedData,
  });
};
