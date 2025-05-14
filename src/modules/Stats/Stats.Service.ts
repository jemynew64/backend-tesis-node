import { DailyUserStats, GeneralStatsModel } from "../../database/prismaClient";
import { StatsInput, StatsSchema } from "./Stats.schema";

export const getAllUserDailyStatsService = async (userId: number) => {
  const allStats = await DailyUserStats.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      date: "asc", // opcional, pero útil para gráficas
    },
    select: {
      date: true,
      lessons_completed: true,
      lessons_perfect: true,
      challenges_completed: true,
      correct_answers: true,
      wrong_answers: true,
      experience_gained: true,
      points_gained: true,
      time_spent_minutes: true,
    }
  });

  return allStats;
};


export const getUserStatsService = async (userId: number) => {
  const generalStats = await GeneralStatsModel.findUnique({
    where: { user_id: userId },
  });

  if (!generalStats) {
    // Devolver un objeto con valores predeterminados en lugar de lanzar un error
    console.warn(`No se encontraron estadísticas generales para el usuario con ID: ${userId}`);
    return {
      total_lessons: 0,
      total_lessons_perfect: 0,
      total_challenges: 0,
      total_correct_answers: 0,
      total_wrong_answers: 0,
      total_experience: 0,
      total_points: 0,
      quizzes_completed: 0,
    };
  }

  return generalStats;
};


export const getUserStatsDiarioService = async (userId: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Asegúrate de que la hora se establezca a las 00:00:00 para evitar problemas con las horas

  const diaryStats = await DailyUserStats.findUnique({
    where: {
      user_id_date: {
        user_id: userId,
        date: today.toISOString(), // Usamos la fecha completa en formato ISO-8601
      },
    },
  });

  if (!diaryStats) {
    // Devolver un objeto con valores predeterminados en lugar de lanzar un error
    console.warn(`No se encontraron estadísticas diarias para el usuario con ID: ${userId}`);
    return {
      lessons_completed: 0,
      lessons_perfect: 0,
      challenges_completed: 0,
      correct_answers: 0,
      wrong_answers: 0,
      experience_gained: 0,
      points_gained: 0,
      time_spent_minutes: 0,
    };
  }

  return diaryStats;
};




// Campos que pertenecen a la tabla diaria
const dailyKeys = [
  "lessons_completed",
  "lessons_perfect",
  "challenges_completed",
  "correct_answers",
  "wrong_answers",
  "experience_gained",
  "points_gained",
  "time_spent_minutes",
] as const;

// Campos que pertenecen a la tabla general
// const generalKeys = [
//   "total_lessons",
//   "total_lessons_perfect",
//   "total_challenges",
//   "total_correct_answers",
//   "total_wrong_answers",
//   "total_units_completed",
//   "total_missions",
//   "total_points",
//   "total_experience",
//   "quizzes_completed",
// ] as const;

// Mapeo entre campos diarios y generales
const generalMapping: Record<string, string> = {
  lessons_completed: "total_lessons",
  lessons_perfect: "total_lessons_perfect",
  challenges_completed: "total_challenges",
  correct_answers: "total_correct_answers",
  wrong_answers: "total_wrong_answers",
  experience_gained: "total_experience",
  points_gained: "total_points",
  quizzes_completed: "quizzes_completed",
  // Otros campos como units/missions se actualizan desde otros procesos
};

// Servicio principal
export const updateUserStatsService = async (userId: number, stats: StatsInput) => {
  const parsedStats = StatsSchema.parse(stats);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // para que la comparación de fechas sea precisa

  // 1. Actualizar o crear stats diarios
  const existingDaily = await DailyUserStats.findUnique({
    where: {
      user_id_date: { user_id: userId, date: today },
    },
  });

  if (existingDaily) {
    const updateData: any = {};

    dailyKeys.forEach((key) => {
      if (parsedStats[key] !== undefined) {
        updateData[key] = { increment: parsedStats[key] };
      }
    });

    await DailyUserStats.update({
      where: { id: existingDaily.id },
      data: updateData,
    });
  } else {
    const createData: any = {
      user_id: userId,
      date: today,
    };

    dailyKeys.forEach((key) => {
      createData[key] = parsedStats[key] ?? 0;
    });

    await DailyUserStats.create({
      data: createData,
    });
  }

  // 2. Actualizar o crear stats generales usando el mapeo
  const existingGeneral = await GeneralStatsModel.findUnique({
    where: { user_id: userId },
  });

  const mappedUpdateData: any = {};

  Object.entries(generalMapping).forEach(([dailyKey, generalKey]) => {
    if (parsedStats[dailyKey as keyof StatsInput] !== undefined) {
      mappedUpdateData[generalKey] = {
        increment: parsedStats[dailyKey as keyof StatsInput]!,
      };
    }
  });

  if (existingGeneral) {
    await GeneralStatsModel.update({
      where: { user_id: userId },
      data: mappedUpdateData,
    });
  } else {
    const createData: any = {
      user_id: userId,
    };

    Object.entries(generalMapping).forEach(([dailyKey, generalKey]) => {
      createData[generalKey] = parsedStats[dailyKey as keyof StatsInput] ?? 0;
    });

    await GeneralStatsModel.create({
      data: createData,
    });
  }

  return { ok: true };
};
