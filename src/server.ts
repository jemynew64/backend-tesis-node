import express from "express";
import cors from "cors";

import usersRoutes from "./modules/User/User.routes";
import authRoutes from "./modules/Auth/auth.routes";
import cursosRoutes from "./modules/Course/Course.routes";
import unidadesRoutes from "./modules/Unit/Unit.routes";
import leccionRoutes from "./modules/Lesson/Lesson.route";
import logroRoutes from "./modules/Achievement/Achievement.routes";
import retoRoutes from "./modules/Challenge/Challenge.routes";
import logroObtenidoRoutes from "./modules/EarnedAchievement/EarnedAchievement.route";
import opcionRetoRoutes from "./modules/ChallengeOption/ChallengeOption.routes";
import progresoLeccion from "./modules/LessonProgress/lessonProgress.routes";
import misionRoutes from "./modules/Mission/Mission.routes";
import misionUsuarioRoutes from "./modules/UserMission/UserMission.routes";
import excelRoutes from "./modules/ImportExcel/importExcel.routes";
import quizzRoutes from "./modules/quizz/Quiz.routes"
import StatsRoutes from "./modules/Stats/Stats.routes"
import unitProgressRoutes from "./modules/UnitProgress/UnitProgress.routes"
import shopRoutes from "./modules/shop/Shop.routes"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configuración dinámica de CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  ...((process.env.CORS_ORIGIN || "").split(",").map(o => o.trim())),
].filter(Boolean); // elimina undefined o falsy

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir peticiones sin origin (como Postman o curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ Origin not allowed by CORS: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};


app.use(cors(corsOptions));

// ✅ Rutas API
app.use("/api/misiones", misionRoutes);
app.use("/api/misionUsuarios", misionUsuarioRoutes);
app.use("/api/usuarios", usersRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api/lecciones", leccionRoutes);
app.use("/api/progresoLeccion", progresoLeccion);
app.use("/api/logros", logroRoutes);
app.use("/api/logroObtenido", logroObtenidoRoutes);
app.use("/api/opcionReto", opcionRetoRoutes);
app.use("/api/reto", retoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/quizzpoints", quizzRoutes);
app.use("/api/stats", StatsRoutes);
app.use("/api/unitprogress", unitProgressRoutes);
app.use("/api/shop", shopRoutes);

// ✅ Servidor
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔐 CORS enabled for origin: ${process.env.CORS_ORIGIN}`);
});
