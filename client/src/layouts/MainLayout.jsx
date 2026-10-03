import {
    Outlet
} from "react-router-dom";

import Header
    from "../components/Header.jsx";

import Nav
    from "../components/Nav.jsx";

import Footer
    from "../components/Footer.jsx";


// ==========================================
// LAYOUT PRINCIPAL
// ==========================================

const MainLayout = () => {

    return (

        <div className="app-layout">

            {/* ==================================
                HEADER
            ================================== */}

            <Header />


            {/* ==================================
                NAVEGACIÓN
            ================================== */}

            <Nav />


            {/* ==================================
                CONTENIDO DE CADA PÁGINA
            ================================== */}

            <main className="contenido-principal">

                {/*
                    Outlet será reemplazado por:

                    Dashboard
                    ListaClientes
                    DetalleCliente
                    ClienteFormPage
                    etc.
                */}

                <Outlet />

            </main>


            {/* ==================================
                FOOTER
            ================================== */}

            <Footer />

        </div>
    );
};


export default MainLayout;