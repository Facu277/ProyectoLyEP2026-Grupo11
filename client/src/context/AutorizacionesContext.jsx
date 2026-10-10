import {
    createContext,
    useEffect,
    useState
} from "react";

export const AutorizacionesContext =
    createContext(null);

const AutorizacionesProvider = ({ children }) => {
    
const [admin, setAdmin] = useState(() => {
    try {
        const sesionGuardada = localStorage.getItem("admin");

        if (!sesionGuardada) {
            return null;
        }

        const sesion = JSON.parse(sesionGuardada);
        const administrador = sesion?.administrador;

        if (
            !sesion?.token ||
            !administrador?.id ||
            !["GERENTE", "SOPORTE"].includes(administrador.sector) ||
            administrador.is_active !== true
        ) {
            localStorage.removeItem("admin");
            return null;
        }

        return administrador;
    } catch {
        localStorage.removeItem("admin");
        return null;
    }
});


    const [token, setToken] = useState(() => {
        try {
            const sesionGuardada =
                localStorage.getItem("admin");

            if (!sesionGuardada) {
                return null;
            }

            const sesion = JSON.parse(sesionGuardada);

            return sesion.token || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (admin && token) {
            localStorage.setItem(
                "admin",
                JSON.stringify({
                    administrador: admin,
                    token
                })
            );
        } else {
            localStorage.removeItem("admin");
        }
    }, [admin, token]);

    // Recibe la respuesta exitosa del login.
    const iniciarSesion = (respuesta) => {
        const nuevoToken = respuesta?.token;
        const nuevoAdmin = respuesta?.administrador;

        if (
            !nuevoToken ||
            !nuevoAdmin ||
            !nuevoAdmin.id ||
            !["GERENTE", "SOPORTE"].includes(
                nuevoAdmin.sector
            ) ||
            nuevoAdmin.is_active !== true
        ) {
            return false;
        }

        setToken(nuevoToken);
        setAdmin(nuevoAdmin);

        return true;
    };

    const cerrarSesion = () => {
        setAdmin(null);
        setToken(null);
        localStorage.removeItem("admin");
    };

    const rol = admin?.sector ?? null;
    const esGerencia = rol === "GERENTE";
    const esSoporte = rol === "SOPORTE";

    const tieneRol = (rolesPermitidos = []) => {
        if (!admin || !admin.sector) {
            return false;
        }

        if (rolesPermitidos.length === 0) {
            return true;
        }

        return rolesPermitidos.includes(admin.sector);
    };

    return (
        <AutorizacionesContext.Provider
            value={{
                admin,
                token,
                iniciarSesion,
                setAdmin: iniciarSesion,
                cerrarSesion,
                rol,
                esGerencia,
                esSoporte,
                tieneRol
            }}
        >
            {children}
        </AutorizacionesContext.Provider>
    );
};

export default AutorizacionesProvider;