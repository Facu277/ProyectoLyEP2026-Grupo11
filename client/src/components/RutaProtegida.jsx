import { Navigate } from "react-router-dom";
import useAutorizaciones from "../hooks/useAutorizaciones.js";

const RutaProtegida = ({
    children,
    rolesPermitidos = []
}) => {
    const { admin, tieneRol } = useAutorizaciones();

    // Verificar si existe una sesión.
    if (!admin) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Verificar los roles permitidos.
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