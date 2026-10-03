import { Administrador } from "../../models/models";


// ==========================================
// ADMINISTRADORES INICIALES
// ==========================================

export const administradores = [

    // ======================================
    // GERENTES
    // ======================================

    new Administrador({
        id: 101,
        email: "gerente1@empresa.com",
        username: "gerente1",
        password: "Gerente#123",
        name: {
            firstname: "Carlos",
            lastname: "Gomez"
        },
        phone: "3884000001",
        is_active: true,
        sector: "GERENTE"
    }),

    new Administrador({
        id: 102,
        email: "gerente2@empresa.com",
        username: "gerente2",
        password: "Gerente#123",
        name: {
            firstname: "Laura",
            lastname: "Diaz"
        },
        phone: "3884000002",
        is_active: true,
        sector: "GERENTE"
    }),


    // ======================================
    // SOPORTE
    // ======================================

    new Administrador({
        id: 103,
        email: "soporte1@empresa.com",
        username: "soporte1",
        password: "Soporte#123",
        name: {
            firstname: "Martin",
            lastname: "Lopez"
        },
        phone: "3884000003",
        is_active: true,
        sector: "SOPORTE"
    }),

    new Administrador({
        id: 104,
        email: "soporte2@empresa.com",
        username: "soporte2",
        password: "Soporte#123",
        name: {
            firstname: "Sofia",
            lastname: "Perez"
        },
        phone: "3884000004",
        is_active: true,
        sector: "SOPORTE"
    }),

    new Administrador({
        id: 105,
        email: "soporte3@empresa.com",
        username: "soporte3",
        password: "Soporte#123",
        name: {
            firstname: "Lucas",
            lastname: "Rodriguez"
        },
        phone: "3884000005",
        is_active: true,
        sector: "SOPORTE"
    })

];