const express = require("express");

const {
    login,
    obtenerEstadisticas
} = require("../controllers/auth.controller");

const {
    verificarToken,
    permitirSectores
} = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);

router.get(
    "/estadisticas",
    verificarToken,
    permitirSectores("GERENTE", "SOPORTE"),
    obtenerEstadisticas
);

module.exports = router;
