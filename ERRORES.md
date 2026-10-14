### Error 1: Dependencias usadas en el código y no declaradas en package.json
- **Estado:** CONFIRMADO
- **Dónde:** `server/controllers/auth.controller.js`, `server/controllers/clientes.controller.js`, `server/package.json`
- **Pasos para reproducir:**
  1. Hacer `npm install` en `server/`.
  2. Ejecutar `npm run dev`.
- **Esperado:** el servidor inicia.
- **Obtenido:** `Error: Cannot find module 'bcryptjs'` y, después, `Cannot find module 'bcrypt'`.
- **Causa:** el código requiere paquetes que no están en `dependencies`. Además se usan dos librerías equivalentes (`bcrypt` en clientes, `bcryptjs` en auth).
- **Solución:** `npm install` de los paquetes faltantes y commit de `package.json` y `package-lock.json`. Pendiente de definir: unificar en una sola librería.

### Error 2: `server.js` con dos versiones superpuestas, el servidor no inicia
- **Estado:** CONFIRMADO en la rama de trabajo. Pendiente de confirmar si `origin/develop` tiene el mismo problema.
- **Dónde:** `server/server.js`
- **Pasos para reproducir:** `npm run dev` en `server/`.
- **Esperado:** el servidor inicia en el puerto 3001.
- **Obtenido:** `SyntaxError: Identifier 'connectDB' has already been declared`.
- **Causa:** el merge dejó dos versiones del archivo concatenadas, sin marcas de conflicto. Había `app` usado antes de declararse y faltaban los `require` de `dotenv`, `authRouter` e `inicializarAdministradores`.
- **Solución:** reescribir `server.js` con una sola versión coherente.

| 3 | `POST` con body vacío devuelve 400 con detalles | OK | |

| 4 | `POST` con datos válidos devuelve 201 | OK | |

### Error 3: Se pueden crear clientes duplicados (mismo email y username)
- **Estado:** CONFIRMADO
- **Dónde:** `POST /api/clientes` (`server/controllers/clientes.controller.js`, `server/models/cliente.model.js`)
- **Pasos para reproducir:**
  1. `POST /api/clientes` con un body válido (email `ana@test.com`, username `ana`).
  2. Repetir exactamente el mismo POST.
- **Esperado:** el segundo POST devuelve 409 (o 400) indicando que el email o el username ya existen.
- **Obtenido:** 201 las dos veces. En Atlas hay dos documentos con el mismo email y username, con `_id` distintos (`...db4` y `...db5`) e `id` numéricos distintos (1 y 2). El mismo cliente queda registrado dos veces.
- **Causa probable:** no hay chequeo de unicidad en el controlador ni un índice único en la colección. El contador de `id` sí funciona (asigna 1 y 2), por lo que no hay ids repetidos.
- **Posible solución:** un índice único sobre `email` y `username` en la colección, o un `findOne` previo en `createCliente` que responda 409.

| 6 | login con contraseña incorrecta → 401 “Credenciales incorrectas." OK.

### Error 4: Login sin JWT_SECRET devuelve error interno
- **Estado:** CONFIRMADO
- **Dónde:** `server/controllers/auth.controller.js` (línea 58)
- **Pasos para reproducir:** correr el server sin `JWT_SECRET` en el `.env` y hacer `POST /api/auth/login` con credenciales correctas.
- **Esperado:** el servidor falla al iniciar con un mensaje claro, o el README deja claro que la variable es obligatoria.
- **Obtenido:** el login pasa la verificación de la contraseña y falla al firmar con `Error: JWT_SECRET no está configurado.` (respuesta [completar código, probablemente 500]).
- **Solución:** definir `JWT_SECRET` en `server/.env` (documentado en el README y `.env.example`). Mejora sugerida: validar las variables obligatorias al arrancar.

| 8 | `POST /api/auth/login` con credenciales correctas devuelve 200 con token | OK | |
| 9 | `POST /api/auth/login` con contraseña incorrecta devuelve 401 | OK | |
| 10 | `GET /api/clientes` sin token devuelve 401 | OK | |
| 11 | `GET /api/clientes` con token válido devuelve 200 | OK | |
| 12 | Los datos persisten después de reiniciar el servidor | OK | |
| 13 | El documento aparece en MongoDB (Atlas/Compass) | OK | |
| 14 | `GET /api/clientes/:id` existente devuelve 200 | OK | |
| 15 | `GET /api/clientes/:id` inexistente devuelve 404 | OK | |
| 16 | `GET /api/clientes/abc` (id inválido) no devuelve 500 | OK | |
| 17 | `PATCH /api/clientes/:id` con un solo campo devuelve 200 y modifica el dato | OK | |
| 18 | `PUT /api/clientes/:id` con body vacío devuelve 400 con detalles | OK | |
| 19 | `GET /api/clientes` con header sin formato Bearer devuelve 401 | OK | |
| 20 | `GET /api/clientes` con token falso devuelve 401 | OK | |
| 21 | `POST /api/auth/login` sin body devuelve 400 | OK | |
| 22 | `DELETE /api/clientes/:id` con GERENTE devuelve 200 | OK | | Tras el DELETE, el cliente queda con is_active=false (baja lógica)
| 23 | `POST` con teléfono con letras y largo válido devuelve 400 | OK | Mensaje de error engañoso |
| 24 | `POST` con email sin @ devuelve 400 | OK | |
| 25 | `POST` con contraseña sin mayúscula devuelve 400 | OK | |
| 26 | `POST` con contraseña con espacios devuelve 400 | OK | |
| 27 | `POST` con número de calle fuera de rango (0) devuelve 400 | OK | |
| 28 | `POST` con código postal vacío devuelve 400 | OK | |
| 29 | `POST` con is_active no booleano devuelve 400 | OK | |

| 30 | El front arranca en `localhost:5173` sin errores en consola | OK | |
### Error 5: URL del backend fija en dos servicios del frontend
- **Estado:** CONFIRMADO
- **Dónde:** `client/src/services/autorizacionesServices.js` (línea 4) y `client/src/services/estadisticasService.js` (línea 4)
- **Pasos para reproducir:** `grep -rn "localhost:3001\|VITE_API_URL" client/src`
- **Esperado:** las tres URLs del backend salen de la variable de entorno `VITE_API_URL`, como ya hace `clientesService.js`.
- **Obtenido:** dos servicios usan `http://localhost:3001/api/auth` escrito a mano.
- **Impacto:** con el frontend desplegado, el login y las estadísticas intentan conectarse a `localhost` y fallan, aunque el resto de las llamadas funcione.
- **Solución propuesta:** usar `import.meta.env.VITE_API_URL || "http://localhost:3001/api"` y agregar `/auth` al final, en los dos archivos.

| 31 | El front se comunica con el back sin error de CORS | OK | |
| 32 | Login desde el front funciona con datos correctos e incorrectos | OK | |
| 33 | Una ruta protegida sin sesión redirige al login | OK | |
| 34 | Las rutas públicas (/login y /clientes/nuevo) cargan sin sesión | OK | |
| 35 | Una ruta inexistente muestra la página de error | OK | |

### Error 6: El servicio de clientes del frontend no envía el token de autenticación
- **Estado:** CONFIRMADO
- **Dónde:** `client/src/services/clientesService.js` (instancia de axios, líneas 7 a 12)
- **Pasos para reproducir:**
  1. Iniciar sesión en `http://localhost:5173/login` con un administrador GERENTE.
  2. Entrar a `/clientes`.
- **Esperado:** la lista muestra los clientes.
- **Obtenido:** la pantalla indica un error al cargar la lista. En consola: `GET http://localhost:3001/api/clientes/ 401 (Unauthorized)`. Respuesta del back en Network: `{"error":"No se proporcionó un token de autenticación."}`
- **Causa:** la instancia de axios de `clientesService.js` solo configura `Content-Type` y no agrega el header `Authorization`. La sesión se guarda en `localStorage` bajo la clave `admin` y `estadisticasService.js` sí envía el token con ese patrón.
- **Impacto:** el administrador no puede ver, consultar, editar ni dar de baja clientes desde la interfaz. La API funciona con token (probado con Thunder Client).
- **Posible solución:** agregar un interceptor de axios en `clientesService.js` que lea la sesión de `localStorage` y envíe `Authorization: Bearer <token>`.

| 36 | La lista de clientes del front muestra datos reales | FALLA | Ver Error 6 |
| 37 | El detalle de un cliente muestra sus datos | FALLA | Bloqueado por Error 6 |

### Error 7: Alta de cliente sin is_active devuelve error interno (también desde el formulario)
- **Estado:** CONFIRMADO (reproducido por API y por interfaz)
- **Dónde:** `server/models/cliente.model.js` (línea 40), `server/middleware/validateCliente.js` y formulario `/clientes/nuevo` del frontend
- **Pasos para reproducir:**
  1. Abrir `http://localhost:5173/clientes/nuevo`.
  2. Completar el formulario con datos válidos (contraseña con símbolo, teléfono de 7 a 15 dígitos).
  3. Enviar. (También se reproduce con `POST /api/clientes` sin el campo `is_active`.)
- **Esperado:** 201 y el cliente creado, con `is_active` en un valor por defecto.
- **Obtenido:** el `POST` devuelve 500 ("error interno del servidor"). En la terminal del server: `Error: is_active debe ser booleano` en `validarCliente` (cliente.model.js:40), llamado desde `clienteToDocument` (cliente.model.js:53) y `createCliente` (clientes.controller.js:50).
- **Causa:** el formulario del frontend no envía `is_active` (verificado en Network → Payload del `POST`; en `ClienteFormPage.jsx` solo aparece en una comparación, línea 177). El middleware lo trata como opcional y `clienteToDocument` lo exige como booleano.
- **Impacto:** el registro público de clientes no funciona desde la interfaz.
- **Posible solución:** que `clienteToDocument` asigne `true` por defecto cuando `is_active` es `undefined`, o que el formulario lo envíe.
| 38 | Alta de cliente desde el formulario público devuelve 201 | FALLA | Ver Error 7 |
| 39 | El formulario muestra el error de validación con datos inválidos | OK | |
| 40 | El formulario muestra el error de validación con datos inválidos | OK | |
| 41 | Con el back apagado, el front muestra un mensaje de error | OK | Muestra "Network Error" (mensaje técnico de axios, no amigable) |

### Error 8: Datos de administradores (con contraseña) dentro del código del frontend
- **Estado:** CONFIRMADO
- **Dónde:** `client/src/services/administradoresInicializados.js`
- **Pasos para reproducir:** `grep -n "password" client/src/services/administradoresInicializados.js`
- **Esperado:** el código del cliente no contiene credenciales; los administradores iniciales solo se crean en el backend (`inicializarAdministradores`).
- **Obtenido:** el archivo tiene 5 apariciones de `password` con [hashes bcrypt / contraseñas en texto plano: completar].
- **Impacto:** todo lo que está en `client/src` viaja al navegador de cualquiera que abra el sitio, y más aún tras el deploy.
- **Solución propuesta:** eliminar el archivo y sus usos en el frontend; si hace falta, mover los datos iniciales al backend.

| 42 | Tests automáticos del middleware validarDatosCliente (Jest) | OK | N tests pasando (`npm test` en `server/`) |
