const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {
  connectDB
} = require("./config/db");

const {
  inicializarAdministradores
} = require("./models/administrador.model");

const clientesRouter =
  require("./routes/clientes.routes");

const authRouter =
  require("./routes/auth.routes");

const {
  errorHandler
} = require("./middleware/errorHandler");


dotenv.config();


const app =
  express();

const PORT =
  process.env.PORT || 3001;


/**
 * Middlewares
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ]
  })
);

app.use(
  express.json()
);


/**
 * Ruta principal.
 */
app.get(
  "/",
  (req, res) => {
    res.json({
      mensaje:
        "Servidor ProyectoLyEP2026 funcionando"
    });
  }
);


/**
 * Autenticación.
 */
app.use(
  "/api/auth",
  authRouter
);


/**
 * Clientes.
 */
app.use(
  "/api/clientes",
  clientesRouter
);


/**
 * Error handler.
 */
app.use(
  errorHandler
);


/**
 * Iniciar servidor.
 */
async function iniciarServidor() {
  try {
    await connectDB();

    await inicializarAdministradores();

    app.listen(
      PORT,
      () => {
        console.log(
          `Servidor ejecutándose en http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor:",
      error.message
    );

    process.exit(1);
  }
}


iniciarServidor();