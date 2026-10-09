import {
    administradores
} from "./administradoresInicializados.js";


// ==========================================
// SERVICIO DE AUTORIZACIONES
// ==========================================

const login = (
    email,
    password
) => {

    // ======================================
    // BUSCAR ADMINISTRADOR
    // ======================================

    /*
        Buscamos utilizando:

        - email
        - password

        El sector NO se solicita al usuario.

        GERENTE o SOPORTE se obtiene
        directamente del administrador.
    */

    const administrador =
        administradores.find(
            admin =>

                admin.email.toLowerCase() ===
                email.toLowerCase() &&

                admin.passwordForStorage() ===
                password
        );


    // ======================================
    // ADMINISTRADOR NO ENCONTRADO
    // ======================================

    if (!administrador) {

        return null;
    }


    // ======================================
    // DEVOLVER DATOS SEGUROS
    // ======================================

    /*
        toJSON() no devuelve password.

        Esto evita que la contraseña pase
        al Context o quede guardada en
        localStorage como parte de la sesión.
    */

    return administrador.toJSON();
};


// ==========================================
// EXPORTAR SERVICE
// ==========================================

export default {
    login
};