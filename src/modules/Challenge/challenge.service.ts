// src/modules/Challenge/challenge.service.ts
import { ChallengeModel } from "../../database/prismaClient";
import { ChallengeSchema, ChallengeType } from "./ChallengeSchema";
import { uploadImageToCloudinary } from "../../utils/uploadImage";

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


  // Subimos la imagen si existe
  if (validatedData.image_src) {
    validatedData.image_src = await uploadImageToCloudinary(validatedData.image_src);
  }

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

    // Obtener la opción actual para comparar
    const currentOption = await ChallengeModel.findUnique({
      where: { id },
      select: { image_src: true }
    });

  // Subimos la imagen solo si es distinta a la actual
  if (
    validatedData.image_src && validatedData.image_src !== currentOption?.image_src
  ) {
    validatedData.image_src = await uploadImageToCloudinary(validatedData.image_src);
  }

  return await ChallengeModel.update({
    where: { id },
    data: validatedData,
  });
};
