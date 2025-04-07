// src/modules/Challenge/challenge.service.ts
import { ChallengeModel } from "../../database/prismaClient";
import { ChallengeSchema, ChallengeType } from "./ChallengeSchema";
  
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
  return await ChallengeModel.create({
        data: validatedData,
  });
};

export const deleteChallengeById = async (id: number) => {
  return await ChallengeModel.delete({
    where: { id },
  });
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
