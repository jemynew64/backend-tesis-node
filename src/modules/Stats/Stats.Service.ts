import { DailyUserStats, DailyGeneralStats } from "../../database/prismaClient";
import { StatsInput, StatsSchema } from "./Stats.schema";

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
const generalKeys = [
  "total_lessons",
  "total_lessons_perfect",
  "total_challenges",
  "total_correct_answers",
  "total_wrong_answers",
  "total_units_completed",
  "total_missions",
  "total_points",
  "total_experience",
  "quizzes_completed",
] as const;

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

  // 2. Actualizar o crear stats generales
  const existingGeneral = await DailyGeneralStats.findUnique({
    where: { user_id: userId },
  });

  if (existingGeneral) {
    const updateData: any = {};

    generalKeys.forEach((key) => {
      if (parsedStats[key] !== undefined) {
        updateData[key] = { increment: parsedStats[key] };
      }
    });

    await DailyGeneralStats.update({
      where: { user_id: userId },
      data: updateData,
    });
  } else {
    const createData: any = {
      user_id: userId,
    };

    generalKeys.forEach((key) => {
      createData[key] = parsedStats[key] ?? 0;
    });

    await DailyGeneralStats.create({
      data: createData,
    });
  }

  return { ok: true };
};
