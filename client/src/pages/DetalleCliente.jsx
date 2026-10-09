import "../css/detallecliente.css";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";

import clienteService
    from "../services/clientesService.js";

import Nav
    from "../components/Nav.jsx";


// ==========================================
// DETALLE DEL CLIENTE
// ==========================================

const DetalleCliente = () => {

    // ======================================
    // ROUTER
    // ======================================

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    // ======================================
    // ADMINISTRADOR EN SESIÓN
    // ======================================

    const {
        admin,
        esGerencia
    } =
        useAutorizaciones();


    // ======================================
    // ESTADOS
    // ======================================

    const [cliente, setCliente] =
        useState(null);

    const [mensaje, setMensaje] =
        useState("");

    const [error, setError] =
        useState("");

    const [cargando, setCargando] =
        useState(true);


    // ======================================
    // CARGAR CLIENTE
    // ======================================

    useEffect(() => {

        const cargarCliente =
            async () => {

                try {

                    setCargando(true);

                    setError("");


                    /*
                        IMPORTANTE:

                        Ya NO consultamos
                        directamente FakeStoreAPI.

                        Obtenemos el cliente desde
                        clientesService, que trabaja
                        con la lista almacenada en
                        localStorage.
                    */

                    const clienteEncontrado =
                        await clienteService
                            .obtenerClientePorId(id);


                    // ==================================
                    // CLIENTE NO ENCONTRADO
                    // ==================================

                    if (!clienteEncontrado) {

                        setError(
                            "No se encontró el cliente."
                        );

                        return;
                    }


                    // ==================================
                    // CLIENTE DESHABILITADO
                    // ==================================

                    /*
                        La ficha normal solamente debe
                        mostrar clientes activos.
                    */

                    if (
                        clienteEncontrado.is_active
                        !== true
                    ) {

                        setError(
                            "Este cliente se encuentra deshabilitado."
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


                    setError(
                        "No se pudo cargar la información del cliente."
                    );


                } finally {

                    setCargando(false);
                }
            };


        cargarCliente();

    }, [id]);


    // ======================================
    // ELIMINAR / DESHABILITAR CLIENTE
    // ======================================

    const eliminarCliente =
        async () => {

            // ==================================
            // VERIFICAR PERMISO (DEFENSA EN UI)
            // ==================================

            /*
                No alcanza con que el botón esté oculto en la interfaz.
                Si el usuario fuerza la acción sin ser GERENTE, se bloquea la ejecución.
            */
            if (!esGerencia) {

                setError(
                    "Operación no permitida: Solo el rol GERENTE puede deshabilitar clientes."
                );

                return;
            }


            // ==================================
            // CONFIRMACIÓN
            // ==================================

            const confirmar =
                window.confirm(
                    "¿Está seguro de que desea deshabilitar este cliente?"
                );


            if (!confirmar) {

                return;
            }


            try {

                // ==================================
                // BAJA LÓGICA
                // ==================================

                /*
                    No eliminamos físicamente al
                    cliente.

                    El service cambia:

                    is_active: true
                    ↓
                    is_active: false
                */

                await clienteService
                    .eliminarCliente(id, admin?.id);


                setMensaje(
                    "Cliente deshabilitado correctamente."
                );


                /*
                    Redirigimos al listado después
                    de mostrar el mensaje.
                */

                setTimeout(() => {

                    navigate(
                        "/clientes"
                    );

                }, 1500);


            } catch (error) {

                console.error(
                    "Error al deshabilitar cliente:",
                    error
                );


                setError(
                    error.message || "No se pudo deshabilitar el cliente."
                );
            }
        };


    // ======================================
    // CARGANDO
    // ======================================

    if (cargando) {

        return (

            <>

                

                <h2>
                    Cargando cliente...
                </h2>

            </>
        );
    }


    // ======================================
    // ERROR
    // ======================================

    if (error) {

        return (

            <>

               

                <div className="detalle-cliente">

                    <h2>
                        {error}
                    </h2>


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

                </div>

            </>
        );
    }


    // ======================================
    // DETALLE
    // ======================================

    return (

        <>

           


            <div className="detalle-cliente">

                <h1>
                    Ficha del Cliente
                </h1>


                {/* ==================================
                    ADMINISTRADOR ACTUAL
                ================================== */}

                <p>

                    <strong>
                        Sector actual:
                    </strong>

                    {" "}

                    {
                        esGerencia
                            ? "Gerencia"
                            : "Soporte"
                    }

                </p>


                {/* ==================================
                    MENSAJE
                ================================== */}

                {mensaje && (

                    <p className="mensaje-eliminado">

                        {mensaje}

                    </p>
                )}


                {/* ==================================
                    DATOS PERSONALES
                ================================== */}

                <h2>
                    Datos personales
                </h2>


                <p>

                    <strong>
                        ID:
                    </strong>

                    {" "}

                    {cliente.id}

                </p>


                <p>

                    <strong>
                        Nombre:
                    </strong>

                    {" "}

                    {
                        cliente.name?.firstname
                        || "Sin nombre"
                    }

                    {" "}

                    {
                        cliente.name?.lastname
                        || ""
                    }

                </p>


                <p>

                    <strong>
                        Email:
                    </strong>

                    {" "}

                    {cliente.email}

                </p>


                <p>

                    <strong>
                        Teléfono:
                    </strong>

                    {" "}

                    {cliente.phone}

                </p>


                {/* ==================================
                    DIRECCIÓN
                ================================== */}

                <h2>
                    Dirección
                </h2>


                <p>

                    <strong>
                        Calle:
                    </strong>

                    {" "}

                    {
                        cliente.address?.street
                        || "Sin datos"
                    }

                </p>


                <p>

                    <strong>
                        Número:
                    </strong>

                    {" "}

                    {
                        cliente.address?.number
                        || "Sin datos"
                    }

                </p>


                <p>

                    <strong>
                        Código Postal:
                    </strong>

                    {" "}

                    {
                        cliente.address?.zipcode
                        || "Sin datos"
                    }

                </p>


                <p>

                    <strong>
                        Ciudad:
                    </strong>

                    {" "}

                    {
                        cliente.address?.city
                        || "Sin datos"
                    }

                </p>


                {/* ==================================
                    CREDENCIALES
                ================================== */}

                <h2>
                    Datos de cuenta
                </h2>


                <p>

                    <strong>
                        Usuario:
                    </strong>

                    {" "}

                    {cliente.username}

                </p>


                {/*
                    IMPORTANTE:

                    La contraseña del cliente
                    NO se muestra en la ficha.
                */}


                {/* ==================================
                    ACCIONES
                ================================== */}

                <div className="acciones-cliente">


                    {/* ==============================
                        EDITAR
                        GERENTE + SOPORTE
                    ============================== */}

                    <button
                        type="button"

                        className="btn-editar"

                        onClick={() =>
                            navigate(
                                `/clientes/editar/${cliente.id}`
                            )
                        }
                    >
                        Editar cliente
                    </button>


                    {/* ==============================
                        ELIMINAR
                        SOLO GERENTE
                    ============================== */}

                    {esGerencia && (

                        <button
                            type="button"

                            className="btn-eliminar"

                            onClick={
                                eliminarCliente
                            }
                        >
                            Eliminar cliente
                        </button>
                    )}


                    {/* ==============================
                        VOLVER
                    ============================== */}

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

                </div>

            </div>

        </>
    );
};


export default DetalleCliente;