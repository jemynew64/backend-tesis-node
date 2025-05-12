import { UserMissionModel,DailyUserStats } from "../../database/prismaClient";
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


export const checkAndMarkUserMissionsService = async (userId: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userStats = await DailyUserStats.findUnique({
    where: {
      user_id_date: {
        user_id: userId,
        date: today,
      },
    },
  });

  if (!userStats) return { completed: 0 };

  const userMissions = await UserMissionModel.findMany({
    where: {
      user_id: userId,
      completed: false,
      daily_mission: { date: today },
    },
    include: {
      daily_mission: {
        include: { mission: true },
      },
    },
  });

  let completedCount = 0;

  for (const um of userMissions) {
    const { mission } = um.daily_mission;
    const statKey = mission.stat_key as keyof typeof userStats;
    const value = userStats[statKey];

    if (typeof value !== "number") {
      console.warn(`⚠️ Estadística '${mission.stat_key}' no válida o no existe en userStats para el usuario ${userId}`);
      continue;
    }

    console.log("🔍 Verificando misión:", {
      mission_id: mission.id,
      stat_key: mission.stat_key,
      valor_actual: value,
      condicion: mission.stat_condition,
      valor_objetivo: mission.stat_value,
    });

    let valid = false;
    switch (mission.stat_condition) {
      case "gte": valid = value >= mission.stat_value; break;
      case "lte": valid = value <= mission.stat_value; break;
      case "gt":  valid = value >  mission.stat_value; break;
      case "lt":  valid = value <  mission.stat_value; break;
      case "eq":  valid = value === mission.stat_value; break;
    }

    if (valid) {
      await UserMissionModel.update({
        where: { id: um.id },
        data: {
          completed: true,
          completed_at: new Date(),
        },
      });
      completedCount++;
      console.log(`✅ Misión ${mission.id} marcada como completada.`);
    } else {
      console.log(`❌ Misión ${mission.id} aún no cumple los requisitos.`);
    }
  }

  return { completed: completedCount };
};
