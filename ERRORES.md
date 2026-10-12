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