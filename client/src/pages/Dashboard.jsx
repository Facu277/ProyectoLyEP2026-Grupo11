import "../css/dashboard.css";

import { useEffect, useState } from "react";
import useAutorizaciones from "../hooks/useAutorizaciones.js";
import clienteService from "../services/clientesService.js";
import estadisticasService from "../services/estadisticasService.js";

const Dashboard = () => {
    const { admin, esGerencia } = useAutorizaciones();

    const [resumen, setResumen] = useState({
        clientes: 0,
        clientesInactivos: 0,
        administradores: 0,
        gerentes: 0,
        soportes: 0
    });

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarResumen = async () => {
            try {
                setCargando(true);
                setError("");

                // Consultar clientes y estadísticas del backend.
                const [clientes, estadisticas] = await Promise.all([
                    clienteService.obtenerClientes(),
                    estadisticasService.obtenerEstadisticas()
                ]);

                if (!Array.isArray(clientes)) {
                    throw new Error(
                        "El servidor no devolvió una lista válida de clientes."
                    );
                }

                const clientesActivos = clientes.filter(
                    cliente => cliente.is_active === true
                );

                const clientesInactivos = clientes.filter(
                    cliente => cliente.is_active === false
                );

                setResumen({
                    clientes: clientesActivos.length,
                    clientesInactivos: clientesInactivos.length,
                    administradores: estadisticas.administradores,
                    gerentes: estadisticas.gerentes,
                    soportes: estadisticas.soportes
                });
            } catch (error) {
                console.error(
                    "Error al cargar el dashboard:",
                    error
                );

                setError(
                    error.message ||
                    "No se pudo cargar la información del dashboard."
                );
            } finally {
                setCargando(false);
            }
        };

        cargarResumen();
    }, []);

    if (cargando) {
        return (
            <div className="dashboard">
                <p>Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Panel de Control de Clientes</h1>

            <div className="user-card">
                <h3>Usuario conectado</h3>

                <p>
                    <strong>Administrador:</strong>{" "}
                    {admin?.name
                        ? `${admin.name.firstname ?? ""} ${admin.name.lastname ?? ""}`.trim()
                        : admin?.username ?? "Administrador"}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {admin?.email ?? "No disponible"}
                </p>

                <p>
                    <strong>Sector:</strong>{" "}
                    {esGerencia ? "Gerencia" : "Soporte"}
                </p>
            </div>

            {error && (
                <p className="mensaje-error">
                    {error}
                </p>
            )}

            {!error && (
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Clientes activos</h3>
                        <p>{resumen.clientes}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Clientes inactivos</h3>
                        <p>{resumen.clientesInactivos}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Administradores activos</h3>
                        <p>{resumen.administradores}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Gerentes activos</h3>
                        <p>{resumen.gerentes}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Personal de Soporte activo</h3>
                        <p>{resumen.soportes}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
