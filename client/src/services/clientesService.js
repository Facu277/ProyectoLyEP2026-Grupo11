import axios from "axios";

import {
    validarCliente
} from "../../shared/validaciones.js";

import leerJSONLocalStorage
    from "../utils/leerJSONLocalStorage.js";

import {
    administradores
} from "./administradoresInicializados.js";


const URL = "https://fakestoreapi.com/users";

const STORAGE_KEY = "clientes";


// ==========================================
// NORMALIZAR CLIENTE
// ==========================================

const normalizarCliente = (cliente) => {

    return {

        id: cliente.id,

        email: cliente.email,

        username: cliente.username,

        // Por ahora la contraseña se guarda
        // sin encriptación.
        password: cliente.password,

        name: {
            firstname: cliente.name?.firstname,
            lastname: cliente.name?.lastname
        },

        // Eliminamos los guiones del teléfono.
        phone:
            cliente.phone?.replace(/[-\s]/g, ""),

        // Si no existe estado, comienza activo.
        is_active:
            cliente.is_active ?? true,

        // Identificamos siempre al usuario
        // como CLIENTE.
        tipo: "CLIENTE",

        // Se conserva la dirección,
        // pero NO se guarda geolocation.
        address: {
            city: cliente.address?.city,
            street: cliente.address?.street,
            number: cliente.address?.number,
            zipcode: cliente.address?.zipcode
        }
    };
};


// ==========================================
// GUARDAR CLIENTES EN LOCALSTORAGE
// ==========================================

const guardarClientes = (clientes) => {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(clientes)
    );
};


// ==========================================
// LEER CLIENTES DEL LOCALSTORAGE
// ==========================================

const leerClientesLocal = () => {

    return leerJSONLocalStorage(
        STORAGE_KEY,
        []
    );
};


// ==========================================
// INICIALIZAR CLIENTES
// ==========================================

const inicializarClientes = async () => {

    // Primero verificamos si existen clientes
    // guardados en localStorage.
    const clientesLocales =
        leerClientesLocal();


    // Si existen, trabajamos con esos datos
    // y no volvemos a consultar FakeStoreAPI.
    if (clientesLocales.length > 0) {

        return clientesLocales;
    }


    // ======================================
    // PRIMERA CARGA DESDE FAKESTOREAPI
    // ======================================

    const respuesta =
        await axios.get(URL);


    // Normalizamos todos los usuarios de la API.
    const clientes =
        respuesta.data.map(
            cliente =>
                normalizarCliente(cliente)
        );


    // Guardamos los clientes en localStorage.
    guardarClientes(clientes);


    return clientes;
};


// ==========================================
// READ
// OBTENER TODOS LOS CLIENTES
// ==========================================

const obtenerClientes = async () => {

    return await inicializarClientes();
};


// ==========================================
// READ
// OBTENER CLIENTE POR ID
// ==========================================

const obtenerClientePorId = async (id) => {

    const clientes =
        await inicializarClientes();


    const idCliente =
        Number(id);


    return clientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// CREATE
// CREAR CLIENTE
// ==========================================

const crearCliente = async (cliente, adminSesion) => {

    // ======================================
    // AUTORIZACIÓN: GERENTE O SOPORTE
    // ======================================

    /*
        Se valida que el administrador en sesión exista,
        se encuentre activo y pertenezca a GERENTE o SOPORTE.
        Cualquier sector enviado por la UI se ignora.
    */
    const idAdmin =
        typeof adminSesion === "object" ? adminSesion?.id : adminSesion;

    const admin =
        administradores.find(
            a => a.id === Number(idAdmin)
        );

    if (!admin || !admin.is_active || !["GERENTE", "SOPORTE"].includes(admin.sector)) {

        throw new Error(
            "Operación no permitida: Solo un administrador con rol GERENTE o SOPORTE puede crear clientes."
        );
    }

    // ======================================
    // VALIDAR DATOS
    // ======================================

    /*
        Al registrar un cliente nuevo:

        - Todos los campos son obligatorios.
        - La contraseña es obligatoria.
        - La contraseña debe cumplir las reglas.
    */

    const resultadoValidacion =
        validarCliente(
            cliente,
            {
                validarPassword: true
            }
        );


    // ======================================
    // VERIFICAR ERRORES
    // ======================================

    if (!resultadoValidacion.valid) {

        console.error(
            "Errores de validación:",
            resultadoValidacion.errors
        );


        const error =
            new Error(
                "Los datos del cliente no son válidos."
            );


        /*
            Guardamos los errores específicos.

            Esto permitirá que posteriormente
            React pueda mostrar, por ejemplo:

            errors.email
            errors.username
            errors.password
            errors.phone
        */
        error.validationErrors =
            resultadoValidacion.errors;


        throw error;
    }


    // Datos limpios y validados.
    const clienteValidado =
        resultadoValidacion.data;


    // ======================================
    // OBTENER LISTA ACTUAL
    // ======================================

    const clientes =
        await inicializarClientes();


    // ======================================
    // GENERAR NUEVO ID
    // ======================================

    const ultimoId =
        clientes.length > 0

            ? Math.max(
                ...clientes.map(
                    cliente =>
                        Number(cliente.id)
                )
            )

            : 0;


    const nuevoId =
        ultimoId + 1;


    // ======================================
    // CREAR CLIENTE
    // ======================================

    const nuevoCliente =
        normalizarCliente({

            ...clienteValidado,

            // ID generado automáticamente.
            id: nuevoId,

            // Todo cliente nuevo comienza activo.
            is_active: true
        });


    // ======================================
    // AGREGAR A LA LISTA
    // ======================================

    clientes.push(nuevoCliente);


    // ======================================
    // GUARDAR EN LOCALSTORAGE
    // ======================================

    guardarClientes(clientes);


    return nuevoCliente;
};


// ==========================================
// UPDATE
// ACTUALIZAR CLIENTE
// ==========================================

const actualizarCliente = async (
    id,
    datosActualizados,
    adminSesion
) => {

    // ======================================
    // AUTORIZACIÓN: GERENTE O SOPORTE
    // ======================================

    /*
        Se valida que el administrador en sesión exista,
        se encuentre activo y pertenezca a GERENTE o SOPORTE.
        Cualquier sector enviado por la UI se ignora.
    */
    const idAdmin =
        typeof adminSesion === "object" ? adminSesion?.id : adminSesion;

    const admin =
        administradores.find(
            a => a.id === Number(idAdmin)
        );

    if (!admin || !admin.is_active || !["GERENTE", "SOPORTE"].includes(admin.sector)) {

        throw new Error(
            "Operación no permitida: Solo un administrador con rol GERENTE o SOPORTE puede actualizar clientes."
        );
    }

    // ======================================
    // OBTENER CLIENTES
    // ======================================

    const clientes =
        await inicializarClientes();


    const idCliente =
        Number(id);


    // ======================================
    // BUSCAR CLIENTE
    // ======================================

    const clienteExistente =
        clientes.find(
            cliente =>
                cliente.id === idCliente
        );


    if (!clienteExistente) {

        throw new Error(
            `No existe un cliente con ID ${idCliente}`
        );
    }


    // ======================================
    // COMBINAR DATOS
    // ======================================

    /*
        Conservamos toda la información anterior
        y reemplazamos solamente los campos que
        fueron modificados.

        Esto permite modificaciones parciales.
    */

    const clienteModificado = {

        ...clienteExistente,

        ...datosActualizados,


        // Combinamos nombre por separado.
        name: {

            ...clienteExistente.name,

            ...(datosActualizados.name || {})
        },


        // Combinamos dirección por separado.
        address: {

            ...clienteExistente.address,

            ...(datosActualizados.address || {})
        },


        /*
            La contraseña NO se modifica desde
            esta operación.

            Se conserva la contraseña actual.

            Más adelante puede crearse una función
            cambiarPassword().
        */
        password:
            clienteExistente.password,


        // El ID tampoco puede modificarse.
        id:
            idCliente,


        // Conservamos el estado actual.
        is_active:
            clienteExistente.is_active,


        // Siempre continúa siendo CLIENTE.
        tipo:
            "CLIENTE"
    };


    // ======================================
    // VALIDAR DATOS
    // ======================================

    /*
        IMPORTANTE:

        En UPDATE no volvemos a validar la
        contraseña.

        Esto permite modificar los clientes que
        vinieron originalmente de FakeStoreAPI,
        cuyas contraseñas pueden no cumplir
        nuestras reglas actuales.
    */

    const resultadoValidacion =
        validarCliente(
            clienteModificado,
            {
                validarPassword: false
            }
        );


    // ======================================
    // VERIFICAR ERRORES
    // ======================================

    if (!resultadoValidacion.valid) {

        console.error(
            "Errores de validación:",
            resultadoValidacion.errors
        );


        const error =
            new Error(
                "Los datos actualizados no son válidos."
            );


        error.validationErrors =
            resultadoValidacion.errors;


        throw error;
    }


    // ======================================
    // ACTUALIZAR LISTA
    // ======================================

    const nuevosClientes =
        clientes.map(cliente => {

            // Si no es el cliente buscado,
            // lo devolvemos sin modificar.
            if (cliente.id !== idCliente) {

                return cliente;
            }


            // Cliente actualizado.
            return normalizarCliente({

                ...resultadoValidacion.data,

                // El ID nunca cambia.
                id:
                    idCliente,

                // La contraseña se conserva.
                password:
                    clienteExistente.password,

                // El estado se conserva.
                is_active:
                    clienteExistente.is_active,

                // El tipo nunca cambia.
                tipo:
                    "CLIENTE"
            });
        });


    // ======================================
    // GUARDAR CAMBIOS
    // ======================================

    guardarClientes(nuevosClientes);


    // ======================================
    // DEVOLVER CLIENTE ACTUALIZADO
    // ======================================

    return nuevosClientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// DELETE LÓGICO
// DESHABILITAR CLIENTE
// ==========================================

const eliminarCliente = async (id, adminSesion) => {

    // ======================================
    // AUTORIZACIÓN: VALIDAR ROL GERENTE
    // ======================================

    /*
        Se recibe el id del admin en sesión.
        Se busca en la lista canónica de administradores
        y se rechaza si no es GERENTE.
        Se ignora cualquier sector que mande la página.
    */
    const idAdmin =
        typeof adminSesion === "object" ? adminSesion?.id : adminSesion;

    const admin =
        administradores.find(
            a => a.id === Number(idAdmin)
        );

    if (!admin || !admin.is_active || admin.sector !== "GERENTE") {

        throw new Error(
            "Operación no permitida: Solo un administrador con rol GERENTE puede deshabilitar clientes."
        );
    }

    // ======================================
    // OBTENER CLIENTES
    // ======================================

    const clientes =
        await inicializarClientes();


    const idCliente =
        Number(id);


    // ======================================
    // BUSCAR CLIENTE
    // ======================================

    const clienteExistente =
        clientes.find(
            cliente =>
                cliente.id === idCliente
        );


    if (!clienteExistente) {

        throw new Error(
            `No existe un cliente con ID ${idCliente}`
        );
    }


    // ======================================
    // DESHABILITAR CLIENTE
    // ======================================

    const nuevosClientes =
        clientes.map(cliente => {

            if (cliente.id === idCliente) {

                return {

                    ...cliente,

                    // Baja lógica.
                    // El usuario continúa almacenado.
                    is_active: false
                };
            }


            return cliente;
        });


    // ======================================
    // GUARDAR CAMBIOS
    // ======================================

    guardarClientes(nuevosClientes);


    // ======================================
    // DEVOLVER CLIENTE DESHABILITADO
    // ======================================

    return nuevosClientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// EXPORTAR SERVICIO
// ==========================================

export default {

    inicializarClientes,

    obtenerClientes,

    obtenerClientePorId,

    crearCliente,

    actualizarCliente,

    eliminarCliente
};