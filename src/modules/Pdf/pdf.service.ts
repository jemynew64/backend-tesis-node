import { prisma } from "../../database/prismaClient";
import puppeteer from "puppeteer";

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
      earned_achievement: {
        include: {
          achievement: true,
        },
      },
      daily_user_stats: {
        where: {
          date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const stats = user.user_general_stats;
  const dailyStats = user.daily_user_stats;
  const achievements = user.earned_achievement;

  const htmlContent = `
<html>
<head>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #f5f5fc;
      color: #333;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    .logo {
      width: 90px;
      height: auto;
    }

    h1 {
      font-size: 24px;
      color: #4A00E0;
      text-align: left;
      max-width: 80%;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      padding: 24px;
      margin-bottom: 30px;
    }

    .card h3 {
      font-size: 18px;
      color: #4A00E0;
      margin-bottom: 10px;
      border-bottom: 2px solid #eee;
      padding-bottom: 6px;
    }

    .card ul {
      list-style-type: disc;
      padding-left: 20px;
      margin-top: 10px;
    }

    .card li {
      margin-bottom: 6px;
      font-size: 14px;
    }

    .card strong {
      color: #333;
    }

    .info-line {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      margin-top: 40px;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>GENIOS EN ACCIÓN - REPORTE DE PROGRESO</h1>
    <img src="https://res.cloudinary.com/dkbydlqen/image/upload/v1748983331/iconodemarca-sinfondo_vahgnz.png" class="logo" />
  </div>

  <div class="card">
    <h3>Datos generales</h3>
    <div class="info-line"><strong>Usuario:</strong> ${user.name}</div>
    <div class="info-line"><strong>Correo:</strong> ${user.email}</div>
    <div class="info-line"><strong>Nivel actual:</strong> ${user.level} (${user.experience} EXP)</div>
    <div class="info-line"><strong>Corazones restantes:</strong> ${user.hearts}</div>
    <div class="info-line"><strong>Periodo evaluado:</strong> ${from} - ${to}</div>
  </div>

  <div class="card">
    <h3>Resumen general</h3>
    <ul>
      <li>Lecciones completadas: ${stats?.total_lessons ?? 0}</li>
      <li>Lecciones perfectas: ${stats?.total_lessons_perfect ?? 0}</li>
      <li>Retos completados: ${stats?.total_challenges ?? 0}</li>
      <li>Quizzes completados: ${stats?.quizzes_completed ?? 0}</li>
      <li>Tiempo dedicado en el periodo: ${dailyStats.reduce(
        (a: number, d: DailyUserStat) => a + d.time_spent_minutes,
        0
      )} minutos</li>
      <li>Experiencia total: ${stats?.total_experience ?? 0}</li>
      <li>Puntos totales: ${stats?.total_points ?? 0}</li>
    </ul>
  </div>

  <div class="card">
    <h3>Logros alcanzados</h3>
    <ul>
      ${achievements
        .map(
          (e: EarnedAchievement) =>
            `<li><strong>${e.achievement.title}:</strong> ${e.achievement.description}</li>`
        )
        .join("")}
    </ul>
  </div>

  <div class="footer">
    Reporte generado automáticamente por el sistema <strong>Genios en Acción</strong>
  </div>

</body>
</html>
`;

  let browser;

  if (process.env.NODE_ENV === "production") {
    const chromium = await import("@sparticuz/chromium");
    browser = await puppeteer.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  console.log("Tamaño del PDF generado:", pdfBuffer.length);
  return pdfBuffer;
};
