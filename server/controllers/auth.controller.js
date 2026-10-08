const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  findAdministradorByEmail,
  administradorToResponse
} = require("../models/administrador.model");


async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error:
          "El email y la contraseña son obligatorios."
      });
    }

    const administrador =
      await findAdministradorByEmail(email);

    if (!administrador) {
      return res.status(401).json({
        error:
          "Credenciales incorrectas."
      });
    }

    if (!administrador.is_active) {
      return res.status(403).json({
        error:
          "El administrador se encuentra deshabilitado."
      });
    }

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        administrador.password
      );

    if (!passwordCorrecta) {
      return res.status(401).json({
        error:
          "Credenciales incorrectas."
      });
    }

    if (
      !process.env.JWT_SECRET
    ) {
      throw new Error(
        "JWT_SECRET no está configurado."
      );
    }

    const token =
      jwt.sign(
        {
          id: administrador.id,
          email: administrador.email,
          sector: administrador.sector
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h"
        }
      );

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",

      token,

      administrador:
        administradorToResponse(
          administrador
        )
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  login
};