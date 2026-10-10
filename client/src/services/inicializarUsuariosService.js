import clienteService from "./clientesService.js";

// Obtener clientes desde el backend.
export const inicializarUsuarios = async () => {
    const clientes = await clienteService.obtenerClientes();

    return {
        clientes
    };
};