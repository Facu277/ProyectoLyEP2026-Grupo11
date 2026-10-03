// ==========================================
// SECTORES DE ADMINISTRADORES
// ==========================================

// Lista fija para evitar errores de tipeo.
export const SECTORES = Object.freeze([
    "GERENTE",
    "SOPORTE"
]);


// ==========================================
// LÍMITES DE LOS CAMPOS
// ==========================================

// Estos límites podrán reutilizarse en los
// formularios React con minLength, maxLength,
// min y max.
export const LIMITES_CLIENTE = Object.freeze({

    firstname: {
        min: 2,
        max: 50
    },

    lastname: {
        min: 2,
        max: 50
    },

    username: {
        min: 3,
        max: 24
    },

    email: {
        max: 100
    },

    password: {
        min: 8,
        max: 20
    },

    phone: {
        min: 7,
        max: 15
    },

    city: {
        min: 2,
        max: 80
    },

    street: {
        min: 2,
        max: 100
    },

    number: {
        min: 1,
        max: 999999
    },

    zipcode: {
        min: 3,
        max: 12
    }
});


// ==========================================
// REGLAS DE CONTRASEÑA
// ==========================================

// Por ahora la contraseña NO se encripta.
// Solamente se controla que cumpla las reglas.
export const passwordRules = (value) => {

    const password =
        typeof value === "string"
            ? value
            : "";

    return {

        // Entre 8 y 20 caracteres.
        length:
            password.length >= LIMITES_CLIENTE.password.min &&
            password.length <= LIMITES_CLIENTE.password.max,

        // Al menos una letra mayúscula.
        upper:
            /[A-Z]/.test(password),

        // Al menos una letra minúscula.
        lower:
            /[a-z]/.test(password),

        // Al menos un número.
        digit:
            /[0-9]/.test(password),

        // Al menos un símbolo.
        special:
            /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~\-]/.test(password),

        // No permite espacios.
        noSpaces:
            /^[^\s]+$/.test(password)
    };
};


// ==========================================
// VALIDAR CONTRASEÑA
// ==========================================

export const validPassword = (value) => {

    return Object
        .values(passwordRules(value))
        .every(Boolean);
};


// ==========================================
// VALIDAR CLIENTE
// ==========================================

export function validarCliente(
    input,
    { validarPassword = true } = {}
) {

    const errors = {};


    // ======================================
    // VALIDAR OBJETO RECIBIDO
    // ======================================

    const obj =
        input &&
        typeof input === "object" &&
        !Array.isArray(input)
            ? input
            : {};


    // Limpia espacios al principio y final
    // y normaliza caracteres.
    const str = (value) => {

        return typeof value === "string"
            ? value.trim().normalize("NFC")
            : "";
    };


    // ======================================
    // NORMALIZAR DATOS
    // ======================================

    const data = {

        email:
            str(obj.email).toLowerCase(),

        username:
            str(obj.username).toLowerCase(),

        password:
            typeof obj.password === "string"
                ? obj.password
                : "",

        name: {

            firstname:
                str(obj.name?.firstname),

            lastname:
                str(obj.name?.lastname)
        },

        // Se eliminan guiones antes de validar
        // y almacenar el teléfono.
        phone:
            typeof obj.phone === "string"
                ? obj.phone.replace(/-/g, "").trim()
                : "",

        // Conservamos el estado recibido.
        // Si no existe, el cliente comienza activo.
        is_active:
            typeof obj.is_active === "boolean"
                ? obj.is_active
                : true,

        tipo: "CLIENTE",

        address: {

            city:
                str(obj.address?.city),

            street:
                str(obj.address?.street),

            number:
                Number(obj.address?.number),

            zipcode:
                str(obj.address?.zipcode)
        }
    };


    // ======================================
    // NOMBRE
    // ======================================

    if (!data.name.firstname) {

        errors.firstname =
            "El nombre es obligatorio.";

    } else if (
        data.name.firstname.length <
            LIMITES_CLIENTE.firstname.min ||
        data.name.firstname.length >
            LIMITES_CLIENTE.firstname.max
    ) {

        errors.firstname =
            "El nombre debe tener entre 2 y 50 caracteres.";

    } else if (
        !/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u
            .test(data.name.firstname)
    ) {

        errors.firstname =
            "El nombre solo puede contener letras, espacios, apóstrofos o guiones.";
    }


    // ======================================
    // APELLIDO
    // ======================================

    if (!data.name.lastname) {

        errors.lastname =
            "El apellido es obligatorio.";

    } else if (
        data.name.lastname.length <
            LIMITES_CLIENTE.lastname.min ||
        data.name.lastname.length >
            LIMITES_CLIENTE.lastname.max
    ) {

        errors.lastname =
            "El apellido debe tener entre 2 y 50 caracteres.";

    } else if (
        !/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u
            .test(data.name.lastname)
    ) {

        errors.lastname =
            "El apellido solo puede contener letras, espacios, apóstrofos o guiones.";
    }


    // ======================================
    // USERNAME
    // ======================================

    if (!data.username) {

        errors.username =
            "El nombre de usuario es obligatorio.";

    } else if (
        data.username.length <
            LIMITES_CLIENTE.username.min ||
        data.username.length >
            LIMITES_CLIENTE.username.max
    ) {

        errors.username =
            "El usuario debe tener entre 3 y 24 caracteres.";

    } else if (
        !/^[a-z0-9._]+$/.test(data.username)
    ) {

        errors.username =
            "El usuario solo puede contener letras minúsculas, números, puntos y guion bajo.";
    }


    // ======================================
    // EMAIL
    // ======================================

    if (!data.email) {

        errors.email =
            "El correo electrónico es obligatorio.";

    } else if (
        data.email.length >
        LIMITES_CLIENTE.email.max
    ) {

        errors.email =
            "El correo electrónico no puede superar los 100 caracteres.";

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {

        errors.email =
            "Ingresá un correo electrónico válido.";
    }


    // ======================================
    // TELÉFONO
    // ======================================

    if (!data.phone) {

        errors.phone =
            "El teléfono es obligatorio.";

    } else if (
        !new RegExp(
            `^[0-9]{${LIMITES_CLIENTE.phone.min},${LIMITES_CLIENTE.phone.max}}$`
        ).test(data.phone)
    ) {

        errors.phone =
            "El teléfono debe contener entre 7 y 15 números.";
    }


    // ======================================
    // CONTRASEÑA
    // ======================================

    /*
        CREATE:
        validarPassword = true

        La contraseña es obligatoria
        y debe cumplir todas las reglas.

        UPDATE:
        validarPassword = false

        La contraseña actual se conserva,
        pero no se vuelve a validar.
    */

    if (validarPassword) {

        if (!data.password) {

            errors.password =
                "La contraseña es obligatoria.";

        } else if (!validPassword(data.password)) {

            errors.password =
                "La contraseña debe tener entre 8 y 20 caracteres e incluir mayúscula, minúscula, número y símbolo, sin espacios.";
        }
    }


    // ======================================
    // CIUDAD
    // ======================================

    if (!data.address.city) {

        errors.city =
            "La ciudad es obligatoria.";

    } else if (
        data.address.city.length <
            LIMITES_CLIENTE.city.min ||
        data.address.city.length >
            LIMITES_CLIENTE.city.max
    ) {

        errors.city =
            "La ciudad debe tener entre 2 y 80 caracteres.";

    } else if (
        !/^[\p{L}\p{M}\d .,'()\-]+$/u
            .test(data.address.city)
    ) {

        errors.city =
            "La ciudad contiene caracteres no permitidos.";
    }


    // ======================================
    // CALLE
    // ======================================

    if (!data.address.street) {

        errors.street =
            "La calle es obligatoria.";

    } else if (
        data.address.street.length <
            LIMITES_CLIENTE.street.min ||
        data.address.street.length >
            LIMITES_CLIENTE.street.max
    ) {

        errors.street =
            "La calle debe tener entre 2 y 100 caracteres.";

    } else if (
        !/^[\p{L}\p{M}\d .,'()º°\-]+$/u
            .test(data.address.street)
    ) {

        errors.street =
            "La calle contiene caracteres no permitidos.";
    }


    // ======================================
    // NÚMERO DE DIRECCIÓN
    // ======================================

    if (
        !Number.isInteger(data.address.number) ||
        data.address.number <
            LIMITES_CLIENTE.number.min ||
        data.address.number >
            LIMITES_CLIENTE.number.max
    ) {

        errors.number =
            "El número debe ser un entero entre 1 y 999999.";
    }


    // ======================================
    // CÓDIGO POSTAL
    // ======================================

    if (!data.address.zipcode) {

        errors.zipcode =
            "El código postal es obligatorio.";

    } else if (
        data.address.zipcode.length <
            LIMITES_CLIENTE.zipcode.min ||
        data.address.zipcode.length >
            LIMITES_CLIENTE.zipcode.max
    ) {

        errors.zipcode =
            "El código postal debe tener entre 3 y 12 caracteres.";

    } else if (
        !/^[a-zA-Z0-9 -]+$/.test(
            data.address.zipcode
        )
    ) {

        errors.zipcode =
            "El código postal solo puede contener letras, números, espacios o guiones.";
    }


    // ======================================
    // RESULTADO
    // ======================================

    return {

        // Datos ya normalizados.
        data,

        // Errores encontrados.
        errors,

        // true solamente cuando no hay errores.
        valid:
            Object.keys(errors).length === 0
    };
}