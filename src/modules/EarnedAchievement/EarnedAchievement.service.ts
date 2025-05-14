import { EarnedAchievementModel, AchievementModel, GeneralStatsModel } from "../../database/prismaClient";
import { EarnedAchievementSchema, EarnedAchievementType } from "../../schemas/index";

// Obtener logros ganados con paginación
export const fetchEarnedAchievements = async (page = 1, limit = 10) => {
  return await EarnedAchievementModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

// Obtener logro ganado por ID
export const fetchEarnedAchievementById = async (id: number) => {
  return await EarnedAchievementModel.findUnique({
    where: { id },
  });
};

// Crear un nuevo logro ganado
export const createNewEarnedAchievement = async (data: EarnedAchievementType) => {
  const validatedData = EarnedAchievementSchema.parse(data);
  const exists = await EarnedAchievementModel.findFirst({
    where: {
      achievement_id: validatedData.achievement_id,
      user_id: validatedData.user_id,
    },
  });
  if (exists) {
    throw new Error("Este usuario ya ha obtenido este logro.");
  }
  return await EarnedAchievementModel.create({
    data: validatedData,
  });
};

// Eliminar logro ganado por ID
export const removeEarnedAchievementById = async (id: number) => {
  return await EarnedAchievementModel.delete({
    where: { id },
  });
};

// Actualizar logro ganado por ID
export const modifyEarnedAchievementById = async (
  id: number,
  data: Partial<EarnedAchievementType>
) => {
  const validatedData = EarnedAchievementSchema.partial().parse(data);
  return await EarnedAchievementModel.update({
    where: { id },
    data: validatedData,
  });
};

export const autoAssignAchievements = async (userId: number) => {
  try {
    console.log("🔍 Iniciando comprobación de logros para usuario:", userId);

    const [logros, stats, logrosGanados] = await Promise.all([
      AchievementModel.findMany(),
      GeneralStatsModel.findUnique({ where: { user_id: userId } }),
      EarnedAchievementModel.findMany({ where: { user_id: userId } }),
    ]);

    if (!stats) {
      console.warn("⚠️ No se encontraron estadísticas generales para el usuario:", userId);
      throw new Error("User stats not found");
    }

    const logrosYaGanados = new Set(logrosGanados.map((l:EarnedAchievementType) => l.achievement_id));
    const nuevosLogros = [];

    for (const logro of logros) {
      if (logrosYaGanados.has(logro.id)) continue;

      const valor = stats[logro.stat_key as keyof typeof stats];
      if (valor === undefined) {
        console.warn(`⚠️ El campo '${logro.stat_key}' no existe en las estadísticas del usuario`);
        continue;
      }

      let cumple = false;
      switch (logro.stat_condition) {
        case "gte": cumple = valor >= logro.stat_value; break;
        case "gt": cumple = valor > logro.stat_value; break;
        case "lte": cumple = valor <= logro.stat_value; break;
        case "lt": cumple = valor < logro.stat_value; break;
        case "eq": cumple = valor === logro.stat_value; break;
        default:
          console.warn(`⚠️ Condición desconocida: ${logro.stat_condition}`);
          continue;
      }


      if (cumple) {
        const nuevo = await EarnedAchievementModel.create({
          data: {
            user_id: userId,
            achievement_id: logro.id,
          },
        });
        console.log(`🏆 Logro asignado: ${logro.title} (ID: ${logro.id})`);
        nuevosLogros.push(nuevo);
      }
    }

    console.log(`✅ Total de logros nuevos asignados: ${nuevosLogros.length}`);

    return {
      message: `${nuevosLogros.length} logro(s) asignado(s) correctamente.`,
      earned: nuevosLogros,
    };
  } catch (error) {
    console.error("❌ Error en autoAssignAchievements:", error);
    throw error;
  }
};
