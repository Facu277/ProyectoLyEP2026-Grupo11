import axios from "axios";

// URL base del backend desde la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Configuración de la instancia de Axios

const api = axios.create({
  baseURL: `${API_URL}/clientes`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const sesionGuardada = localStorage.getItem("admin");

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);

    if (sesion?.token) {
      config.headers.Authorization = `Bearer ${sesion.token}`;
    }
  }

  return config;
});


// ==========================================
// READ: OBTENER TODOS LOS CLIENTES
// ==========================================

export const obtenerClientes = async () => {
  try {
    const respuesta = await api.get("/");
    console.log("Respuesta completa de clientes:", respuesta);
    console.log("Datos recibidos de clientes:", respuesta.data);

    const datos = respuesta.data;

    if (Array.isArray(datos)) {
      return datos;
    }

    if (Array.isArray(datos?.data)) {
      return datos.data;
    }

    if (Array.isArray(datos?.clientes)) {
      return datos.clientes;
    }

    throw new Error(
      "La API no devolvió una lista de clientes. Revisá la consola para ver la respuesta."
    );
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};


// ==========================================
// READ: OBTENER CLIENTE POR ID
// ==========================================
export const obtenerClientePorId = async (id) => {
  try {
    const respuesta = await api.get(`/${id}`);
    return respuesta.data;
  } catch (error) {
    console.error(`Error al obtener el cliente con ID ${id}:`, error);
    throw error;
  }
};

// ==========================================
// CREATE: CREAR CLIENTE
// ==========================================
export const crearCliente = async (cliente) => {
  try {
    const respuesta = await api.post("/", cliente);
    return respuesta.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error.response?.data || error;
  }
};

// ==========================================
// UPDATE: ACTUALIZAR CLIENTE
// ==========================================
export const actualizarCliente = async (id, datosActualizados) => {
  try {
    const respuesta = await api.put(`/${id}`, datosActualizados);
    return respuesta.data;
  } catch (error) {
    console.error(`Error al actualizar el cliente con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// ==========================================
// DELETE: ELIMINAR O DESHABILITAR CLIENTE
// ==========================================
export const eliminarCliente = async (id) => {
  try {
    const respuesta = await api.delete(`/${id}`);
    return respuesta.data;
  } catch (error) {
    console.error(`Error al eliminar el cliente con ID ${id}:`, error);
    throw error.response?.data || error;
  }
};

// Exportación por defecto manteniendo compatibilidad con la estructura anterior
export default {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};