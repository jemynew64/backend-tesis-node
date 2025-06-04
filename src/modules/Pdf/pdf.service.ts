import { prisma } from "../../database/prismaClient";
import PDFDocument from "pdfkit";
import axios from "axios";

export interface DailyUserStat {
  id: number;
  user_id: number;
  quizzes_completed: number;
  date: Date;
  lessons_completed: number;
  lessons_perfect: number;
  challenges_completed: number;
  correct_answers: number;
  wrong_answers: number;
  experience_gained: number;
  points_gained: number;
  time_spent_minutes: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  image_src: string;
  stat_key: string;
  stat_condition: string;
  stat_value: number;
}

export interface EarnedAchievement {
  id: number;
  user_id: number;
  obtained_at: Date;
  achievement_id: number;
  achievement: Achievement;
}

export const generateUserReportPDF = async (
  userId: number,
  from: string,
  to: string
): Promise<Uint8Array> => {
  const user = await prisma.user_account.findUnique({
    where: { id: userId },
    include: {
      user_general_stats: true,
      earned_achievement: { include: { achievement: true } },
      daily_user_stats: {
        where: { date: { gte: new Date(from), lte: new Date(to) } },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const stats = user.user_general_stats;
  const dailyStats = user.daily_user_stats;
  const achievements = user.earned_achievement;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers: Uint8Array[] = [];
  const logoUrl = "https://res.cloudinary.com/dkbydlqen/image/upload/v1748983331/iconodemarca-sinfondo_vahgnz.png";
  const response = await axios.get<ArrayBuffer>(logoUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(new Uint8Array(response.data));

  doc.on("data", (chunk: Uint8Array) => buffers.push(chunk));
  doc.on("end", () => {});

  // Header
  doc.image(buffer, 450, 30, { width: 80 }) // Puedes usar local si prefieres
    .fillColor("#4A00E0")
    .fontSize(20)
    .text("GENIOS EN ACCIÓN - REPORTE DE PROGRESO", 50, 50, {
      width: 400,
      align: "left",
    });

  doc.moveDown();

  // Sección: Datos generales
  doc.fillColor("#000").fontSize(14).text("Datos generales", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Usuario: ${user.name}`)
    .text(`Correo: ${user.email}`)
    .text(`Nivel actual: ${user.level} (${user.experience} EXP)`)
    .text(`Corazones restantes: ${user.hearts}`)
    .text(`Periodo evaluado: ${from} a ${to}`);

  doc.moveDown();

  // Sección: Resumen general
  doc.fillColor("#000").fontSize(14).text("Resumen general", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Lecciones completadas: ${stats?.total_lessons ?? 0}`)
    .text(`Lecciones perfectas: ${stats?.total_lessons_perfect ?? 0}`)
    .text(`Retos completados: ${stats?.total_challenges ?? 0}`)
    .text(`Quizzes completados: ${stats?.quizzes_completed ?? 0}`)
    .text(`Tiempo dedicado en el periodo: ${
      dailyStats.reduce((a: number, d: DailyUserStat) => a + d.time_spent_minutes, 0)
    } minutos`)
    .text(`Experiencia total: ${stats?.total_experience ?? 0}`)
    .text(`Puntos totales: ${stats?.total_points ?? 0}`);

  doc.moveDown();

  // Sección: Logros
  doc.fillColor("#000").fontSize(14).text("Logros alcanzados", { underline: true });
  doc.moveDown(0.5);
  achievements.forEach((e: EarnedAchievement) => {
    doc.fontSize(12).text(`• ${e.achievement.title}: ${e.achievement.description}`);
  });

  doc.moveDown(2);

  doc.fontSize(10).fillColor("#777").text(
    "Reporte generado automáticamente por el sistema Genios en Acción",
    { align: "center" }
  );

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(new Uint8Array(pdfBuffer));
    });
    doc.on("error", reject);
  });
};