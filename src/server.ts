import express from "express";
import cors from "cors"
import usersRoutes from "./routes/usuario.routes"
import authRoutes from "./routes/auth.routes"

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
 app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
