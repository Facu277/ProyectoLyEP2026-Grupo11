const express = require("express");
const { validarDatosCliente } = require("../middleware/validateCliente");
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  patchCliente,
  deleteCliente
} = require("../controllers/clientes.controller");

const router = express.Router();

// Rutas de lectura
router.get("/", getClientes);
router.get("/:id", getClienteById);

// Rutas de escritura con middleware de validación
router.post("/", validarDatosCliente, createCliente);
router.put("/:id", validarDatosCliente, updateCliente);
router.patch("/:id", validarDatosCliente, patchCliente);
router.delete("/:id", deleteCliente);

module.exports = router;