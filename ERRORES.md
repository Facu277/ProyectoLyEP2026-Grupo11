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

Error 5: Se pueden crear clientes duplicados (mismo email y username)
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

### Error 7: Login sin JWT_SECRET devuelve error interno
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

