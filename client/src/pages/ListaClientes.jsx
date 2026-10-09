import "../css/listaclientes.css";

import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import clienteService
    from "../services/clientesService.js";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";

import Nav
    from "../components/Nav.jsx";


// ==========================================
// LISTA DE CLIENTES
// ==========================================

const ListaClientes = () => {

    // ======================================
    // ADMINISTRADOR EN SESIÓN
    // ======================================

    const {
        admin,
        esGerencia,
        tieneRol
    } = useAutorizaciones();


    // ======================================
    // PERMISOS (DERIVADOS DE SESIÓN RESUELTA)
    // ======================================

    /*
        GERENTE y SOPORTE pueden:

        - Ver clientes.
        - Editar clientes.

        Solamente GERENTE puede:

        - Eliminar / deshabilitar clientes.
    */

    const puedeEditar =
        tieneRol(["GERENTE", "SOPORTE"]);

    const puedeEliminar =
        esGerencia;


    // ======================================
    // ESTADOS
    // ======================================

    const [clientes, setClientes] =
        useState([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================
    // CARGAR CLIENTES
    // ======================================

    const cargarClientes =
        async () => {

            try {

                setLoading(true);

                setError("");


                /*
                    IMPORTANTE:

                    Ya NO consultamos directamente
                    FakeStoreAPI.

                    clientesService obtiene los
                    clientes almacenados en
                    localStorage.

                    FakeStoreAPI solamente se utiliza
                    para la carga inicial.
                */

                const lista =
                    await clienteService
                        .obtenerClientes();


                setClientes(
                    lista
                );


            } catch (error) {

                console.error(
                    "Error al cargar clientes:",
                    error
                );


                setError(
                    "Error al cargar los clientes."
                );


            } finally {

                setLoading(false);
            }
        };


    // ======================================
    // CARGA INICIAL
    // ======================================

    useEffect(() => {

        cargarClientes();

    }, []);


    // ======================================
    // ELIMINAR / DESHABILITAR
    // ======================================

    const manejarEliminar =
        async (id) => {

            // ==================================
            // VERIFICAR PERMISO (DEFENSA EN UI)
            // ==================================

            /*
                No alcanza con ocultar el botón en la interfaz.
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

            /*
                La eliminación es lógica.

                El registro permanece almacenado,
                pero cambia:

                is_active: true
                ↓
                is_active: false
            */

            const confirmar =
                window.confirm(
                    "¿Desea deshabilitar este cliente?"
                );


            if (!confirmar) {

                return;
            }


            try {

                await clienteService
                    .eliminarCliente(id, admin?.id);


                /*
                    Volvemos a cargar la lista para
                    reflejar inmediatamente el cambio.
                */

                await cargarClientes();


            } catch (error) {

                console.error(
                    "Error al eliminar cliente:",
                    error
                );


                setError(
                    error.message || "No se pudo deshabilitar el cliente."
                );
            }
        };


    // ======================================
    // CLIENTES ACTIVOS
    // ======================================

    /*
        IMPORTANTE:

        Los clientes con:

        is_active: false

        continúan almacenados pero NO deben
        aparecer en esta tabla.
    */

    const clientesActivos =
        clientes.filter(
            cliente =>
                cliente.is_active === true
        );


    // ======================================
    // FILTRAR POR BÚSQUEDA
    // ======================================

    const clientesFiltrados =
        clientesActivos.filter(
            cliente => {

                const apellido =
                    cliente.name
                        ?.lastname
                        ?.toLowerCase() ?? "";

                const ciudad =
                    cliente.address
                        ?.city
                        ?.toLowerCase() ?? "";

                const textoBusqueda =
                    busqueda
                        .trim()
                        .toLowerCase();


                return (

                    apellido.includes(
                        textoBusqueda
                    ) ||

                    ciudad.includes(
                        textoBusqueda
                    )
                );
            }
        );


    // ======================================
    // CARGANDO
    // ======================================

    if (loading) {

        return (

            <>
               

                <h2>
                    Cargando clientes...
                </h2>
            </>
        );
    }


    // ======================================
    // LISTA
    // ======================================

    return (

        <>

            


            <div className="clientes-container">

                <h1>
                    Clientes
                </h1>


                {/* ==================================
                    NUEVO CLIENTE
                ================================== */}

                {puedeEditar && (

                    <Link
                        className="btn-nuevo"
                        to="/clientes/nuevo"
                    >
                        Nuevo cliente
                    </Link>
                )}


                <hr />


                {/* ==================================
                    BUSCADOR
                ================================== */}

                <div className="contenedor-buscador">

                    <h2 className="titulo-buscador">
                        Buscar clientes
                    </h2>


                    <input
                        className="buscador"
                        type="text"

                        placeholder=
                            "Buscar por apellido o ciudad"

                        value={
                            busqueda
                        }

                        onChange={
                            event =>
                                setBusqueda(
                                    event.target.value
                                )
                        }
                    />


                    <p className="cantidad-clientes">

                        Clientes encontrados:{" "}

                        {
                            clientesFiltrados.length
                        }

                    </p>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <p className="mensaje-error">
                        {error}
                    </p>
                )}


                {/* ==================================
                    TABLA
                ================================== */}

                <table className="tabla-clientes">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Apellido
                            </th>

                            <th>
                                Nombre
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Teléfono
                            </th>

                            <th>
                                Ciudad
                            </th>

                            <th>
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {clientesFiltrados.map(
                            cliente => (

                                <tr
                                    key={
                                        cliente.id
                                    }
                                >

                                    {/* ID */}

                                    <td>
                                        {cliente.id}
                                    </td>


                                    {/* APELLIDO */}

                                    <td>
                                        {
                                            cliente.name
                                                ?.lastname
                                        }
                                    </td>


                                    {/* NOMBRE */}

                                    <td>
                                        {
                                            cliente.name
                                                ?.firstname
                                        }
                                    </td>


                                    {/* EMAIL */}

                                    <td>
                                        {cliente.email}
                                    </td>


                                    {/* TELÉFONO */}

                                    <td>
                                        {cliente.phone}
                                    </td>


                                    {/* CIUDAD */}

                                    <td>
                                        {
                                            cliente.address
                                                ?.city
                                        }
                                    </td>


                                    {/* ==================================
                                        ACCIONES
                                    ================================== */}

                                    <td>

    {/* ==================================
        VER DETALLES
        GERENTE + SOPORTE
    ================================== */}

    <Link
        className="btn-ficha"
        to={`/clientes/${cliente.id}`}
    >
        Ver detalles
    </Link>


    {/* ==================================
        EDITAR
        GERENTE + SOPORTE
    ================================== */}

    {puedeEditar && (

        <Link
            className="btn-editar"
            to={`/clientes/editar/${cliente.id}`}
        >
            Editar
        </Link>
    )}


    {/* ==================================
        ELIMINAR
        SOLO GERENTE
    ================================== */}

    {puedeEliminar && (

        <button
            type="button"
            className="btn-eliminar"
            onClick={() =>
                manejarEliminar(cliente.id)
            }
        >
            Eliminar
        </button>
    )}

</td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>


                {/* ==================================
                    LISTA VACÍA
                ================================== */}

                {
                    clientesFiltrados.length === 0 &&
                    !error &&
                    (

                        <p>
                            No se encontraron clientes activos.
                        </p>
                    )
                }

            </div>

        </>
    );
};


export default ListaClientes;