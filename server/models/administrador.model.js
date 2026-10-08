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