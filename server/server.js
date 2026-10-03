const express = require("express");

const app = express();

const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor ProyectoLyEP2026 funcionando",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});