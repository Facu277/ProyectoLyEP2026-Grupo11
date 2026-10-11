const { getDB } = require("../config/db");

const COLLECTION_NAME = "clientes";

/**
 * Obtiene la colección de clientes.
 */
function getClientesCollection() {
  return getDB().collection(COLLECTION_NAME);
}

/**
 * Valida la estructura básica de un cliente.
 *
 * La validación completa de los campos se realiza
 * también desde el middleware.
 */
function validarCliente(cliente) {
  if (!cliente.email) {
    throw new Error("El email del cliente es obligatorio");
  }

  if (!cliente.username) {
    throw new Error("El username del cliente es obligatorio");
  }

  if (!cliente.name?.firstname || !cliente.name?.lastname) {
    throw new Error(
      "El nombre y apellido del cliente son obligatorios"
    );
  }

  if (!cliente.address?.city || !cliente.address?.street) {
    throw new Error(
      "La dirección del cliente es obligatoria"
    );
  }

  if (typeof cliente.is_active !== "boolean") {
    throw new Error("is_active debe ser booleano");
  }

  return true;
}

/**
 * Convierte los datos recibidos del frontend
 * en un documento MongoDB.
 *
 * La contraseña se recibe ya procesada por el controller.
 */
function clienteToDocument(cliente) {
  validarCliente(cliente);

  return {
    id: Number(cliente.id),

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
      number: Number(cliente.address.number),
      zipcode: cliente.address.zipcode
    },

    is_active: cliente.is_active,

    tipo: "CLIENTE",

    createdAt: cliente.createdAt || new Date(),
    updatedAt: new Date()
  };
}

/**
 * Documento para enviar al frontend.
 *
 * IMPORTANTE:
 * Nunca devuelve password.
 */
function clienteToResponse(cliente) {
  if (!cliente) {
    return null;
  }

  return {
    id: cliente.id,
    email: cliente.email,
    username: cliente.username,

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

/**
 * Obtiene todos los clientes activos.
 *
 * El frontend anterior trabajaba con los clientes
 * activos en sus listados.
 */
async function findAllClientes() {
  const clientes = await getClientesCollection()
    .find({
      is_active: true
    })
    .sort({
      id: 1
    })
    .toArray();

  return clientes;
}

/**
 * Busca un cliente activo por ID.
 */
async function findClienteById(id) {
  const cliente = await getClientesCollection().findOne({
    id: Number(id),
    is_active: true
  });

  return cliente;
}

/**
 * Busca un cliente independientemente de su estado.
 *
 * Se utiliza para operaciones administrativas como
 * actualización y baja lógica.
 */
async function findClienteByIdAdmin(id) {
  return await getClientesCollection().findOne({
    id: Number(id)
  });
}

/**
 * Genera el siguiente ID numérico.
 *
 * Se mantiene este sistema porque el frontend actual
 * trabaja con IDs numéricos.
 */
async function getNextClienteId() {
  const ultimoCliente = await getClientesCollection()
    .find({})
    .sort({
      id: -1
    })
    .limit(1)
    .next();

  if (!ultimoCliente) {
    return 1;
  }

  return Number(ultimoCliente.id) + 1;
}

/**
 * Inserta un cliente.
 */
async function insertCliente(cliente) {
  const result = await getClientesCollection().insertOne(
    cliente
  );

  return {
    ...cliente,
    _id: result.insertedId
  };
}

/**
 * Actualiza completamente los datos permitidos
 * de un cliente.
 */
async function replaceCliente(id, datos) {
  const result = await getClientesCollection().findOneAndUpdate(
    {
      id: Number(id)
    },
    {
      $set: {
        email: datos.email,
        username: datos.username,

        name: {
          firstname: datos.name.firstname,
          lastname: datos.name.lastname
        },

        phone: datos.phone,

        address: {
          city: datos.address.city,
          street: datos.address.street,
          number: Number(datos.address.number),
          zipcode: datos.address.zipcode
        },

        updatedAt: new Date()
      }
    },
    {
      returnDocument: "after"
    }
  );

  return result;
}

/**
 * Actualización parcial.
 */
async function updateClienteParcial(id, cambios) {
  const update = {
    ...cambios,
    updatedAt: new Date()
  };

  delete update.id;
  delete update.password;
  delete update.tipo;
  delete update.is_active;

  const result = await getClientesCollection().findOneAndUpdate(
    {
      id: Number(id)
    },
    {
      $set: update
    },
    {
      returnDocument: "after"
    }
  );

  return result;
}

/**
 * Baja lógica.
 *
 * NO elimina físicamente el documento.
 */
async function deactivateCliente(id) {
  const result = await getClientesCollection().findOneAndUpdate(
    {
      id: Number(id)
    },
    {
      $set: {
        is_active: false,
        updatedAt: new Date()
      }
    },
    {
      returnDocument: "after"
    }
  );

  return result;
}

module.exports = {
  getClientesCollection,
  validarCliente,
  clienteToDocument,
  clienteToResponse,
  findAllClientes,
  findClienteById,
  findClienteByIdAdmin,
  getNextClienteId,
  insertCliente,
  replaceCliente,
  updateClienteParcial,
  deactivateCliente
};