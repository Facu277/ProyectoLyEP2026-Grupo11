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


const router =
  express.Router();


/**
 * Todas las operaciones de clientes
 * requieren administrador autenticado.
 */
router.use(
  verificarToken
);


/**
 * GET /api/clientes
 *
 * GERENTE y SOPORTE.
 */
router.get(
  "/",
  permitirSectores(
    "GERENTE",
    "SOPORTE"
  ),
  getClientes
);


/**
 * GET /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 */
router.get(
  "/:id",
  permitirSectores(
    "GERENTE",
    "SOPORTE"
  ),
  getClienteById
);


/**
 * POST /api/clientes
 *
 * GERENTE y SOPORTE.
 */
router.post(
  "/",
  permitirSectores(
    "GERENTE",
    "SOPORTE"
  ),
  validarDatosCliente,
  createCliente
);


/**
 * PUT /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 */
router.put(
  "/:id",
  permitirSectores(
    "GERENTE",
    "SOPORTE"
  ),
  validarDatosClienteUpdate,
  updateCliente
);


/**
 * PATCH /api/clientes/:id
 *
 * GERENTE y SOPORTE.
 */
router.patch(
  "/:id",
  permitirSectores(
    "GERENTE",
    "SOPORTE"
  ),
  patchCliente
);


/**
 * DELETE /api/clientes/:id
 *
 * SOLO GERENTE.
 *
 * Es una baja lógica.
 */
router.delete(
  "/:id",
  permitirSectores(
    "GERENTE"
  ),
  deleteCliente
);


module.exports = router;