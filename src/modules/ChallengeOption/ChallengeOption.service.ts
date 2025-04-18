import { ChallengeOptionModel } from "../../database/prismaClient";
import { ChallengeOptionSchema, ChallengeOptionType } from "./ChallengeOptionSchema";
import { uploadImageToCloudinary } from "../../utils/uploadImage";


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

  // Subimos la imagen si existe
  if (validatedData.image_src) {
    validatedData.image_src = await uploadImageToCloudinary(validatedData.image_src);
  }

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

    // Obtener la opción actual para comparar
    const currentOption = await ChallengeOptionModel.findUnique({
      where: { id },
      select: { image_src: true }
    });

  // Subimos la imagen solo si es distinta a la actual
  if (
    validatedData.image_src && validatedData.image_src !== currentOption?.image_src
  ) {
    validatedData.image_src = await uploadImageToCloudinary(validatedData.image_src);
  }

  return await ChallengeOptionModel.update({
    where: { id },
    data: validatedData,
  });
};
