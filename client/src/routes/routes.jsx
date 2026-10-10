
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ListaClientes from "../pages/ListaClientes.jsx";
import DetalleCliente from "../pages/DetalleCliente.jsx";
import ClienteFormPage from "../pages/ClienteFormPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";

import RutaProtegida from "../components/RutaProtegida.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTAS PÚBLICAS */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* Registro público de clientes */}
            <Route
                path="/clientes/nuevo"
                element={<ClienteFormPage />}
            />

            {/* ÁREA ADMINISTRATIVA: requiere sesión */}
            <Route
                element={
                    <RutaProtegida>
                        <MainLayout />
                    </RutaProtegida>
                }
            >
                {/* Dashboard: cualquier administrador autenticado */}
                <Route
                    path="/"
                    element={<Dashboard />}
                />

                {/* Lista de clientes */}
                <Route
                    path="/clientes"
                    element={
                        <RutaProtegida
                            rolesPermitidos={["GERENTE", "SOPORTE"]}
                        >
                            <ListaClientes />
                        </RutaProtegida>
                    }
                />

                {/* Detalle de cliente */}
                <Route
                    path="/clientes/:id"
                    element={
                        <RutaProtegida
                            rolesPermitidos={["GERENTE", "SOPORTE"]}
                        >
                            <DetalleCliente />
                        </RutaProtegida>
                    }
                />

                {/* Edición de cliente */}
                <Route
                    path="/clientes/editar/:id"
                    element={
                        <RutaProtegida
                            rolesPermitidos={["GERENTE", "SOPORTE"]}
                        >
                            <ClienteFormPage />
                        </RutaProtegida>
                    }
                />
            </Route>

            {/* PÁGINA NO ENCONTRADA */}
            <Route
                path="*"
                element={<ErrorPage />}
            />
        </Routes>
    );
};

export default AppRoutes;
