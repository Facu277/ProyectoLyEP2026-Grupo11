import clienteService from "../services/clientesService.js";
import { administradores } from "./administradoresInicializados.js";


// ==========================================
// INICIALIZAR USUARIOS
// ==========================================

export const inicializarUsuarios = async () => {

    // Obtenemos los clientes desde FakeStoreAPI.
    const clientes = await clienteService.obtenerClientes();


    // Todos los administradores.
    const listaAdministradores = administradores.map(
        administrador => administrador.toJSON()
    );


    // Administradores que pertenecen a GERENCIA.
    const gerentes = listaAdministradores.filter(
        administrador =>
            administrador.sector === "GERENTE"
    );


    // Administradores que pertenecen a SOPORTE.
    const soportes = listaAdministradores.filter(
        administrador =>
            administrador.sector === "SOPORTE"
    );


    return {
        clientes,
        administradores: listaAdministradores,
        gerentes,
        soportes
    };
};





const probarUsuarios = async () => {
  try {
    const usuarios = await inicializarUsuarios();

    console.log("TODOS LOS USUARIOS:");
    console.log(usuarios);

    console.log("CLIENTES:");
    console.log(usuarios.clientes);

    console.log("ADMINISTRADORES:");
    console.log(usuarios.administradores);

    console.log("GERENTES:");
    console.log(usuarios.gerentes);

    console.log("SOPORTES:");
    console.log(usuarios.soportes);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
};

probarUsuarios();