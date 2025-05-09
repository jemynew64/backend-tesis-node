import { startOfToday } from "date-fns";
import bcrypt from "bcrypt";
import {
  DailyMissionModel,
  MissionModel,
  UserModel,
  UserMissionModel,
} from "../../database/prismaClient";
import { generateToken } from "../../utils/jwt";

// 🔍 Buscar usuario por email
export const findUserByEmail = async (email: string) => {
  return await UserModel.findUnique({ where: { email } });
};

// 🔐 Comparar contraseñas
export const comparePassword = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};

// 🧾 Generar token JWT
export const generateUserToken = (user: { id: number; email: string; user_type: string }) => {
  return generateToken({
    id: user.id,
    email: user.email,
    user_type: user.user_type,
  });
};

// 🗓️ Generar 3 misiones diarias si no existen aún
export const generateDailyMissionsIfNeeded = async () => {
  const today = startOfToday();

  const existing = await DailyMissionModel.findMany({
    where: { date: today },
  });

  if (existing.length === 0) {
    const allMissions = await MissionModel.findMany();
    if (allMissions.length < 3) {
      console.warn("⚠️ No hay suficientes misiones para generar el día");
      return;
    }

    const shuffled = allMissions.sort(() => 0.5 - Math.random()).slice(0, 3);

    await DailyMissionModel.createMany({
      data: shuffled.map((m) => ({ mission_id: m.id, date: today })),
    });

    console.log("✅ Misiones diarias generadas:", shuffled.map((m) => m.title));
  } else {
    console.log("🟡 Ya existen misiones diarias para hoy.");
  }
};

// 👤 Relacionar al usuario con las misiones del día
export const asignarMisionesDelDiaAlUsuario = async (userId: number) => {
  const today = startOfToday();

  const dailyMissions = await DailyMissionModel.findMany({
    where: { date: today },
  });

  for (const daily of dailyMissions) {
    const yaAsignada = await UserMissionModel.findFirst({
      where: {
        user_id: userId,
        daily_mission_id: daily.id,
      },
    });

    if (!yaAsignada) {
      await UserMissionModel.create({
        data: {
          user_id: userId,
          daily_mission_id: daily.id,
          completed: false,
        },
      });
    }
  }

  console.log(`✅ Misiones del día asignadas al usuario ID ${userId}`);
};
