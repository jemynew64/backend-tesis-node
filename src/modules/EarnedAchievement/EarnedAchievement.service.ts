import { EarnedAchievementModel, AchievementModel, GeneralStatsModel } from "../../database/prismaClient";
import { EarnedAchievementSchema, EarnedAchievementFormType } from "../../schemas/index";
type EarnedAchievement = {
  id: number;
  user_id: number;
  obtained_at: Date;
  achievement_id: number;
};

// ✅ Tipo usado para crear logros (sin `id`)
type EarnedAchievementCreateInput = Omit<EarnedAchievementFormType, "id">;

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
export const createNewEarnedAchievement = async (data: EarnedAchievementCreateInput) => {
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
  data: Partial<EarnedAchievementFormType>
) => {
  const validatedData = EarnedAchievementSchema.partial().parse(data);
  return await EarnedAchievementModel.update({
    where: { id },
    data: validatedData,
  });
};

// Asignación automática de logros si se cumplen condiciones
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

    const logrosYaGanados = new Set(logrosGanados.map((l:EarnedAchievement) => l.achievement_id));

    // ✅ Aquí el cambio importante
    const nuevosLogros: any[] = []; // O tipa correctamente si tienes el tipo exacto

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
            obtained_at: new Date(),
          },
        });

        console.log(`🏆 Logro asignado: ${logro.title} (ID: ${logro.id})`);
        nuevosLogros.push(nuevo); // ✅ ya no da error aquí
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
