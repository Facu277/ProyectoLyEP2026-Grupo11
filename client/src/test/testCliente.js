import clienteService from "../services/clientesService.js";

/*
    ================================================================================
    NOTA TÉCNICA: LÍMITES DE SEGURIDAD EN APLICACIONES SIN BACKEND
    ================================================================================
    Sin un backend que firme criptográficamente tokens de sesión (JWT) o valide
    autorizaciones en el servidor, cualquier script que se ejecute bajo el mismo
    origen (Same-Origin) puede técnicamente acceder o manipular el localStorage.

    Sin embargo, bajo esta arquitectura:
    1. En localStorage solo vive la identidad mínima ({ id }), sin roles ni permisos.
    2. La sesión y sus privilegios se resuelven exclusivamente contra la lista canónica
       de administradores.
    3. Los servicios (crear, actualizar, eliminar) verifican la identidad contra la
       fuente canónica e ignoran cualquier sector que la interfaz o el storage intenten inyectar.
    4. Por lo tanto, no alcanza con cambiar el sector en el storage o forzar botones en la UI
       para borrar o manipular clientes: las operaciones sin rol autorizado son rechazadas.
    ================================================================================
*/

// IDs de prueba según lista canónica:
// 101 -> Carlos Gomez (GERENTE)
// 103 -> Martin Lopez (SOPORTE)
const ADMIN_GERENTE_ID = 101;
const ADMIN_SOPORTE_ID = 103;


// ==========================================
// PROBAR CREATE
// CREAR CLIENTE
// ==========================================

export const probarCrearCliente = async (adminId = ADMIN_GERENTE_ID) => {

    const nuevoCliente = {
        email: "facundo@gmail.com",
        username: "facundo123",
        password: "123456#Facundo",

        name: {
            firstname: "Facundo",
            lastname: "Alfaro"
        },

        phone: "388-456-7890",

        address: {
            city: "San Salvador de Jujuy",
            street: "Belgrano",
            number: 123,
            zipcode: "4600"
        }
    };


    try {

        console.log("====================================");
        console.log("CREATE - CLIENTE ANTES DE CREAR:");
        console.log(nuevoCliente);


        const clienteCreado =
            await clienteService.crearCliente(nuevoCliente, adminId);


        console.log("====================================");
        console.log("CREATE - CLIENTE CREADO:");

        console.table([clienteCreado]);


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);

        console.log(
            "TOTAL DE CLIENTES:",
            clientesActualizados.length
        );


        return clienteCreado;

    } catch (error) {

        console.error(
            "Error al crear el cliente:",
            error.message
        );
        throw error;
    }
};




// ==========================================
// PROBAR READ
// OBTENER TODOS LOS CLIENTES
// ==========================================

export const probarObtenerClientes = async () => {

    try {

        const clientes =
            await clienteService.obtenerClientes();


        console.log("====================================");
        console.log("READ - TODOS LOS CLIENTES:");

        console.table(clientes);


        console.log(
            "TOTAL DE CLIENTES:",
            clientes.length
        );


        return clientes;

    } catch (error) {

        console.error(
            "Error al obtener los clientes:",
            error.message
        );
    }
};




// ==========================================
// PROBAR READ
// OBTENER CLIENTE POR ID
// ==========================================

export const probarObtenerClientePorId = async (id) => {

    try {

        const cliente =
            await clienteService.obtenerClientePorId(id);


        console.log("====================================");
        console.log(
            `READ - CLIENTE CON ID ${id}:`
        );


        if (!cliente) {

            console.log(
                `No existe un cliente con ID ${id}`
            );

            return;
        }


        console.table([cliente]);


        return cliente;

    } catch (error) {

        console.error(
            "Error al obtener el cliente:",
            error.message
        );
    }
};




// ==========================================
// PROBAR UPDATE
// ACTUALIZAR CLIENTE
// ==========================================

export const probarActualizarCliente = async (id, adminId = ADMIN_SOPORTE_ID) => {

    const datosActualizados = {

        email: "facundo.actualizado@gmail.com",

        username: "facundoActualizado",

        name: {
            firstname: "Facundo",
            lastname: "Alfaro Actualizado"
        },

        phone: "388-999-8888",

        address: {
            city: "Palpala",
            street: "Avenida Libertad",
            number: 500,
            zipcode: "4612"
        }
    };


    try {

        console.log("====================================");
        console.log(
            `UPDATE - CLIENTE A MODIFICAR: ${id}`
        );


        const clienteAnterior =
            await clienteService.obtenerClientePorId(id);


        console.log("ANTES DE ACTUALIZAR:");

        console.table([clienteAnterior]);


        const clienteActualizado =
            await clienteService.actualizarCliente(
                id,
                datosActualizados,
                adminId
            );


        console.log("DESPUÉS DE ACTUALIZAR:");

        console.table([clienteActualizado]);


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);


        return clienteActualizado;

    } catch (error) {

        console.error(
            "Error al actualizar el cliente:",
            error.message
        );
        throw error;
    }
};




// ==========================================
// PROBAR DELETE LÓGICO
// DESHABILITAR CLIENTE
// ==========================================

export const probarEliminarCliente = async (id, adminId = ADMIN_GERENTE_ID) => {

    try {

        console.log("====================================");
        console.log(
            `DELETE LÓGICO - CLIENTE ID ${id}`
        );


        const clienteAnterior =
            await clienteService.obtenerClientePorId(id);


        console.log("ANTES DE DESHABILITAR:");

        console.table([clienteAnterior]);


        const clienteDeshabilitado =
            await clienteService.eliminarCliente(id, adminId);


        console.log("DESPUÉS DE DESHABILITAR:");

        console.table([clienteDeshabilitado]);


        console.log(
            "ESTADO DEL CLIENTE:",
            clienteDeshabilitado.is_active
        );


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);


        return clienteDeshabilitado;

    } catch (error) {

        console.error(
            "Error al deshabilitar el cliente:",
            error.message
        );
        throw error;
    }
};




// ==========================================
// PRUEBAS DE RECHAZO POR ROL / PERMISOS
// ==========================================

export const probarRechazoEliminarSinPermiso = async (id = 1) => {

    console.log("====================================");
    console.log("TEST: RECHAZO DE ELIMINACIÓN SEGÚN ROL");

    // 1. Intento de eliminación con rol SOPORTE (adminId: 103)
    try {
        console.log("Test 1: Soporte intenta eliminar cliente...");
        await clienteService.eliminarCliente(id, ADMIN_SOPORTE_ID);
        console.error("FALLÓ: Se permitió eliminar a un usuario con rol SOPORTE.");
    } catch (error) {
        console.log("ÉXITO: Soporte fue rechazado correctamente ->", error.message);
    }

    // 2. Intento de adulteración de sector en objeto enviado ({ id: 103, sector: 'GERENTE' })
    try {
        console.log("Test 2: Soporte intenta forzar sector GERENTE en el payload...");
        await clienteService.eliminarCliente(id, { id: ADMIN_SOPORTE_ID, sector: "GERENTE" });
        console.error("FALLÓ: Se confió en el sector inyectado por la petición.");
    } catch (error) {
        console.log("ÉXITO: Se ignoró el sector adulterado y fue rechazado ->", error.message);
    }

    // 3. Intento de eliminación sin sesión o con ID inexistente (adminId: 999)
    try {
        console.log("Test 3: Usuario inexistente o sin sesión intenta eliminar cliente...");
        await clienteService.eliminarCliente(id, 999);
        console.error("FALLÓ: Se permitió eliminar sin identidad válida.");
    } catch (error) {
        console.log("ÉXITO: Sesión inválida rechazada correctamente ->", error.message);
    }
};


export const probarRechazoCrearSinPermiso = async () => {

    console.log("====================================");
    console.log("TEST: RECHAZO DE ALTA SIN ROL DE ADMINISTRADOR");

    const clienteMock = {
        email: "test.rechazo@empresa.com",
        username: "testrechazo",
        password: "Password#123",
        name: { firstname: "Test", lastname: "Rechazo" },
        phone: "3884000000"
    };

    try {
        console.log("Test: Usuario no administrador intenta crear cliente...");
        await clienteService.crearCliente(clienteMock, 999);
        console.error("FALLÓ: Se permitió crear cliente sin rol de administrador.");
    } catch (error) {
        console.log("ÉXITO: Alta sin rol autorizada rechazada ->", error.message);
    }
};




// ==========================================
// PROBAR CRUD COMPLETO
// ==========================================

export const probarCRUDCompleto = async () => {

    try {

        console.log("====================================");
        console.log("INICIO DE PRUEBA CRUD");


        // ==================================
        // 1. CREATE (con GERENTE)
        // ==================================

        const clienteCreado =
            await probarCrearCliente(ADMIN_GERENTE_ID);


        if (!clienteCreado) {
            return;
        }


        const idCliente =
            clienteCreado.id;


        // ==================================
        // 2. READ
        // ==================================

        await probarObtenerClientePorId(
            idCliente
        );


        // ==================================
        // 3. UPDATE (con SOPORTE)
        // ==================================

        await probarActualizarCliente(
            idCliente,
            ADMIN_SOPORTE_ID
        );


        // ==================================
        // 4. PRUEBAS DE AUTORIZACIÓN / RECHAZO
        // ==================================

        await probarRechazoEliminarSinPermiso(idCliente);
        await probarRechazoCrearSinPermiso();


        // ==================================
        // 5. DELETE LÓGICO AUTORIZADO (con GERENTE)
        // ==================================

        await probarEliminarCliente(
            idCliente,
            ADMIN_GERENTE_ID
        );


        // ==================================
        // 6. READ FINAL
        // ==================================

        await probarObtenerClientes();


        console.log("====================================");
        console.log("FIN DE PRUEBA CRUD EXITOSA");


    } catch (error) {

        console.error(
            "Error durante la prueba CRUD:",
            error
        );
    }
};