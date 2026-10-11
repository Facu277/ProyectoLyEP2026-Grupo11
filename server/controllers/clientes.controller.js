const { connectDB } = require("../config/db");
const { clienteToDocument } = require("../models/cliente.model");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// GET /api/clientes -> Listar solo los clientes activos (is_active: true)
async function getClientes(req, res, next) {
  try {
    const db = await connectDB();
    const clientes = await db.collection("clientes").find({ is_active: true }).toArray();

    res.status(200).json({
      mensaje: "Lista de clientes obtenida correctamente desde MongoDB Atlas",
      data: clientes
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/clientes/:id -> Obtener cliente específico activo
async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    
    const cliente = await db.collection("clientes").findOne({ id: Number(id), is_active: true });

    if (!cliente) {
      return res.status(404).json({ error: `No se encontró el cliente activo con ID ${id}` });
    }

    res.status(200).json({
      mensaje: "Cliente obtenido correctamente",
      data: cliente
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/clientes -> Crear cliente con contraseña encriptada
async function createCliente(req, res, next) {
  try {
    const db = await connectDB();
    const nuevoCliente = req.body;

    // 1. Validar la estructura requerida del modelo de Flor
    clienteToDocument(nuevoCliente);

    // 2. Encriptar contraseña del Cliente
    if (nuevoCliente.password) {
      nuevoCliente.password = await bcrypt.hash(nuevoCliente.password, SALT_ROUNDS);
    } else {
      return res.status(400).json({ error: "La contraseña es obligatoria" });
    }

    // 3. Generar ID incremental dinámico consultando la DB
    const ultimo = await db.collection("clientes").find().sort({ id: -1 }).limit(1).toArray();
    nuevoCliente.id = ultimo.length > 0 ? ultimo[0].id + 1 : 1;
    nuevoCliente.is_active = true;

    // 4. Guardar en MongoDB Atlas
    await db.collection("clientes").insertOne(nuevoCliente);

    // Ocultar password en la respuesta por seguridad corporativa
    const { password, ...respuestaSegura } = nuevoCliente;

    res.status(201).json({
      mensaje: "Cliente creado exitosamente en MongoDB Atlas",
      data: respuestaSegura
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/clientes/:id -> Actualización total y mantenimiento de password
async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const datosActualizados = req.body;
    const idCliente = Number(id);

    const clienteExistente = await db.collection("clientes").findOne({ id: idCliente });
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Si modifican la contraseña se encripta, si no, se mantiene la actual
    if (datosActualizados.password && datosActualizados.password.trim() !== "") {
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, SALT_ROUNDS);
    } else {
      datosActualizados.password = clienteExistente.password;
    }

    datosActualizados.id = idCliente;
    datosActualizados.is_active = clienteExistente.is_active;

    const documentoValidado = clienteToDocument(datosActualizados);
    await db.collection("clientes").replaceOne({ id: idCliente }, documentoValidado);

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      data: documentoValidado
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/clientes/:id -> Actualización parcial
async function patchCliente(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const cambios = req.body;
    const idCliente = Number(id);

    if (cambios.password) {
      cambios.password = await bcrypt.hash(cambios.password, SALT_ROUNDS);
    }

    const resultado = await db.collection("clientes").updateOne(
      { id: idCliente },
      { $set: cambios }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json({
      mensaje: "Cliente actualizado parcialmente con éxito",
      data: { id: idCliente, ...cambios }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/clientes/:id -> Baja lógica (Modifica is_active a false)
async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const resultado = await db.collection("clientes").updateOne(
      { id: Number(id) },
      { $set: { is_active: false } }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json({
      mensaje: `Baja lógica aplicada: Cliente con ID ${id} deshabilitado correctamente`
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
