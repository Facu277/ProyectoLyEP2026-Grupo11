function validarDatosCliente(req, res, next) {
  const cliente = req.body || {};
  const errores = [];

  if (!cliente.email) {
    errores.push("El email es obligatorio");
  }

  if (!cliente.username) {
    errores.push("El username es obligatorio");
  }

  if (!cliente.name?.firstname) {
    errores.push("El nombre es obligatorio");
  }

  if (!cliente.name?.lastname) {
    errores.push("El apellido es obligatorio");
  }

  if (!cliente.address?.city) {
    errores.push("La ciudad es obligatoria");
  }

  if (!cliente.address?.street) {
    errores.push("La calle es obligatoria");
  }

  if (
    cliente.is_active !== undefined &&
    typeof cliente.is_active !== "boolean"
  ) {
    errores.push("is_active debe ser booleano");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Datos de cliente inválidos",
      detalles: errores
    });
  }

  next();
}

module.exports = { validarDatosCliente };