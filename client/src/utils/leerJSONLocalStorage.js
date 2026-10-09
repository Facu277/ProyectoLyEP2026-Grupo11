// ==========================================
// LEER JSON DESDE LOCALSTORAGE
// ==========================================

/*
    localStorage solo guarda texto.

    Si el contenido no es JSON válido,
    JSON.parse lanza un error.

    En ese caso:

    - registramos el error
    - borramos la clave inválida
    - devolvemos el valor de respaldo
*/

const leerJSONLocalStorage = (
    clave,
    respaldo = null
) => {

    try {

        const valorGuardado =
            localStorage.getItem(clave);


        if (!valorGuardado) {

            return respaldo;
        }


        return JSON.parse(
            valorGuardado
        );

    } catch (error) {

        console.error(
            `Error al leer "${clave}" desde localStorage:`,
            error
        );

        localStorage.removeItem(clave);

        return respaldo;
    }
};


export default leerJSONLocalStorage;
