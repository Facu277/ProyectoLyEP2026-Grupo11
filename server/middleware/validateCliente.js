const LIMITES_CLIENTE = {
  firstname: {
    min: 2,
    max: 50
  },

  lastname: {
    min: 2,
    max: 50
  },

  username: {
    min: 3,
    max: 24
  },

  email: {
    max: 100
  },

  password: {
    min: 8,
    max: 20
  },

  phone: {
    min: 7,
    max: 15
  },

  city: {
    min: 2,
    max: 80
  },

  street: {
    min: 2,
    max: 100
  },

  number: {
    min: 1,
    max: 999999
  },

  zipcode: {
    min: 3,
    max: 12
  }
};

function validarPassword(password) {
  if (typeof password !== "string") {
    return false;
  }

  if (
    password.length <
      LIMITES_CLIENTE.password.min ||
    password.length >
      LIMITES_CLIENTE.password.max
  ) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  if (
    !/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~\-]/.test(
      password
    )
  ) {
    return false;
  }

  if (/\s/.test(password)) {
    return false;
  }

  return true;
}

/**
 * Validación para CREATE.
 */
function validarDatosCliente(req, res, next) {
  const cliente = req.body || {};

  const errores = [];

  validarCamposCliente(cliente, errores, true);

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Datos de cliente inválidos",
      detalles: errores
    });
  }

  next();
}

/**
 * Validación para UPDATE.
 *
 * La contraseña NO se valida porque el update
 * conserva la contraseña existente.
 */
function validarDatosClienteUpdate(req, res, next) {
  const cliente = req.body || {};

  const errores = [];

  validarCamposCliente(cliente, errores, false);

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Datos de cliente inválidos",
      detalles: errores
    });
  }

  next();
}

function validarCamposCliente(
  cliente,
  errores,
  validarPasswordCliente
) {
  if (!cliente.email) {
    errores.push("El correo electrónico es obligatorio.");
  } else if (
    typeof cliente.email !== "string" ||
    cliente.email.length > LIMITES_CLIENTE.email.max
  ) {
    errores.push(
      "El correo electrónico no puede superar los 100 caracteres."
    );
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      cliente.email
    )
  ) {
    errores.push(
      "El correo electrónico no es válido."
    );
  }

  if (!cliente.username) {
    errores.push(
      "El nombre de usuario es obligatorio."
    );
  } else if (
    cliente.username.length <
      LIMITES_CLIENTE.username.min ||
    cliente.username.length >
      LIMITES_CLIENTE.username.max
  ) {
    errores.push(
      "El usuario debe tener entre 3 y 24 caracteres."
    );
  } else if (!/^[a-z0-9._]+$/.test(cliente.username)) {
    errores.push(
      "El usuario solo puede contener letras minúsculas, números, puntos y guion bajo."
    );
  }

  if (!cliente.name?.firstname) {
    errores.push("El nombre es obligatorio.");
  } else if (
    cliente.name.firstname.length <
      LIMITES_CLIENTE.firstname.min ||
    cliente.name.firstname.length >
      LIMITES_CLIENTE.firstname.max
  ) {
    errores.push(
      "El nombre debe tener entre 2 y 50 caracteres."
    );
  } else if (
    !/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u.test(
      cliente.name.firstname
    )
  ) {
    errores.push(
      "El nombre contiene caracteres no permitidos."
    );
  }

  if (!cliente.name?.lastname) {
    errores.push("El apellido es obligatorio.");
  } else if (
    cliente.name.lastname.length <
      LIMITES_CLIENTE.lastname.min ||
    cliente.name.lastname.length >
      LIMITES_CLIENTE.lastname.max
  ) {
    errores.push(
      "El apellido debe tener entre 2 y 50 caracteres."
    );
  } else if (
    !/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u.test(
      cliente.name.lastname
    )
  ) {
    errores.push(
      "El apellido contiene caracteres no permitidos."
    );
  }

  if (!cliente.phone) {
    errores.push("El teléfono es obligatorio.");
  } else {
    const telefono = String(cliente.phone)
      .replace(/[-\s]/g, "");

    if (
      !new RegExp(
        `^[0-9]{${LIMITES_CLIENTE.phone.min},${LIMITES_CLIENTE.phone.max}}$`
      ).test(telefono)
    ) {
      errores.push(
        "El teléfono debe contener entre 7 y 15 números."
      );
    }
  }

  if (validarPasswordCliente) {
    if (!cliente.password) {
      errores.push("La contraseña es obligatoria.");
    } else if (!validarPassword(cliente.password)) {
      errores.push(
        "La contraseña debe tener entre 8 y 20 caracteres e incluir mayúscula, minúscula, número y símbolo, sin espacios."
      );
    }
  }

  if (!cliente.address?.city) {
    errores.push("La ciudad es obligatoria.");
  } else if (
    cliente.address.city.length <
      LIMITES_CLIENTE.city.min ||
    cliente.address.city.length >
      LIMITES_CLIENTE.city.max
  ) {
    errores.push(
      "La ciudad debe tener entre 2 y 80 caracteres."
    );
  }

  if (!cliente.address?.street) {
    errores.push("La calle es obligatoria.");
  } else if (
    cliente.address.street.length <
      LIMITES_CLIENTE.street.min ||
    cliente.address.street.length >
      LIMITES_CLIENTE.street.max
  ) {
    errores.push(
      "La calle debe tener entre 2 y 100 caracteres."
    );
  }

  const numero = Number(cliente.address?.number);

  if (
    !Number.isInteger(numero) ||
    numero < LIMITES_CLIENTE.number.min ||
    numero > LIMITES_CLIENTE.number.max
  ) {
    errores.push(
      "El número debe ser un entero entre 1 y 999999."
    );
  }

  if (!cliente.address?.zipcode) {
    errores.push(
      "El código postal es obligatorio."
    );
  } else if (
    cliente.address.zipcode.length <
      LIMITES_CLIENTE.zipcode.min ||
    cliente.address.zipcode.length >
      LIMITES_CLIENTE.zipcode.max
  ) {
    errores.push(
      "El código postal debe tener entre 3 y 12 caracteres."
    );
  }

  if (
    cliente.is_active !== undefined &&
    typeof cliente.is_active !== "boolean"
  ) {
    errores.push("is_active debe ser booleano.");
  }
}

module.exports = {
  validarDatosCliente,
  validarDatosClienteUpdate,
  validarPassword
};