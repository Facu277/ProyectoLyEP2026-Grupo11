function validarCliente(cliente) {
  if (!cliente.email) {
    throw new Error("El email del cliente es obligatorio");
  }

  if (!cliente.username) {
    throw new Error("El username del cliente es obligatorio");
  }

  if (!cliente.name?.firstname || !cliente.name?.lastname) {
    throw new Error("El nombre y apellido del cliente son obligatorios");
  }

  if (!cliente.address?.city || !cliente.address?.street) {
    throw new Error("La dirección del cliente es obligatoria");
  }

  if (typeof cliente.is_active !== "boolean") {
    throw new Error("is_active debe ser booleano");
  }

  return true;
}

function clienteToDocument(cliente) {
  validarCliente(cliente);

  return {
    id: cliente.id,
    email: cliente.email,
    username: cliente.username,
    password: cliente.password,
    name: {
      firstname: cliente.name.firstname,
      lastname: cliente.name.lastname
    },
    phone: cliente.phone,
    address: {
      city: cliente.address.city,
      street: cliente.address.street,
      number: cliente.address.number,
      zipcode: cliente.address.zipcode
    },
    is_active: cliente.is_active,
    tipo: "CLIENTE"
  };
}

module.exports = {
  validarCliente,
  clienteToDocument
};