const jwt = require("jsonwebtoken");


/**
 * Verifica que exista un JWT válido.
 */
function verificarToken(req, res, next) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        error:
          "No se proporcionó un token de autenticación."
      });
    }

    const partes =
      authorization.split(" ");

    if (
      partes.length !== 2 ||
      partes[0] !== "Bearer"
    ) {
      return res.status(401).json({
        error:
          "Formato de autorización inválido."
      });
    }

    const token = partes[1];

    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.admin = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      error:
        "Token inválido o expirado."
    });
  }
}


/**
 * Permite únicamente determinados sectores.
 */
function permitirSectores(...sectoresPermitidos) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        error:
          "Administrador no autenticado."
      });
    }

    if (
      !sectoresPermitidos.includes(
        req.admin.sector
      )
    ) {
      return res.status(403).json({
        error:
          "No tiene permisos para realizar esta operación."
      });
    }

    next();
  };
}


module.exports = {
  verificarToken,
  permitirSectores
};