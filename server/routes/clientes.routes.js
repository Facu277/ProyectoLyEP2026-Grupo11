const express = require("express");

const {
  validarDatosCliente,
  validarDatosClienteUpdate
} = require("../middleware/validateCliente");

const {
  verificarToken,
  permitirSectores
} = require("../middleware/auth");

const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  patchCliente,
  deleteCliente
} = require("../controllers/clientes.controller");

const router = express.Router();

/**
 * GET /api/clientes
 *
 * GERENTE y SOPORTE.
 * Requiere autenticación.
 */
router.get(
  "/",
  verificarToken,
  permitirSectores("GERENTE", "SOPORTE"),
  getClientes
);

/**
 * GET /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 * Requiere autenticación.
 */
router.get(
  "/:id",
  verificarToken,
  permitirSectores("GERENTE", "SOPORTE"),
  getClienteById
);

/**
 * POST /api/clientes
 *
 * REGISTRO PÚBLICO.
 * No requiere token ni sesión de administrador.
 * Los datos siguen siendo validados por el backend.
 */
router.post(
  "/",
  validarDatosCliente,
  createCliente
);

/**
 * PUT /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 * Requiere autenticación.
 */
router.put(
  "/:id",
  verificarToken,
  permitirSectores("GERENTE", "SOPORTE"),
  validarDatosClienteUpdate,
  updateCliente
);

/**
 * PATCH /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 * Requiere autenticación.
 */
router.patch(
  "/:id",
  verificarToken,
  permitirSectores("GERENTE", "SOPORTE"),
  patchCliente
);

/**
 * DELETE /api/clientes/:id
 *
 * Solo GERENTE.
 * Requiere autenticación.
 * Realiza una baja lógica.
 */
router.delete(
  "/:id",
  verificarToken,
  permitirSectores("GERENTE"),
  deleteCliente
);

module.exports = router;