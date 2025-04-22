import express from "express";
import cors from "cors"

import usersRoutes from "./modules/User/User.routes"
 import authRoutes from "./modules/Auth/auth.routes"
 import cursosRoutes from "./modules/Course/Course.routes"
 import unidadesRoutes from "./modules/Unit/Unit.routes"
 import leccionRoutes from "./modules/Lesson/Lesson.route"
 import logroRoutes from "./modules/Achievement/Achievement.routes"
 import retoRoutes from "./modules/Challenge/Challenge.routes"
 import logroObtenidoRoutes from "./modules/EarnedAchievement/EarnedAchievement.route"
 import opcionRetoRoutes from "./modules/ChallengeOption/ChallengeOption.routes"
 import progresoLeccion from "./modules/LessonProgress/lessonProgress.routes"
 import misionRoutes from "./modules/Mission/Mission.routes"
 import misionUsuarioRoutes from "./modules/UserMission/UserMission.routes"
 import excelRoutes from "./modules/ImportExcel/importExcel.routes"
const app = express();

app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencod

app.use(
  cors({
    origin: [
      "http://localhost:5173",    // Desarrollo local
      "http://frontend:5173",     // Frontend en Docker
      "http://localhost:3000"     // Backend (por si acaso)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


// Routes 9 echas
  app.use("/api/misiones",misionRoutes );
  app.use("/api/misionUsuarios", misionUsuarioRoutes);
  app.use("/api/usuarios",usersRoutes );
  app.use("/api/cursos",cursosRoutes );
  app.use("/api/unidades",unidadesRoutes );
  app.use("/api/lecciones",leccionRoutes );
  app.use("/api/progresoLeccion",progresoLeccion );
  app.use("/api/logros",logroRoutes );
  app.use("/api/logroObtenido",logroObtenidoRoutes );
  app.use("/api/opcionReto",opcionRetoRoutes );
  app.use("/api/reto",retoRoutes );
  app.use("/api/auth", authRoutes);
  app.use("/api/excel", excelRoutes);
 
  const PORT = Number(process.env.PORT) || 3000;  // Convierte el valor a número
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`CORS enabled for origin: ${process.env.CORS_ORIGIN}`);
  });
  
  