import {
    Routes,
    Route
} from "react-router-dom";

import Login
    from "../pages/Login.jsx";

import Dashboard
    from "../pages/Dashboard.jsx";

import ListaClientes
    from "../pages/ListaClientes.jsx";

import DetalleCliente
    from "../pages/DetalleCliente.jsx";

import ClienteFormPage
    from "../pages/ClienteFormPage.jsx";

import ErrorPage
    from "../pages/ErrorPage.jsx";

import RutaProtegida
    from "../components/RutaProtegida.jsx";

import MainLayout
    from "../layouts/MainLayout.jsx";


// ==========================================
// RUTAS
// ==========================================

const AppRoutes = () => {

    return (

        <Routes>

            {/* ==================================
                RUTAS PÚBLICAS
            ================================== */}


            {/* LOGIN DE ADMINISTRADORES */}

            <Route
                path="/login"
                element={
                    <Login />
                }
            />


            {/* ==================================
                CREAR CLIENTE
                RUTA PÚBLICA
            ================================== */}

            {/*
                IMPORTANTE:

                Esta ruta NO está protegida.

                Un visitante puede registrarse
                como CLIENTE sin haber iniciado
                sesión como administrador.
            */}

            <Route
                path="/clientes/nuevo"
                element={
                    <ClienteFormPage />
                }
            />


            {/* ==================================
                ÁREA ADMINISTRATIVA
            ================================== */}

            <Route
                element={

                    <RutaProtegida>

                        <MainLayout />

                    </RutaProtegida>
                }
            >


                {/* ==============================
                    DASHBOARD
                ============================== */}

                <Route
                    path="/"
                    element={
                        <Dashboard />
                    }
                />


                {/* ==============================
                    LISTA DE CLIENTES
                ============================== */}

                <Route
                    path="/clientes"
                    element={

                        <RutaProtegida
                            rolesPermitidos={[
                                "GERENTE",
                                "SOPORTE"
                            ]}
                        >

                            <ListaClientes />

                        </RutaProtegida>
                    }
                />


                {/* ==============================
                    DETALLE CLIENTE
                ============================== */}

                <Route
                    path="/clientes/:id"
                    element={

                        <RutaProtegida
                            rolesPermitidos={[
                                "GERENTE",
                                "SOPORTE"
                            ]}
                        >

                            <DetalleCliente />

                        </RutaProtegida>
                    }
                />


                {/* ==============================
                    EDITAR CLIENTE
                ============================== */}

                {/*
                    La edición SÍ está protegida.

                    Solamente GERENTE y SOPORTE
                    pueden modificar clientes.
                */}

                <Route
                    path="/clientes/editar/:id"
                    element={

                        <RutaProtegida
                            rolesPermitidos={[
                                "GERENTE",
                                "SOPORTE"
                            ]}
                        >

                            <ClienteFormPage />

                        </RutaProtegida>
                    }
                />

            </Route>


            {/* ==================================
                ERROR 404
            ================================== */}

            <Route
                path="*"
                element={
                    <ErrorPage />
                }
            />

        </Routes>
    );
};


export default AppRoutes;