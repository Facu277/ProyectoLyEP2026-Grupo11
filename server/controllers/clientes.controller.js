const { clienteToDocument } = require("../models/cliente.model");

// GET /api/clientes - Obtener la lista de clientes
async function getClientes(req, res, next) {
  try {
    res.status(200).json({
      mensaje: "Lista de clientes obtenida correctamente",
      data: []
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/clientes/:id - Obtener cliente por ID
async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;
    res.status(200).json({
      mensaje: "Cliente obtenido correctamente",
      data: { id }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/clientes - Crear cliente
async function createCliente(req, res, next) {
  try {
    const clienteDoc = clienteToDocument(req.body);
    res.status(201).json({
      mensaje: "Cliente creado exitosamente",
      data: clienteDoc
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/clientes/:id - Actualizar cliente
async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;
    const clienteDoc = clienteToDocument({ ...req.body, id });
    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      data: clienteDoc
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/clientes/:id - Eliminar cliente
async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;
    res.status(200).json({
      mensaje: `Cliente con ID ${id} eliminado correctamente`
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
  deleteCliente
};
