import "../css/dashboard.css";

import {
    useEffect,
    useState
} from "react";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";

import {
    inicializarUsuarios
} from "../services/inicializarUsuariosService.js";

import Nav
    from "../components/Nav.jsx";


// ==========================================
// DASHBOARD
// ==========================================

const Dashboard = () => {

    // ======================================
    // ADMINISTRADOR EN SESIÓN
    // ======================================

    const {
        admin,
        esGerencia
    } = useAutorizaciones();


    // ======================================
    // ESTADO DE ESTADÍSTICAS
    // ======================================

    const [resumen, setResumen] =
        useState({

            clientes: 0,

            administradores: 0,

            gerentes: 0,

            soportes: 0
        });


    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================
    // CARGAR INFORMACIÓN
    // ======================================

    useEffect(() => {

        const cargarResumen =
            async () => {

                try {

                    setCargando(true);

                    setError("");


                    // Obtenemos las cuatro listas
                    // utilizadas por el sistema.
                    const usuarios =
                        await inicializarUsuarios();


                    // ==================================
                    // CLIENTES ACTIVOS
                    // ==================================

                    /*
                        Para el dashboard contamos
                        solamente clientes activos.

                        Los clientes deshabilitados
                        continúan almacenados pero
                        no forman parte de esta cifra.
                    */

                    const clientesActivos =
                        usuarios.clientes.filter(
                            cliente =>
                                cliente.is_active === true
                        );


                    // ==================================
                    // ACTUALIZAR ESTADÍSTICAS
                    // ==================================

                    setResumen({

                        clientes:
                            clientesActivos.length,

                        administradores:
                            usuarios.administradores.length,

                        gerentes:
                            usuarios.gerentes.length,

                        soportes:
                            usuarios.soportes.length
                    });


                } catch (error) {

                    console.error(
                        "Error al cargar el dashboard:",
                        error
                    );


                    setError(
                        "No se pudo cargar la información del dashboard."
                    );


                } finally {

                    setCargando(false);
                }
            };


        cargarResumen();

    }, []);


    // ======================================
    // CARGANDO
    // ======================================

    if (cargando) {

        return (

            <>
                

                <div className="dashboard">

                    <p>
                        Cargando dashboard...
                    </p>

                </div>
            </>
        );
    }


    // ======================================
    // DASHBOARD
    // ======================================

    return (

        <>

            


            <div className="dashboard">

                <h1>
                    Panel de Control de Clientes
                </h1>


                {/* ==================================
                    ADMINISTRADOR CONECTADO
                ================================== */}

                <div className="user-card">

                    <h3>
                        Usuario conectado
                    </h3>


                    <p>

                        <strong>
                            Administrador:
                        </strong>

                        {" "}

                        {
                            admin?.name
                                ? `${admin.name.firstname} ${admin.name.lastname}`
                                : admin?.username
                        }

                    </p>


                    <p>

                        <strong>
                            Email:
                        </strong>

                        {" "}

                        {admin?.email}

                    </p>


                    <p>

                        <strong>
                            Sector:
                        </strong>

                        {" "}

                        {
                            esGerencia
                                ? "Gerencia"
                                : "Soporte"
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
                    ESTADÍSTICAS
                ================================== */}

                <div className="dashboard-cards">


                    {/* CLIENTES */}

                    <div className="dashboard-card">

                        <h3>
                            Clientes activos
                        </h3>

                        <p>
                            {resumen.clientes}
                        </p>

                    </div>


                    {/* ADMINISTRADORES */}

                    <div className="dashboard-card">

                        <h3>
                            Administradores
                        </h3>

                        <p>
                            {resumen.administradores}
                        </p>

                    </div>


                    {/* GERENCIA */}

                    <div className="dashboard-card">

                        <h3>
                            Gerencia
                        </h3>

                        <p>
                            {resumen.gerentes}
                        </p>

                    </div>


                    {/* SOPORTE */}

                    <div className="dashboard-card">

                        <h3>
                            Soporte
                        </h3>

                        <p>
                            {resumen.soportes}
                        </p>

                    </div>

                </div>

            </div>

        </>
    );
};


export default Dashboard;