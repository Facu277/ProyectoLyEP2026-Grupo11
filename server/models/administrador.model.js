const { getDB } = require("../config/db");

const COLLECTION_NAME = "administradores";

function getAdministradoresCollection() {
  return getDB().collection(COLLECTION_NAME);
}

/**
 * Busca administrador por email.
 */
async function findAdministradorByEmail(email) {
  return await getAdministradoresCollection().findOne({
    email: email.trim().toLowerCase()
  });
}

/**
 * Busca administrador por ID.
 */
async function findAdministradorById(id) {
  return await getAdministradoresCollection().findOne({
    id: Number(id)
  });
}

/**
 * Convierte administrador para enviar al frontend.
 *
 * Nunca devuelve password.
 */
function administradorToResponse(admin) {
  if (!admin) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    username: admin.username,

    name: {
      firstname: admin.name.firstname,
      lastname: admin.name.lastname
    },

    phone: admin.phone,

    is_active: admin.is_active,

    tipo: "ADMINISTRADOR",

    sector: admin.sector
  };
}

module.exports = {
  getAdministradoresCollection,
  findAdministradorByEmail,
  findAdministradorById,
  administradorToResponse
};


const bcrypt = require("bcryptjs");

async function inicializarAdministradores() {
  const collection =
    getAdministradoresCollection();

  const cantidad =
    await collection.countDocuments();

  if (cantidad > 0) {
    return;
  }

  const passwordGerente =
    await bcrypt.hash(
      "Gerente#123",
      12
    );

  const passwordSoporte =
    await bcrypt.hash(
      "Soporte#123",
      12
    );

  const administradores = [
    {
      id: 1,
      email: "gerente1@empresa.com",
      username: "gerente1",

      password: passwordGerente,

      name: {
        firstname: "Gerente",
        lastname: "Uno"
      },

      phone: "3884000001",

      is_active: true,

      tipo: "ADMINISTRADOR",

      sector: "GERENTE"
    },

    {
      id: 2,
      email: "gerente2@empresa.com",
      username: "gerente2",

      password: passwordGerente,

      name: {
        firstname: "Gerente",
        lastname: "Dos"
      },

      phone: "3884000002",

      is_active: true,

      tipo: "ADMINISTRADOR",

      sector: "GERENTE"
    },

    {
      id: 3,
      email: "soporte1@empresa.com",
      username: "soporte1",

      password: passwordSoporte,

      name: {
        firstname: "Soporte",
        lastname: "Uno"
      },

      phone: "3884000003",

      is_active: true,

      tipo: "ADMINISTRADOR",

      sector: "SOPORTE"
    },

    {
      id: 4,
      email: "soporte2@empresa.com",
      username: "soporte2",

      password: passwordSoporte,

      name: {
        firstname: "Soporte",
        lastname: "Dos"
      },

      phone: "3884000004",

      is_active: true,

      tipo: "ADMINISTRADOR",

      sector: "SOPORTE"
    },

    {
      id: 5,
      email: "soporte3@empresa.com",
      username: "soporte3",

      password: passwordSoporte,

      name: {
        firstname: "Soporte",
        lastname: "Tres"
      },

      phone: "3884000005",

      is_active: true,

      tipo: "ADMINISTRADOR",

      sector: "SOPORTE"
    }
  ];

  await collection.insertMany(
    administradores
  );

  console.log(
    "Administradores iniciales creados"
  );
}