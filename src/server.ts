import express from "express";
import cors from "cors"
import usersRoutes from "./modules/Usuario/usuario.routes"
import authRoutes from "./modules/Auth/auth.routes"
import cursosRoutes from "./modules/Curso/curso.routes"
import unidadesRoutes from "./modules/Unidad/unidad.routes"
import leccionRoutes from "./modules/Leccion/leccion.route"
import logroRoutes from "./modules/Logro/logro.routes"
import retoRoutes from "./modules/Reto/reto.routes"
import logroObtenidoRoutes from "./modules/LogroObtenido/logroObtenido.route"
import opcionRetoRoutes from "./modules/OpcionReto/opcionReto.route"
import misionRoutes from "./modules/Mision/mision.routes"
import misionUsuarioRoutes from "./modules/MisionUsuario/misionUsuario.routes"
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
