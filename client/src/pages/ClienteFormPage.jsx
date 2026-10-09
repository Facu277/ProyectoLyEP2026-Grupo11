import {
    useEffect,
    useState
} from "react";

import {
    Navigate,
    useNavigate,
    useParams
} from "react-router-dom";

import FormularioCliente
    from "../components/FormularioCliente.jsx";

import clienteService
    from "../services/clientesService.js";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";


// ==========================================
// PAGE CREAR / EDITAR CLIENTE
// ==========================================

const ClienteFormPage = () => {

    // ======================================
    // ROUTER
    // ======================================

    const navigate =
        useNavigate();

    const { id } =
        useParams();


    /*
        Si existe un ID:

        /clientes/editar/5
        → EDICIÓN

        Si no existe:

        /clientes/nuevo
        → CREACIÓN
    */

    const esEdicion =
        Boolean(id);


    // ======================================
    // ADMINISTRADOR EN SESIÓN
    // ======================================

    const {
        admin,
        tieneRol
    } = useAutorizaciones();


    // ======================================
    // PERMISOS (DERIVADOS DE SESIÓN RESUELTA)
    // ======================================

    /*
        GERENTE y SOPORTE pueden editar.

        La creación NO requiere administrador,
        porque un visitante puede registrarse
        como cliente.
    */

    const puedeEditarClientes =
        tieneRol(["GERENTE", "SOPORTE"]);


    // ======================================
    // ESTADOS
    // ======================================

    const [cliente, setCliente] =
        useState(null);

    const [cargando, setCargando] =
        useState(false);

    const [
        cargandoCliente,
        setCargandoCliente
    ] =
        useState(esEdicion);

    const [
        mensajeError,
        setMensajeError
    ] =
        useState("");

    const [
        registroExitoso,
        setRegistroExitoso
    ] =
        useState(false);


    // ======================================
    // CARGAR CLIENTE PARA EDICIÓN
    // ======================================

    useEffect(() => {

        // En creación no necesitamos
        // buscar ningún cliente.
        if (!esEdicion) {

            return;
        }


        /*
            Si estamos editando pero no existe
            un administrador autorizado,
            tampoco consultamos los datos.
        */

        if (!puedeEditarClientes) {

            return;
        }


        const cargarCliente =
            async () => {

                try {

                    setCargandoCliente(true);

                    setMensajeError("");


                    // ==================================
                    // BUSCAR CLIENTE POR ID
                    // ==================================

                    const clienteEncontrado =
                        await clienteService
                            .obtenerClientePorId(
                                id
                            );


                    // ==================================
                    // CLIENTE NO ENCONTRADO
                    // ==================================

                    if (!clienteEncontrado) {

                        setMensajeError(
                            "No se encontró el cliente."
                        );

                        return;
                    }


                    // ==================================
                    // CLIENTE INACTIVO
                    // ==================================

                    if (
                        clienteEncontrado
                            .is_active !== true
                    ) {

                        setMensajeError(
                            "El cliente se encuentra deshabilitado."
                        );

                        return;
                    }


                    setCliente(
                        clienteEncontrado
                    );


                } catch (error) {

                    console.error(
                        "Error al cargar cliente:",
                        error
                    );


                    setMensajeError(
                        "No se pudo cargar el cliente."
                    );


                } finally {

                    setCargandoCliente(
                        false
                    );
                }
            };


        cargarCliente();

    }, [
        id,
        esEdicion,
        puedeEditarClientes
    ]);


    // ======================================
    // GUARDAR CLIENTE
    // ======================================

    const guardarCliente =
        async (datosCliente) => {

            /*
                IMPORTANTE:

                La creación es pública.

                Solamente verificamos permisos
                cuando estamos EDITANDO.
            */

            if (
                esEdicion &&
                !puedeEditarClientes
            ) {

                setMensajeError(
                    "No tenés permisos para editar clientes."
                );

                return;
            }


            try {

                setCargando(true);

                setMensajeError("");


                // ==================================
                // EDITAR CLIENTE
                // ==================================

                if (esEdicion) {

                    /*
                        Durante la edición NO se
                        modifica la contraseña.

                        FormularioCliente no envía
                        password y clientesService
                        conserva el existente.
                    */

                    const actualizado =
                        await clienteService
                            .actualizarCliente(
                                id,
                                datosCliente,
                                admin?.id
                            );


                    console.log(
                        "CLIENTE ACTUALIZADO:"
                    );

                    console.table([
                        actualizado
                    ]);


                    // Un administrador vuelve
                    // al listado.
                    navigate(
                        "/clientes"
                    );


                // ==================================
                // CREAR CLIENTE
                // ==================================

                } else {

                    const creado =
                        await clienteService
                            .crearCliente(
                                datosCliente,
                                admin?.id
                            );


                    console.log(
                        "CLIENTE CREADO:"
                    );

                    console.table([
                        creado
                    ]);


                    /*
                        Si quien creó el cliente
                        es un administrador,
                        volvemos al listado.

                        Si es un visitante,
                        mostramos una confirmación.
                    */

                    if (admin) {

                        navigate(
                            "/clientes"
                        );

                    } else {

                        setRegistroExitoso(
                            true
                        );
                    }
                }


            } catch (error) {

                /*
                    Los errores de validación
                    vuelven al formulario para
                    mostrarse debajo del campo.
                */

                if (
                    error.validationErrors
                ) {

                    throw error;
                }


                console.error(
                    "Error al guardar cliente:",
                    error
                );


                setMensajeError(
                    error.message || "No se pudo guardar el cliente."
                );


                throw error;


            } finally {

                setCargando(false);
            }
        };


    // ======================================
    // PROTEGER SOLAMENTE LA EDICIÓN
    // ======================================

    /*
        /clientes/nuevo
        → público

        /clientes/editar/:id
        → GERENTE o SOPORTE
    */

    if (
        esEdicion &&
        !puedeEditarClientes
    ) {

        return (

            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================
    // CARGANDO
    // ======================================

    if (cargandoCliente) {

        return (

            <p>
                Cargando cliente...
            </p>
        );
    }


    // ======================================
    // REGISTRO PÚBLICO EXITOSO
    // ======================================

    if (
        !esEdicion &&
        registroExitoso
    ) {

        return (

            <main>

                <h1>
                    Registro completado
                </h1>

                <p>
                    El cliente fue creado correctamente.
                </p>

            </main>
        );
    }


    // ======================================
    // CLIENTE NO ENCONTRADO
    // ======================================

    if (
        esEdicion &&
        !cliente
    ) {

        return (

            <main>

                <h1>
                    Cliente no encontrado
                </h1>


                {mensajeError && (

                    <p className="mensaje-error">
                        {mensajeError}
                    </p>
                )}


                <button
                    type="button"

                    onClick={() =>
                        navigate(
                            "/clientes"
                        )
                    }
                >
                    Volver
                </button>

            </main>
        );
    }


    // ======================================
    // PAGE
    // ======================================

    return (

        <main>

            <h1>

                {
                    esEdicion
                        ? "Editar cliente"
                        : "Crear cliente"
                }

            </h1>


            {mensajeError && (

                <p className="mensaje-error">
                    {mensajeError}
                </p>
            )}


            <FormularioCliente

                cliente={
                    cliente
                }

                onSubmit={
                    guardarCliente
                }

                cargando={
                    cargando
                }

            />

        </main>
    );
};


export default ClienteFormPage;