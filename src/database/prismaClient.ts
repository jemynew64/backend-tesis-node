import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Modelos principales
export const UserModel = prisma.user_account;         // usuario
export const CourseModel = prisma.course;             // curso
export const LessonModel = prisma.lesson;             // leccion
export const AchievementModel = prisma.achievement;   // logro
export const ChallengeModel = prisma.challenge;       // reto
export const UnitModel = prisma.unit;                 // unidad
export const EarnedAchievementModel = prisma.earned_achievement; // logro_obtenido
export const ChallengeOptionModel = prisma.challenge_option;     // opcion_reto

// Añadidos
export const MissionModel = prisma.mission;               // mision
export const UserMissionModel = prisma.user_mission;      // mision_usuario

// Tablas intermedias
export const LessonProgressModel = prisma.lesson_progress;        // progreso_leccion
export const ChallengeProgressModel = prisma.challenge_progress;  // progreso_reto
export const UserProgressModel = prisma.user_progress;            // progreso_usuario
