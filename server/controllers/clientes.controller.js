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
    if (!id) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json({
      mensaje: "Cliente obtenido correctamente",
      data: { id }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getClientes,
  getClienteById
};
