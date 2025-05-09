import { UserMissionModel } from "../../database/prismaClient";
import { UserMissionSchema, UserMissionType } from "../../schemas/index";
import { startOfToday } from "date-fns";

// Get user missions with pagination
export const getUserMissionService = async (page: number, limit: number) => {
    return await UserMissionModel.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
};

// Get user mission by ID
export const getUserMissionByIdService = async (id: number) => {
    return await UserMissionModel.findUnique({
        where: { id },
    });
};

// Create a new user mission
export const createUserMissionService = async (userMissionData: UserMissionType) => {
    const validatedUserMissionData = UserMissionSchema.parse(userMissionData);

    const newUserMission = await UserMissionModel.create({
        data: {
            ...validatedUserMissionData,
        },
    });

    return newUserMission;
};

// Update user mission
export const updateUserMissionService = async (id: number, userMissionData: Partial<UserMissionType>) => {
    const validatedUserMissionData = UserMissionSchema.partial().parse(userMissionData);

    const updatedUserMission = await UserMissionModel.update({
        where: { id },
        data: validatedUserMissionData,
    });

    return updatedUserMission;
};

// Delete user mission
export const deleteUserMissionService = async (id: number) => {
    await UserMissionModel.delete({
        where: { id },
    });
};

//para listar los dias xd 

// Misiones del día para un usuario
export const getUserMissionsTodayService = async (userId: number) => {
  const today = startOfToday();

  return await UserMissionModel.findMany({
    where: {
      user_id: userId,
      daily_mission: {
        date: today,
      },
    },
    include: {
      daily_mission: {
        include: { mission: true },
      },
    },
  });
};
