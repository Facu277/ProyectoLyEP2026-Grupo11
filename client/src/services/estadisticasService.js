
import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

const obtenerEstadisticas = async () => {
    try {
        const sesionGuardada = localStorage.getItem("admin");

        if (!sesionGuardada) {
            throw new Error("No hay una sesión iniciada.");
        }

        const sesion = JSON.parse(sesionGuardada);

        if (!sesion?.token) {
            throw new Error("No se encontró el token de autenticación.");
        }

        const respuesta = await axios.get(
            `${API_URL}/estadisticas`,
            {
                headers: {
                    Authorization: `Bearer ${sesion.token}`
                }
            }
        );

        return respuesta.data.data;
    } catch (error) {
        const mensaje =
            error.response?.data?.error ||
            error.response?.data?.mensaje ||
            error.message ||
            "No se pudieron obtener las estadísticas.";

        throw new Error(mensaje);
    }
};

export default {
    obtenerEstadisticas
};
