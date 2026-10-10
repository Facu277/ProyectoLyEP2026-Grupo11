import axios from "axios";

const API_URL = "http://localhost:3001/api/clientes";
const STORAGE_KEY = "admin";

// Recupera el token de la sesión iniciada.
const obtenerConfigAutenticacion = () => {
    const sesionGuardada = localStorage.getItem(STORAGE_KEY);

    if (!sesionGuardada) {
        throw new Error("No hay una sesión iniciada.");
    }

    let sesion;

    try {
        sesion = JSON.parse(sesionGuardada);
    } catch {
        throw new Error("La sesión guardada no es válida.");
    }

    if (!sesion?.token) {
        throw new Error("No se encontró el token de autenticación.");
    }

    return {
        headers: {
            Authorization: `Bearer ${sesion.token}`
        }
    };
};

// Conserva el mensaje y los detalles enviados por Express.
const manejarError = (error) => {
    const respuesta = error.response?.data;

    const mensaje =
        respuesta?.error ||
        respuesta?.mensaje ||
        error.message ||
        "Ocurrió un error al comunicarse con el servidor.";

    const errorServicio = new Error(mensaje);

    errorServicio.status = error.response?.status;
    errorServicio.validationErrors = respuesta?.detalles ?? [];
    errorServicio.detalles = respuesta?.detalles ?? [];

    throw errorServicio;
};

// READ: obtener todos los clientes.
// Requiere sesión de GERENTE o SOPORTE.
const obtenerClientes = async () => {
    try {
        const respuesta = await axios.get(
            API_URL,
            obtenerConfigAutenticacion()
        );

        return respuesta.data.data;
    } catch (error) {
        manejarError(error);
    }
};

// READ: obtener un cliente por ID.
// Requiere sesión de GERENTE o SOPORTE.
const obtenerClientePorId = async (id) => {
    try {
        const respuesta = await axios.get(
            `${API_URL}/${id}`,
            obtenerConfigAutenticacion()
        );

        return respuesta.data.data;
    } catch (error) {
        manejarError(error);
    }
};

// CREATE: registro público de un cliente.
// No requiere token ni administrador.
const crearCliente = async (cliente) => {
    try {
        const respuesta = await axios.post(
            API_URL,
            cliente
        );

        return respuesta.data.data;
    } catch (error) {
        manejarError(error);
    }
};

// UPDATE: actualizar un cliente.
// Requiere sesión de GERENTE o SOPORTE.
const actualizarCliente = async (id, datosActualizados) => {
    try {
        const respuesta = await axios.put(
            `${API_URL}/${id}`,
            datosActualizados,
            obtenerConfigAutenticacion()
        );

        return respuesta.data.data;
    } catch (error) {
        manejarError(error);
    }
};

// DELETE lógico: deshabilitar un cliente.
// El backend debe permitirlo únicamente a GERENTE.
const eliminarCliente = async (id) => {
    try {
        const respuesta = await axios.delete(
            `${API_URL}/${id}`,
            obtenerConfigAutenticacion()
        );

        return respuesta.data.data;
    } catch (error) {
        manejarError(error);
    }
};

export default {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};