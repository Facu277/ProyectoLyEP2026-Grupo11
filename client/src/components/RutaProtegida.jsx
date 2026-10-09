import { Navigate } from "react-router-dom";
import useAutorizaciones from "../hooks/useAutorizaciones.js";

const RutaProtegida = ({
    children,
    rolesPermitidos = []
}) => {

    const {
        admin,
        tieneRol
    } = useAutorizaciones();


    // ==========================================
    // VERIFICAR SESIÓN
    // ==========================================

    // Si no existe una sesión iniciada,
    // redirigimos al login.
    if (!admin) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // VERIFICAR ROL
    // ==========================================

    // Si la ruta exige determinados sectores
    // y el administrador no pertenece a ellos,
    // vuelve al dashboard.
    if (
        rolesPermitidos.length > 0 &&
        !tieneRol(rolesPermitidos)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
};

export default RutaProtegida;