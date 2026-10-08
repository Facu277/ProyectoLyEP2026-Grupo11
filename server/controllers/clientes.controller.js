const bcrypt = require("bcryptjs");

const {
  clienteToDocument,
  clienteToResponse,
  findAllClientes,
  findClienteById,
  findClienteByIdAdmin,
  getNextClienteId,
  insertCliente,
  replaceCliente,
  deactivateCliente
} = require("../models/cliente.model");


/**
 * GET /api/clientes
 */
async function getClientes(req, res, next) {
  try {
    const clientes = await findAllClientes();

    res.status(200).json({
      mensaje: "Lista de clientes obtenida correctamente",
      data: clientes.map(clienteToResponse)
    });
  } catch (error) {
    next(error);
  }
}


/**
 * GET /api/clientes/:id
 */
async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;

    const cliente = await findClienteById(id);

    if (!cliente) {
      return res.status(404).json({
        error: `No existe un cliente activo con ID ${id}`
      });
    }

    res.status(200).json({
      mensaje: "Cliente obtenido correctamente",
      data: clienteToResponse(cliente)
    });
  } catch (error) {
    next(error);
  }
}


/**
 * POST /api/clientes
 */
async function createCliente(req, res, next) {
  try {
    const datos = req.body;

    /**
     * Verificar email existente.
     */
    const clientesExistentes =
      await require("../models/cliente.model")
        .getClientesCollection()
        .find({
          $or: [
            {
              email: datos.email.toLowerCase()
            },
            {
              username: datos.username.toLowerCase()
            }
          ]
        })
        .toArray();

    if (clientesExistentes.length > 0) {
      return res.status(409).json({
        error:
          "Ya existe un cliente con ese email o username."
      });
    }

    /**
     * Generar ID.
     */
    const id = await getNextClienteId();

    /**
     * Hash de contraseña.
     *
     * 12 rondas de salt.
     */
    const passwordHash =
      await bcrypt.hash(datos.password, 12);

    /**
     * Normalizar datos.
     */
    const cliente = clienteToDocument({
      ...datos,

      id,

      email: datos.email.trim().toLowerCase(),

      username:
        datos.username.trim().toLowerCase(),

      phone:
        String(datos.phone)
          .replace(/[-\s]/g, ""),

      password: passwordHash,

      is_active: true,

      tipo: "CLIENTE"
    });

    const nuevoCliente =
      await insertCliente(cliente);

    res.status(201).json({
      mensaje: "Cliente creado exitosamente",
      data: clienteToResponse(nuevoCliente)
    });
  } catch (error) {
    next(error);
  }
}


/**
 * PUT /api/clientes/:id
 */
async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;

    const clienteExistente =
      await findClienteByIdAdmin(id);

    if (!clienteExistente) {
      return res.status(404).json({
        error: `No existe un cliente con ID ${id}`
      });
    }

    /**
     * No permitimos cambiar:
     * - id
     * - password
     * - is_active
     * - tipo
     */
    const datosActualizados = {
      ...clienteExistente,

      ...req.body,

      id: clienteExistente.id,

      password: clienteExistente.password,

      is_active: clienteExistente.is_active,

      tipo: "CLIENTE",

      name: {
        ...clienteExistente.name,
        ...(req.body.name || {})
      },

      address: {
        ...clienteExistente.address,
        ...(req.body.address || {})
      }
    };

    /**
     * Normalización.
     */
    datosActualizados.email =
      datosActualizados.email
        .trim()
        .toLowerCase();

    datosActualizados.username =
      datosActualizados.username
        .trim()
        .toLowerCase();

    datosActualizados.phone =
      String(datosActualizados.phone)
        .replace(/[-\s]/g, "");

    /**
     * Verificar email / username duplicado.
     */
    const duplicado =
      await require("../models/cliente.model")
        .getClientesCollection()
        .findOne({
          $or: [
            {
              email:
                datosActualizados.email
            },
            {
              username:
                datosActualizados.username
            }
          ],
          id: {
            $ne: Number(id)
          }
        });

    if (duplicado) {
      return res.status(409).json({
        error:
          "El email o username ya pertenece a otro cliente."
      });
    }

    const clienteActualizado =
      await replaceCliente(
        id,
        datosActualizados
      );

    res.status(200).json({
      mensaje:
        "Cliente actualizado correctamente",

      data:
        clienteToResponse(
          clienteActualizado
        )
    });
  } catch (error) {
    next(error);
  }
}


/**
 * PATCH /api/clientes/:id
 */
async function patchCliente(req, res, next) {
  try {
    const { id } = req.params;

    const clienteExistente =
      await findClienteByIdAdmin(id);

    if (!clienteExistente) {
      return res.status(404).json({
        error: `No existe un cliente con ID ${id}`
      });
    }

    /**
     * No permitimos modificaciones parciales
     * sobre estos campos.
     */
    const cambios = {
      ...req.body
    };

    delete cambios.id;
    delete cambios.password;
    delete cambios.is_active;
    delete cambios.tipo;

    if (cambios.email) {
      cambios.email =
        cambios.email
          .trim()
          .toLowerCase();
    }

    if (cambios.username) {
      cambios.username =
        cambios.username
          .trim()
          .toLowerCase();
    }

    if (cambios.phone) {
      cambios.phone =
        String(cambios.phone)
          .replace(/[-\s]/g, "");
    }

    const clienteActualizado =
      await require("../models/cliente.model")
        .getClientesCollection()
        .findOneAndUpdate(
          {
            id: Number(id)
          },
          {
            $set: {
              ...cambios,
              updatedAt: new Date()
            }
          },
          {
            returnDocument: "after"
          }
        );

    res.status(200).json({
      mensaje:
        "Cliente actualizado parcialmente con éxito",

      data:
        clienteToResponse(
          clienteActualizado
        )
    });
  } catch (error) {
    next(error);
  }
}


/**
 * DELETE /api/clientes/:id
 *
 * Baja lógica.
 */
async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;

    const cliente =
      await findClienteByIdAdmin(id);

    if (!cliente) {
      return res.status(404).json({
        error: `No existe un cliente con ID ${id}`
      });
    }

    if (!cliente.is_active) {
      return res.status(400).json({
        error: "El cliente ya se encuentra deshabilitado."
      });
    }

    const clienteDeshabilitado =
      await deactivateCliente(id);

    res.status(200).json({
      mensaje:
        `Cliente con ID ${id} deshabilitado correctamente`,

      data:
        clienteToResponse(
          clienteDeshabilitado
        )
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  patchCliente,
  deleteCliente
};