
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const login = async (email, password) => {
    const respuesta = await axios.post(`${API_URL}/login`, {
        email,
        password
    });

    return respuesta.data;
};

export default {
    login
};
