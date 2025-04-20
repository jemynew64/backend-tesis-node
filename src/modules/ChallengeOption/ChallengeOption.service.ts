import { ChallengeOptionModel } from "../../database/prismaClient";
import { ChallengeOptionSchema, ChallengeOptionType } from "./ChallengeOptionSchema";


// 3. Nuevo servicio en challenge.service.ts
export const findChallengesoptionBychallengeId = async (challenge_id: number) => {
  return await ChallengeOptionModel.findMany({
    where: { challenge_id },
    });
};

export const findAllOptions = async (page = 1, limit = 10) => {
  return await ChallengeOptionModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

export const findOptionById = async (id: number) => {
  return await ChallengeOptionModel.findUnique({
    where: { id },
  });
};

export const createNewOption = async (data: ChallengeOptionType) => {
  const validatedData = ChallengeOptionSchema.parse(data);
  return await ChallengeOptionModel.create({
    data: validatedData,
  });
};

export const deleteOptionById = async (id: number) => {
  return await ChallengeOptionModel.delete({
    where: { id },
  });
};

export const updateOptionById = async (
  id: number,
  data: Partial<ChallengeOptionType>
) => {
  const validatedData = ChallengeOptionSchema.partial().parse(data);
  return await ChallengeOptionModel.update({
    where: { id },
    data: validatedData,
  });
};
