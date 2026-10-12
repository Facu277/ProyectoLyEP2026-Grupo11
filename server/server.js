require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const authRouter = require("./routes/auth.routes");
const clientesRouter = require("./routes/clientes.routes");
const { errorHandler } = require("./middleware/errorHandler");
const { inicializarAdministradores } = require("./models/administrador.model");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor ProyectoLyEP2026 funcionando" });
});

app.use("/api/auth", authRouter);
app.use("/api/clientes", clientesRouter);

app.use(errorHandler);

async function iniciarServidor() {
  try {
    await connectDB();
    await inicializarAdministradores();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
