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
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

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
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
