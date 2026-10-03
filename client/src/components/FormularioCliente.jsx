import { useEffect, useState } from "react";
import {
    LIMITES_CLIENTE,
    validarCliente,
    passwordRules
} from "../../shared/validaciones.js";

// ==========================================
// DATOS INICIALES DEL FORMULARIO
// ==========================================

const formularioInicial = {
    email: "",
    username: "",
    password: "",
    name: {
        firstname: "",
        lastname: ""
    },
    phone: "",
    address: {
        city: "",
        street: "",
        number: "",
        zipcode: ""
    }
};

// ==========================================
// FORMULARIO CLIENTE
// ==========================================

const FormularioCliente = ({
    cliente = null,
    onSubmit,
    cargando = false
}) => {

    // ======================================
    // ESTADOS
    // ======================================

    const [formulario, setFormulario] = useState(formularioInicial);
    const [errores, setErrores] = useState({});
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Si recibimos un cliente estamos editando.
    const esEdicion = cliente !== null;

    // ======================================
    // CARGAR DATOS EN EDICIÓN
    // ======================================

    useEffect(() => {
        if (!cliente) {
            setFormulario(formularioInicial);
            setErrores({});
            setMostrarPassword(false);
            return;
        }

        /*
            IMPORTANTE:
            Durante la edición cargamos los datos
            del cliente pero NO su contraseña.

            La contraseña:
            - No se carga.
            - No se muestra.
            - No se modifica.
        */
        setFormulario({
            email: cliente.email ?? "",
            username: cliente.username ?? "",
            password: "",
            name: {
                firstname: cliente.name?.firstname ?? "",
                lastname: cliente.name?.lastname ?? ""
            },
            phone: cliente.phone ?? "",
            address: {
                city: cliente.address?.city ?? "",
                street: cliente.address?.street ?? "",
                number: cliente.address?.number ?? "",
                zipcode: cliente.address?.zipcode ?? ""
            }
        });

        setErrores({});
        setMostrarPassword(false);

    }, [cliente]);

    // ======================================
    // CAMBIAR CAMPOS SIMPLES
    // ======================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormulario(prev => ({
            ...prev,
            [name]: value
        }));

        // Quitamos el error mientras
        // el usuario corrige el campo.
        setErrores(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    // ======================================
    // CAMBIAR NOMBRE / APELLIDO
    // ======================================

    const handleNameChange = (event) => {
        const { name, value } = event.target;

        setFormulario(prev => ({
            ...prev,
            name: {
                ...prev.name,
                [name]: value
            }
        }));

        setErrores(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    // ======================================
    // CAMBIAR DIRECCIÓN
    // ======================================

    const handleAddressChange = (event) => {
        const { name, value } = event.target;

        setFormulario(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));

        setErrores(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    // ======================================
    // ENVIAR FORMULARIO
    // ======================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Preparamos los datos.
        const datosCliente = {
            ...formulario,
            address: {
                ...formulario.address,
                number: Number(formulario.address.number)
            }
        };

        /*
            IMPORTANTE:
            En edición eliminamos password antes
            de enviar los datos.

            clientesService conservará la
            contraseña existente.
        */
        if (esEdicion) {
            delete datosCliente.password;
        }

        // ==================================
        // VALIDAR CLIENTE
        // ==================================

        /*
            CREAR:
            validarPassword = true

            EDITAR:
            validarPassword = false
        */
        const resultadoValidacion = validarCliente(
            datosCliente,
            {
                validarPassword: !esEdicion
            }
        );

        // Si hay errores, mostramos los mensajes
        // provenientes de validaciones.js.
        if (!resultadoValidacion.valid) {
            setErrores(resultadoValidacion.errors);
            return;
        }

        setErrores({});

        // ==================================
        // ENVIAR AL PAGE / SERVICE
        // ==================================

        try {
            await onSubmit(datosCliente);

        } catch (error) {
            /*
                clientesService también valida.

                Si devuelve errores de validación,
                los mostramos debajo de cada campo.
            */
            if (error.validationErrors) {
                setErrores(error.validationErrors);
                return;
            }

            console.error(
                "Error al guardar cliente:",
                error
            );
        }
    };

    // ======================================
    // REGLAS DE PASSWORD
    // ======================================

    const reglasPassword = passwordRules(
        formulario.password
    );

    // ======================================
    // FORMULARIO
    // ======================================

    return (
        <form onSubmit={handleSubmit} noValidate>

            {/* ==================================
                DATOS PERSONALES
            ================================== */}

            <h2>Datos personales</h2>

            {/* NOMBRE */}
            <div>
                <label htmlFor="firstname">
                    Nombre *
                </label>

                <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={formulario.name.firstname}
                    onChange={handleNameChange}
                    minLength={LIMITES_CLIENTE.firstname.min}
                    maxLength={LIMITES_CLIENTE.firstname.max}
                    required
                />

                {errores.firstname && (
                    <p className="mensaje-error">
                        ⚠ {errores.firstname}
                    </p>
                )}
            </div>

            {/* APELLIDO */}
            <div>
                <label htmlFor="lastname">
                    Apellido *
                </label>

                <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formulario.name.lastname}
                    onChange={handleNameChange}
                    minLength={LIMITES_CLIENTE.lastname.min}
                    maxLength={LIMITES_CLIENTE.lastname.max}
                    required
                />

                {errores.lastname && (
                    <p className="mensaje-error">
                        ⚠ {errores.lastname}
                    </p>
                )}
            </div>

            {/* TELÉFONO */}
            <div>
                <label htmlFor="phone">
                    Teléfono *
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formulario.phone}
                    onChange={handleChange}
                    minLength={LIMITES_CLIENTE.phone.min}
                    maxLength={LIMITES_CLIENTE.phone.max}
                    required
                />

                {errores.phone && (
                    <p className="mensaje-error">
                        ⚠ {errores.phone}
                    </p>
                )}

                <small>
                    Entre 7 y 15 números.
                </small>
            </div>

            {/* ==================================
                DATOS DE CUENTA
            ================================== */}

            <h2>Datos de cuenta</h2>

            {/* USERNAME */}
            <div>
                <label htmlFor="username">
                    Nombre de usuario *
                </label>

                <input
                    id="username"
                    name="username"
                    type="text"
                    value={formulario.username}
                    onChange={handleChange}
                    minLength={LIMITES_CLIENTE.username.min}
                    maxLength={LIMITES_CLIENTE.username.max}
                    required
                />

                {errores.username && (
                    <p className="mensaje-error">
                        ⚠ {errores.username}
                    </p>
                )}
            </div>

            {/* EMAIL */}
            <div>
                <label htmlFor="email">
                    Correo electrónico *
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={handleChange}
                    maxLength={LIMITES_CLIENTE.email.max}
                    required
                />

                {errores.email && (
                    <p className="mensaje-error">
                        ⚠ {errores.email}
                    </p>
                )}
            </div>

            {/* ==================================
                PASSWORD
                SOLO DURANTE LA CREACIÓN
            ================================== */}

            {!esEdicion && (
                <div>
                    <label htmlFor="password">
                        Contraseña *
                    </label>

                    <div className="password-container">
                        <input
                            id="password"
                            name="password"
                            type={
                                mostrarPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formulario.password}
                            onChange={handleChange}
                            minLength={LIMITES_CLIENTE.password.min}
                            maxLength={LIMITES_CLIENTE.password.max}
                            required
                        />

                        {/* VER / OCULTAR CONTRASEÑA */}
                        <button
                            type="button"
                            onClick={() =>
                                setMostrarPassword(
                                    prev => !prev
                                )
                            }
                        >
                            {
                                mostrarPassword
                                    ? "Ocultar contraseña"
                                    : "Ver contraseña"
                            }
                        </button>
                    </div>

                    {errores.password && (
                        <p className="mensaje-error">
                            ⚠ {errores.password}
                        </p>
                    )}

                    {/* REQUISITOS DE CONTRASEÑA */}
                    <div className="password-requisitos">
                        <small>
                            La contraseña debe cumplir:
                        </small>

                        <ul>
                            <li>
                                {reglasPassword.length ? "✓" : "✗"}
                                {" "}Entre 8 y 20 caracteres
                            </li>

                            <li>
                                {reglasPassword.upper ? "✓" : "✗"}
                                {" "}Una letra mayúscula
                            </li>

                            <li>
                                {reglasPassword.lower ? "✓" : "✗"}
                                {" "}Una letra minúscula
                            </li>

                            <li>
                                {reglasPassword.digit ? "✓" : "✗"}
                                {" "}Un número
                            </li>

                            <li>
                                {reglasPassword.special ? "✓" : "✗"}
                                {" "}Un símbolo
                            </li>

                            <li>
                                {reglasPassword.noSpaces ? "✓" : "✗"}
                                {" "}Sin espacios
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ==================================
                DIRECCIÓN
            ================================== */}

            <h2>Dirección</h2>

            {/* CIUDAD */}
            <div>
                <label htmlFor="city">
                    Ciudad *
                </label>

                <input
                    id="city"
                    name="city"
                    type="text"
                    value={formulario.address.city}
                    onChange={handleAddressChange}
                    minLength={LIMITES_CLIENTE.city.min}
                    maxLength={LIMITES_CLIENTE.city.max}
                    required
                />

                {errores.city && (
                    <p className="mensaje-error">
                        ⚠ {errores.city}
                    </p>
                )}
            </div>

            {/* CALLE */}
            <div>
                <label htmlFor="street">
                    Calle *
                </label>

                <input
                    id="street"
                    name="street"
                    type="text"
                    value={formulario.address.street}
                    onChange={handleAddressChange}
                    minLength={LIMITES_CLIENTE.street.min}
                    maxLength={LIMITES_CLIENTE.street.max}
                    required
                />

                {errores.street && (
                    <p className="mensaje-error">
                        ⚠ {errores.street}
                    </p>
                )}
            </div>

            {/* NÚMERO */}
            <div>
                <label htmlFor="number">
                    Número *
                </label>

                <input
                    id="number"
                    name="number"
                    type="number"
                    value={formulario.address.number}
                    onChange={handleAddressChange}
                    min={LIMITES_CLIENTE.number.min}
                    max={LIMITES_CLIENTE.number.max}
                    required
                />

                {errores.number && (
                    <p className="mensaje-error">
                        ⚠ {errores.number}
                    </p>
                )}
            </div>

            {/* CÓDIGO POSTAL */}
            <div>
                <label htmlFor="zipcode">
                    Código postal *
                </label>

                <input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    value={formulario.address.zipcode}
                    onChange={handleAddressChange}
                    minLength={LIMITES_CLIENTE.zipcode.min}
                    maxLength={LIMITES_CLIENTE.zipcode.max}
                    required
                />

                {errores.zipcode && (
                    <p className="mensaje-error">
                        ⚠ {errores.zipcode}
                    </p>
                )}
            </div>

            {/* ==================================
                BOTÓN GUARDAR
            ================================== */}

            <button
                type="submit"
                disabled={cargando}
            >
                {
                    cargando
                        ? "Guardando..."
                        : esEdicion
                            ? "Guardar cambios"
                            : "Crear cliente"
                }
            </button>

        </form>
    );
};

export default FormularioCliente;