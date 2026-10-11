const express = require("express");
const cors = require("cors"); 
const { connectDB } = require("./config/db");
const clientesRouter = require("./routes/clientes.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 
app.use(cors()); 
app.use(express.json());

// Router de clientes
app.use("/api/clientes", clientesRouter);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor ProyectoLyEP2026 funcionando",
  });
});

// Manejo general de errores
app.use(errorHandler);

async function iniciarServidor() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
