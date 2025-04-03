import express from "express";
import cors from "cors"
import usersRoutes from "./routes/usuario.routes"
import authRoutes from "./routes/auth.routes"
import cursosRoutes from "./routes/curso.routes"
import unidadesRoutes from "./routes/unidad.routes"
import leccionRoutes from "./routes/leccion.route"

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
 app.use("/api/usuarios",usersRoutes );
 app.use("/api/cursos",cursosRoutes );
 app.use("/api/unidades",unidadesRoutes );
 app.use("/api/lecciones",leccionRoutes );
 app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
