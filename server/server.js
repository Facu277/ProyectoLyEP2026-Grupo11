const express = require("express");
const cors = require("cors"); 
const { connectDB } = require("./config/db");
const clientesRouter = require("./routes/clientes.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.use("/api/clientes", clientesRouter);

app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor ProyectoLyEP2026 funcionando",
  });
});


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