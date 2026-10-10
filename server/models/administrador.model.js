const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");

const COLLECTION_NAME = "administradores";

/**
 * Obtiene la colección de administradores.
 */
function getAdministradoresCollection() {
  return getDB().collection(COLLECTION_NAME);
}

/**
 * Busca un administrador por email.
 *
 * El email se normaliza a minúsculas.
 */
async function findAdministradorByEmail(email) {
  return await getAdministradoresCollection().findOne({
    email: email.trim().toLowerCase()
  });
}

/**
 * Busca un administrador por ID.
 */
async function findAdministradorById(id) {
  return await getAdministradoresCollection().findOne({
    id: Number(id)
  });
}

/**
 * Convierte un administrador a un objeto seguro
 * para enviar al frontend.
 *
 * IMPORTANTE:
 * La contraseña nunca se devuelve.
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


/**
 * Inicializa los administradores del sistema.
 *
 * Si la colección ya contiene administradores,
 * no vuelve a crearlos.
 *
 * Las contraseñas se almacenan mediante bcrypt.
 */
async function inicializarAdministradores() {
  const collection =
    getAdministradoresCollection();

  /**
   * Verificamos si ya existen administradores.
   */
  const cantidad =
    await collection.countDocuments();

  if (cantidad > 0) {
    console.log(
      "Los administradores ya existen en MongoDB"
    );

    return;
  }

  /**
   * ==========================================
   * HASH DE CONTRASEÑAS
   * ==========================================
   *
   * bcrypt utiliza un salt y genera un hash
   * irreversible.
   *
   * Las contraseñas originales NO se almacenan
   * en MongoDB.
   */
  const passwordGerente =
    await bcrypt.hash(
      "gerente123",
      12
    );

  const passwordSoporte =
    await bcrypt.hash(
      "soporte123",
      12
    );


  /**
   * ==========================================
   * ADMINISTRADORES INICIALES
   * ==========================================
   */
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


  /**
   * ==========================================
   * CREAR ADMINISTRADORES
   * ==========================================
   */
  await collection.insertMany(
    administradores
  );


  console.log(
    "Administradores iniciales creados correctamente"
  );
}

/**
 * Cuenta administradores activos por sector.
 */
async function contarAdministradoresActivosPorSector() {
    const collection = getAdministradoresCollection();

    const [gerentes, soportes, administradores] = await Promise.all([
        collection.countDocuments({
            sector: "GERENTE",
            is_active: true
        }),

        collection.countDocuments({
            sector: "SOPORTE",
            is_active: true
        }),

        collection.countDocuments({
            sector: { $in: ["GERENTE", "SOPORTE"] },
            is_active: true
        })
    ]);

    return {
        administradores,
        gerentes,
        soportes
    };
}


/**
 * ==========================================
 * EXPORTACIONES
 * ==========================================
 */
module.exports = {
    getAdministradoresCollection,
    findAdministradorByEmail,
    findAdministradorById,
    administradorToResponse,
    inicializarAdministradores,
    contarAdministradoresActivosPorSector
};