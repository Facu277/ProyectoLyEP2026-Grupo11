require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const clientesRouter = require("./routes/clientes.routes");
const authRouter = require("./routes/auth.routes");
const { errorHandler } = require("./middleware/errorHandler");

// IMPORTANTE: verificá que esta ruta exista en tu proyecto.
const { inicializarAdministradores } = require("./config/inicializarAdministradores");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // Agregá aquí el dominio de Vercel cuando lo tengas.
    ],
  })
);

app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor ProyectoLyEP2026 funcionando",
  });
});

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/clientes", clientesRouter);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
async function iniciarServidor() {
  try {
    await connectDB();
    await inicializarAdministradores();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
