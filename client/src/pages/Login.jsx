import "../css/login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAutorizaciones
    from "../hooks/useAutorizaciones.js";

import AutorizacionesService
    from "../services/autorizacionesServices.js";


// ==========================================
// LOGIN DE ADMINISTRADORES
// ==========================================

const Login = () => {

    // ======================================
    // ESTADOS DEL FORMULARIO
    // ======================================

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [mostrarPassword, setMostrarPassword] =
        useState(false);

    const [errores, setErrores] =
        useState({});

    const [cargando, setCargando] = useState(false);


    // ======================================
    // CONTEXTO DE AUTORIZACIONES
    // ======================================

    // iniciarSesion establece la sesión del administrador
    // en base a su id y la lista canónica.
    const { iniciarSesion } =
        useAutorizaciones();


    // Permite redirigir después del login.
    const navigate =
        useNavigate();


    // ======================================
    // VALIDAR FORMULARIO
    // ======================================

    const validar = () => {

        const nuevosErrores = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // ==================================
        // VALIDAR EMAIL
        // ==================================

        if (!email.trim()) {

            nuevosErrores.email =
                "El email es obligatorio.";

        } else if (
            !emailRegex.test(
                email.trim()
            )
        ) {

            nuevosErrores.email =
                "Ingresá un email válido.";
        }


        // ==================================
        // VALIDAR PASSWORD
        // ==================================

        /*
            IMPORTANTE:

            En el LOGIN no comprobamos reglas
            de complejidad como:

            - mayúscula
            - minúscula
            - número
            - símbolo
            - longitud

            Esas reglas corresponden al momento
            de CREAR o CAMBIAR una contraseña.

            En el login solamente verificamos
            que el campo tenga un valor.

            Luego AutorizacionesService compara
            la contraseña ingresada con la del
            administrador correspondiente.
        */

        if (!password) {

            nuevosErrores.password =
                "La contraseña es obligatoria.";
        }


        // Guardamos todos los errores encontrados.
        setErrores(
            nuevosErrores
        );


        // El formulario es válido solamente
        // cuando no existen errores.
        return (
            Object.keys(
                nuevosErrores
            ).length === 0
        );
    };


    // ======================================
    // INICIAR SESIÓN
    // ======================================

    
const manejarSubmit = async (event) => {
    event.preventDefault();

    if (!validar()) {
        return;
    }

    setCargando(true);
    setErrores({});

    try {
        // El backend verifica las credenciales y devuelve el JWT.
        const respuesta = await AutorizacionesService.login(
            email.trim(),
            password
        );

        // El contexto guarda el token y los datos del administrador.
        const sesionCreada = iniciarSesion(respuesta);

        if (!sesionCreada) {
            setErrores({
                login: "No se pudo establecer la sesión del administrador."
            });
            return;
        }

        navigate("/", { replace: true });
    } catch (error) {
        const status = error.response?.status;

        let mensaje = "No se pudo iniciar sesión. Intentá nuevamente.";

        if (status === 400 || status === 401) {
            mensaje = "Email o contraseña incorrectos.";
        } else if (status === 403) {
            mensaje = "Este administrador se encuentra deshabilitado.";
        } else if (!error.response) {
            mensaje = "No se pudo conectar con el servidor.";
        } else if (error.response?.data?.error) {
            mensaje = error.response.data.error;
        }

        setErrores({ login: mensaje });
    } finally {
        setCargando(false);
    }
};



    // ======================================
    // MOSTRAR / OCULTAR PASSWORD
    // ======================================

    const alternarPassword = () => {

        setMostrarPassword(
            estadoActual =>
                !estadoActual
        );
    };


    // ======================================
    // INTERFAZ
    // ======================================

    return (

        <div className="login-container">

            <h1>
                Iniciar Sesión
            </h1>


            <form
                onSubmit={manejarSubmit}
                noValidate
            >

                {/* ==================================
                    EMAIL
                ================================== */}

                <label htmlFor="email">
                    Email:
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"

                    value={email}

                    onChange={(event) => {

                        setEmail(
                            event.target.value
                        );


                        // Cuando el usuario comienza
                        // a corregir el email,
                        // quitamos el error anterior.
                        setErrores(prev => ({

                            ...prev,

                            email:
                                undefined,

                            login:
                                undefined
                        }));
                    }}
                />


                {/* MENSAJE DE ERROR DEL EMAIL */}

                <p
                    style={{
                        color: "red",
                        minHeight: "18px"
                    }}
                >
                    {errores.email || " "}
                </p>


                {/* ==================================
                    PASSWORD
                ================================== */}

                <label htmlFor="password">
                    Contraseña:
                </label>


                <div className="password-container">

                    <input
                        id="password"
                        name="password"

                        /*
                            Si mostrarPassword es true,
                            mostramos el contenido.

                            Si es false, usamos el
                            comportamiento normal de
                            una contraseña.
                        */
                        type={
                            mostrarPassword
                                ? "text"
                                : "password"
                        }

                        value={password}

                        onChange={(event) => {

                            setPassword(
                                event.target.value
                            );


                            // Quitamos los errores
                            // mientras el usuario
                            // corrige la contraseña.
                            setErrores(prev => ({

                                ...prev,

                                password:
                                    undefined,

                                login:
                                    undefined
                            }));
                        }}
                    />


                    {/* ==============================
                        VER / OCULTAR CONTRASEÑA
                    ============================== */}

                    <button
                        type="button"
                        onClick={
                            alternarPassword
                        }
                    >

                        {
                            mostrarPassword
                                ? "Ocultar contraseña"
                                : "Ver contraseña"
                        }

                    </button>

                </div>


                {/* MENSAJE DE ERROR DE PASSWORD */}

                <p
                    style={{
                        color: "red",
                        minHeight: "18px"
                    }}
                >
                    {errores.password || " "}
                </p>


                {/* ==================================
                    ERROR GENERAL DEL LOGIN
                ================================== */}

                {errores.login && (

                    <p
                        style={{
                            color: "red"
                        }}
                    >
                        {errores.login}
                    </p>
                )}


                {/* ==================================
                    BOTÓN INGRESAR
                ================================== */}

                <button
                    type="submit"
                >
                    Ingresar
                </button>

            </form>

        </div>
    );
};


export default Login;