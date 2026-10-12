# Proyecto LyEP 2026
# ProyectoLyEP2026 --- Backend

**Proyecto:** ProyectoLyEP2026 --- Grupo 11\
**Stack:** Node.js, Express, MongoDB Atlas, JWT

## 1. Descripción

Backend REST para la gestión de clientes y administradores. La API se
ejecuta localmente en el puerto `3001`, persiste información en MongoDB
y expone rutas para clientes, autenticación y estadísticas del
Dashboard.

## 2. Tecnologías

-   Node.js y Express: servidor HTTP y API REST.
-   MongoDB Atlas: persistencia de clientes y administradores.
-   `dotenv`: configuración mediante variables de entorno.
-   `cors`: permite solicitudes desde el frontend.
-   `bcryptjs`: hash y comparación de contraseñas.
-   `jsonwebtoken`: creación y validación de tokens JWT.
-   `nodemon`: reinicio automático durante desarrollo.

## 3. Estructura

La estructura exacta debe contrastarse con el repositorio; las
responsabilidades principales son:

``` text
server/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   └── clientes.controller.js
├── middleware/
│   └── middleware de autenticación y errores
├── models/
│   ├── administrador.model.js
│   └── modelo de cliente
├── routes/
│   ├── auth.routes.js
│   └── clientes.routes.js
├── .env
├── package.json
└── server.js
```

-   `server.js`: configura Express, CORS y JSON, conecta la base de
    datos, inicializa administradores y registra los routers.
-   `config/db.js`: conexión a MongoDB.
-   `models/`: acceso a las colecciones.
-   `controllers/`: lógica de las operaciones y respuestas HTTP.
-   `routes/`: definición de métodos y rutas.
-   `middleware/`: autenticación JWT, permisos por sector y manejo
    centralizado de errores.

## 4. Requisitos

-   Node.js y npm.
-   Una base MongoDB Atlas o una instancia MongoDB accesible.
-   Git para clonar el repositorio.

## 5. Variables de entorno

Crear `server/.env` con las variables que espera realmente
`config/db.js` y el código del proyecto. Plantilla orientativa:

``` dotenv
PORT=3001
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER/BASE_DE_DATOS
JWT_SECRET=REEMPLAZAR_POR_UN_SECRETO_LARGO_Y_ALEATORIO
```

Si el código usa otro nombre para la URI de MongoDB, conservar ese
nombre. No subir `.env` al repositorio. Añadirlo a `.gitignore` y
definir las variables de producción en la configuración del servicio de
deploy. Usar un `JWT_SECRET` seguro y diferente en producción.

En MongoDB Atlas, crear un usuario de base de datos y configurar
*Network Access* para permitir la conexión desde el entorno donde corre
el backend. Evitar abrir el acceso a cualquier IP en producción sin
evaluar el riesgo.

## 6. Ejecución local

Desde la raíz del repositorio:

``` bash
cd server
npm install
```

Crear y completar `server/.env`; luego ejecutar:

``` bash
npm run dev
```

El script de desarrollo debe estar definido en `server/package.json`:

``` json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Si los scripts ya existen, no duplicarlos: comprobar que `dev` ejecute
`nodemon server.js` y que `start` ejecute `node server.js`. Para
ejecutar sin Nodemon:

``` bash
npm start
```

El servidor debe informar que está escuchando en
`http://localhost:3001`. La ruta raíz `GET /` responde:

``` json
{
  "mensaje": "Servidor ProyectoLyEP2026 funcionando"
}
```

Si Nodemon muestra `app crashed`, revisar el error que aparece antes de
ese mensaje. Ante `Cannot find module`, verificar que el `require(...)`
use el nombre y la ruta reales del archivo.

## 7. CORS e integración con React

En desarrollo, el servidor permite el origen `http://localhost:5173`. En
producción se debe permitir el dominio real del frontend. El frontend
debe apuntar a la URL del backend desplegado; `localhost` no sirve como
dirección de API para usuarios externos porque se refiere a la
computadora de cada usuario.

## 8. Endpoints conocidos

### Autenticación y estadísticas

  --------------------------------------------------------------------------------
  Método            Ruta                       Acceso            Función
  ----------------- -------------------------- ----------------- -----------------
  `POST`            `/api/auth/login`          Público           Autentica un
                                                                 administrador

  `GET`             `/api/auth/estadisticas`   JWT válido,       Cuenta
                                               Gerencia o        administradores
                                               Soporte           activos por
                                                                 sector
  --------------------------------------------------------------------------------

El login recibe `email` y `password`. Si las credenciales son válidas,
devuelve `mensaje`, `token` y `administrador` (sin contraseña). El JWT
tiene una duración de 8 horas.

Ejemplo de login:

``` json
{
  "email": "admin@ejemplo.com",
  "password": "contraseña"
}
```

Ejemplo de respuesta de estadísticas (valores ilustrativos):

``` json
{
  "mensaje": "Estadísticas obtenidas correctamente",
  "data": {
    "administradores": 5,
    "gerentes": 2,
    "soportes": 3
  }
}
```

Para las rutas protegidas, enviar el encabezado:

``` text
Authorization: Bearer <TOKEN>
```

### Clientes

El router se monta en `/api/clientes`. Las operaciones previstas en la
integración son:

  ---------------------------------------------------------------------------
  Método            Ruta                  Función           Acceso esperado
  ----------------- --------------------- ----------------- -----------------
  `GET`             `/api/clientes`       Listar clientes   Gerencia y
                                                            Soporte

  `GET`             `/api/clientes/:id`   Obtener detalle   Gerencia y
                                                            Soporte

  `POST`            `/api/clientes`       Registrar cliente Público para el
                                                            registro de
                                                            clientes

  `PUT`             `/api/clientes/:id`   Editar cliente    Gerencia y
                                                            Soporte

  `DELETE`          `/api/clientes/:id`   Baja lógica       Solo Gerencia
  ---------------------------------------------------------------------------

**Verificar antes de entregar:** consultar `routes/clientes.routes.js`
para confirmar los métodos exactos y si la baja lógica usa `DELETE` o
`PATCH`. La baja lógica debe marcar `is_active: false`, sin borrar
físicamente el documento. El registro público no debe permitir que el
usuario se asigne permisos administrativos, sector o estado
privilegiado.

## 9. Roles y seguridad

-   **GERENTE:** consulta, registra y edita clientes; también puede
    realizar la baja lógica.
-   **SOPORTE:** consulta, registra y edita clientes; no puede realizar
    la baja lógica.
-   **Registro público de clientes:** no requiere JWT, pero solo acepta
    los campos permitidos por la validación del backend.

`verificarToken` obtiene el token desde `Authorization: Bearer ...`,
valida su firma y asigna el payload a `req.admin`.
`permitirSectores(...)` restringe el acceso según el sector del token.

Las contraseñas deben almacenarse con hash y nunca devolverse en
respuestas. Antes de producción, conviene revalidar en la base de datos
que la cuenta administrativa siga activa y conserve sus permisos, si se
necesita revocación inmediata; también aplicar validación estricta,
limitar intentos de login y usar HTTPS.

## 10. Validación y errores

Un error de validación puede responder con:

``` json
{
  "error": "Datos de cliente inválidos",
  "detalles": [
    "Detalle de validación"
  ]
}
```

El backend debe validar los datos incluso si el frontend también lo
hace. Códigos HTTP habituales:

-   `200`: consulta o actualización exitosa.
-   `201`: recurso creado.
-   `400`: datos inválidos o faltantes.
-   `401`: token ausente, inválido o expirado; o credenciales
    incorrectas.
-   `403`: cuenta deshabilitada o permisos insuficientes.
-   `404`: recurso inexistente, si el controlador lo contempla.
-   `500`: error inesperado.

Confirmar los códigos reales en los controladores finales.

## 11. Pruebas manuales

1.  Probar `GET /`.
2.  Probar `POST /api/auth/login` con credenciales válidas e inválidas.
3.  Consultar `GET /api/auth/estadisticas` con token y sin token.
4.  Probar listado y detalle de clientes.
5.  Crear y editar un cliente y comprobar persistencia en MongoDB.
6.  Intentar la baja lógica como Soporte y verificar que se rechace.
7.  Ejecutar la baja lógica como Gerencia y comprobar
    `is_active: false`.
8.  Probar datos inválidos y recursos inexistentes.
9.  Confirmar que ninguna respuesta exponga contraseñas o secretos.

## 12. Deploy

1.  Subir el código a Git sin incluir `.env`.
2.  Crear un servicio web Node.js en la plataforma elegida.
3.  Configurar `MONGODB_URI`, `JWT_SECRET` y cualquier otra variable que
    use el código.
4.  Configurar la carpeta raíz del servicio como `server` si la
    plataforma permite especificarla; en caso contrario, adaptar los
    comandos a la estructura del repositorio.
5.  Usar `npm install` como comando de instalación y `npm start` como
    comando de inicio, si coinciden con `package.json`.
6.  Actualizar CORS para permitir el dominio del frontend.
7.  Cambiar la URL base del frontend por la URL pública del backend.
8.  Probar autenticación, permisos, operaciones CRUD y estadísticas en
    producción.

## 13. Organización del trabajo del equipo

  ---------------------------------------------------------------------------
  Integrante              Día / área              Tareas
  ----------------------- ----------------------- ---------------------------
  **Alfaro, Facundo       Lunes --- Arquitectura  Crear `server/`,
  Iván**                  y setup                 inicializar Node/Express,
                                                  configurar puerto 3001,
                                                  preparar MongoDB Atlas o
                                                  Firestore y variables de
                                                  entorno, analizar las
                                                  operaciones que necesita el
                                                  frontend y definir
                                                  modelos/documentos de
                                                  Cliente.

  **Florencia Cruz**      Martes --- Modelos y    Integrar variables de
                          conexión DB             entorno, implementar modelo
                                                  de Cliente, probar
                                                  lectura/escritura, preparar
                                                  rutas y definir
                                                  validaciones y manejo de
                                                  errores.

  **Erick Mamani**        Miércoles --- API REST  Revisar servidor, CORS y
                          completa                errores; ajustar el modelo;
                                                  verificar persistencia;
                                                  implementar GET, GET por
                                                  ID, POST, PUT/PATCH y
                                                  DELETE/PATCH; desarrollar
                                                  controladores, validaciones
                                                  y respuestas HTTP.

  **Maldonado Pablo**     Jueves --- Integración  Configurar URL base y CORS,
                          con frontend            adaptar respuestas a React,
                                                  reemplazar
                                                  FakeStoreAPI/LocalStorage
                                                  como fuente principal de
                                                  clientes e integrar
                                                  listado, detalle, creación,
                                                  edición, baja, errores,
                                                  cargas y validaciones.

  **Castillo Pablo**      Viernes --- Testing,    Probar frontend/backend,
                          deploy y documentación  modelos, validaciones,
                                                  persistencia y endpoints;
                                                  corregir integración;
                                                  desplegar y completar
                                                  documentación de
                                                  instalación, variables,
                                                  endpoints y uso de IA.
  ---------------------------------------------------------------------------

## 14. Uso de IA

Durante el desarrollo del backend se utilizó ChatGPT, de OpenAI, como modelo de inteligencia artificial de asistencia para la generación y propuesta de código, siguiendo las instrucciones y los requerimientos específicos del proyecto.

Su utilización estuvo orientada a facilitar tareas de desarrollo, como la elaboración de fragmentos de código, la estructuración de componentes del backend, la implementación de funcionalidades y la documentación técnica.

La utilización de IA como herramienta de asistencia no implica que las pruebas hayan sido ejecutadas ni validadas por la IA. Las tareas de testing, verificación del funcionamiento, comprobación de persistencia y validación de los resultados fueron realizadas por un integrante del equipo, quien tuvo a su cargo la ejecución de las pruebas y la revisión del comportamiento de la aplicación.

El código propuesto con asistencia de IA fue utilizado como apoyo al proceso de desarrollo, bajo la responsabilidad del equipo, que debe revisar su adecuación a los requerimientos y al funcionamiento esperado del sistema.

------------------------------------------------------------------------

