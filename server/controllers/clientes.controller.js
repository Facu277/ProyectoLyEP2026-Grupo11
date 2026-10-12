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

// GET /api/clientes/:id -> Obtener cliente específico por ID (sin filtrar estrictamente por is_active en la URL)
async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    
    // Buscamos solo por ID numérico para garantizar que cargue al editar o ver detalles
    const cliente = await db.collection("clientes").findOne({ id: Number(id) });

    if (!cliente) {
      return res.status(404).json({ error: `No se encontró ningún cliente con el ID ${id}` });
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

    // 1. Asignar valores por defecto que el formulario o el modelo exigen
    nuevoCliente.is_active = true;
    
    // Si el formulario no manda apellido, completarlo por defecto
    if (!nuevoCliente.name) nuevoCliente.name = {};
    if (!nuevoCliente.name.lastname) nuevoCliente.name.lastname = "-";

    // Si faltan datos en la dirección, completarlos temporalmente para que el modelo no falle
    if (!nuevoCliente.address) nuevoCliente.address = {};
    if (!nuevoCliente.address.street) nuevoCliente.address.street = "Sin especificar";
    if (nuevoCliente.address.number === undefined || nuevoCliente.address.number === "") {
      nuevoCliente.address.number = 0;
    } else {
      nuevoCliente.address.number = Number(nuevoCliente.address.number);
    }
    if (!nuevoCliente.address.zipcode) nuevoCliente.address.zipcode = "0000";

    // 2. Generar ID incremental dinámico
    const ultimo = await db.collection("clientes").find().sort({ id: -1 }).limit(1).toArray();
    nuevoCliente.id = ultimo.length > 0 ? ultimo[0].id + 1 : 1;

    // 3. Encriptar contraseña del Cliente
    if (nuevoCliente.password) {
      nuevoCliente.password = await bcrypt.hash(nuevoCliente.password, SALT_ROUNDS);
    } else {
      return res.status(400).json({ error: "La contraseña es obligatoria" });
    }

    // 4. AHORA SÍ: Validar la estructura completa con el modelo
    const documentoValidado = clienteToDocument(nuevoCliente);

    // 5. Guardar en MongoDB Atlas
    await db.collection("clientes").insertOne(documentoValidado);

    // Ocultar password en la respuesta por seguridad
    const { password, ...respuestaSegura } = documentoValidado;

    res.status(201).json({
      mensaje: "Cliente creado exitosamente en MongoDB Atlas",
      data: respuestaSegura
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/clientes/:id -> Actualización total (OMITIENDO password)
async function updateCliente(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const datosActualizados = req.body;
    const idCliente = Number(id);

    // 1. Buscar si el cliente existe
    const clienteExistente = await db.collection("clientes").findOne({ id: idCliente });
    
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // 2. MANTENER LA CONTRASEÑA ACTUAL INALTERABLE (Ignoramos cualquier password que venga)
    datosActualizados.password = clienteExistente.password;

    // 3. Mantener ID y estado activo original
    datosActualizados.id = idCliente;
    datosActualizados.is_active = clienteExistente.is_active !== undefined ? clienteExistente.is_active : true;

    // 4. Validar el documento con el modelo
    const documentoValidado = clienteToDocument(datosActualizados);

    // 5. Reemplazar en MongoDB Atlas
    await db.collection("clientes").replaceOne({ id: idCliente }, documentoValidado);

    // Ocultar password en la respuesta
    const { password, ...respuestaSegura } = documentoValidado;

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      data: respuestaSegura
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/clientes/:id -> Actualización parcial (OMITIENDO password)
async function patchCliente(req, res, next) {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const cambios = req.body;
    const idCliente = Number(id);

    // Nos aseguramos de que no se intente modificar la contraseña por parche
    delete cambios.password;
    delete cambios.id;

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