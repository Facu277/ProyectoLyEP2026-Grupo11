import "../css/nav.css";

import { NavLink } from "react-router-dom";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";


// ==========================================
// BARRA DE NAVEGACIÓN
// ==========================================

const Nav = () => {

    const { admin } =
        useAutorizaciones();


    // ======================================
    // SIN SESIÓN
    // ======================================

    // El menú solamente se muestra cuando
    // existe un administrador autenticado.
    if (!admin) {

        return null;
    }


    // ======================================
    // NAVEGACIÓN
    // ======================================

    return (

        <nav className="nav">

            <ul className="nav-lista">

                <li>

                    <NavLink to="/">
                        Dashboard
                    </NavLink>

                </li>


                <li>

                    <NavLink to="/clientes">
                        Clientes
                    </NavLink>

                </li>

            </ul>

        </nav>
    );
};


export default Nav;