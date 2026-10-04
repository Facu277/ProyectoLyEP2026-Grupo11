const express = require("express");
const { validarDatosCliente } = require("../middleware/validateCliente");

const router = express.Router();

// Rutas preparadas para la implementación del miércoles.
router.get("/", (req, res) => {
  res.status(501).json({
    mensaje: "Listado de clientes pendiente de implementación"
  });
});

router.get("/:id", (req, res) => {
  res.status(501).json({
    mensaje: "Consulta de cliente pendiente de implementación"
  });
});

router.post("/", validarDatosCliente, (req, res) => {
  res.status(501).json({
    mensaje: "Creación de cliente pendiente de implementación"
  });
});

router.put("/:id", validarDatosCliente, (req, res) => {
  res.status(501).json({
    mensaje: "Actualización de cliente pendiente de implementación"
  });
});

router.patch("/:id", validarDatosCliente, (req, res) => {
  res.status(501).json({
    mensaje: "Actualización parcial de cliente pendiente de implementación"
  });
});

router.delete("/:id", (req, res) => {
  res.status(501).json({
    mensaje: "Eliminación de cliente pendiente de implementación"
  });
});

module.exports = router;