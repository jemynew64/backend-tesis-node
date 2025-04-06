import express from "express";
import cors from "cors"
import usersRoutes from "./routes/usuario.routes"
import authRoutes from "./routes/auth.routes"
import cursosRoutes from "./routes/curso.routes"
import unidadesRoutes from "./routes/unidad.routes"
import leccionRoutes from "./routes/leccion.route"
import logroRoutes from "./routes/logro.routes"
import retoRoutes from "./routes/reto.routes"
import logroObtenidoRoutes from "./routes/logroObtenido.route"
import opcionRetoRoutes from "./routes/opcionReto.route"
import misionRoutes from "./routes/mision.routes"
import misionUsuarioRoutes from "./routes/misionUsuario.routes"
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
 app.use("/api/logros",logroRoutes );
 app.use("/api/logroObtenido",logroObtenidoRoutes );
 app.use("/api/opcionReto",opcionRetoRoutes );
 app.use("/api/reto",retoRoutes );
 app.use("/api/auth", authRoutes);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
