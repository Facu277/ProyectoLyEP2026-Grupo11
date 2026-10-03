# ANÁLISIS TÉCNICO

## ProyectoLyEP2026 – Panel de Control de Clientes

**Equipo 11**

## 1. Resumen

Se mejoró el prototipo del Panel de Control de Clientes incorporando una estructura más clara para usuarios, clientes, permisos, validaciones y persistencia.

La solución integra modelos de usuarios, CRUD de clientes, normalización de datos provenientes de FakeStoreAPI, almacenamiento en `LocalStorage`, formularios reutilizables, control de acceso por roles y correcciones de seguridad e integración.

## 2. Mejora seleccionada

### Justificación técnica

Se seleccionó esta mejora porque la gestión de clientes es una funcionalidad central del sistema.

La implementación incluye:

- Modelos `Usuario`, `Cliente` y `Administrador`.
- Sectores `GERENTE` y `SOPORTE`.
- Carga inicial desde FakeStoreAPI.
- Normalización y persistencia en `LocalStorage`.
- CRUD de clientes.
- Validaciones reutilizables.
- Formularios de creación y edición.
- Control de acceso por roles.

## 3. Tareas solucionadas

### 1. Modelos de usuarios

Se implementaron `Usuario`, `Cliente` y `Administrador`.

Los administradores poseen un `sector` limitado a:

```js
["GERENTE", "SOPORTE"]
```

### 2. Inicialización y CRUD

Se inicializaron 2 administradores `GERENTE` y 3 `SOPORTE`.

Los clientes se obtienen inicialmente desde FakeStoreAPI, se normalizan y se guardan en `LocalStorage`.

Se implementaron:

- Crear.
- Listar.
- Buscar por ID.
- Actualizar.
- Baja lógica con `is_active = false`.

### 3. Pruebas iniciales

Se verificaron las operaciones CRUD y la persistencia en `LocalStorage`.

### 4. Validaciones

Se centralizaron fuera del HTML:

- Campos obligatorios.
- Límites de longitud.
- Email.
- Teléfono.
- Dirección.
- Username.
- Contraseña.
- Mensajes de error.

### 5. Formulario de clientes

Se creó un formulario reutilizable para creación y edición.

Durante la creación se solicita contraseña y puede mostrarse u ocultarse.

Durante la edición:

- La contraseña no se muestra.
- No se envía una nueva contraseña.
- Se conserva la contraseña existente.

## 4. Roles y permisos

### GERENTE

Puede:

- Acceder al Dashboard.
- Ver clientes.
- Ver detalle.
- Crear.
- Editar.
- Deshabilitar clientes.

### SOPORTE

Puede:

- Acceder al Dashboard.
- Ver clientes.
- Ver detalle.
- Crear.
- Editar.

No puede deshabilitar clientes.

### Visitante

Puede:

- Crear su perfil mediante `/clientes/nuevo`.

No puede acceder a vistas administrativas.

## 5. Refactorización de autorización

### Problema

El sistema utilizaba lecturas directas de roles desde `LocalStorage` y `RutaProtegida` no diferenciaba correctamente los roles.

### Solución

Se centralizó la autorización en `AutorizacionesContext`.

Se agregaron:

- `rol`
- `esGerencia`
- `esSoporte`
- `tieneRol`

`RutaProtegida` ahora acepta:

```jsx
rolesPermitidos
```

También se eliminaron lecturas directas de:

```js
localStorage.getItem("role")
```

desde las vistas.

### Archivos principales modificados

- `src/context/AutorizacionesContext.jsx`
- `src/components/RutaProtegida.jsx`
- `src/routes/routes.jsx`
- `src/pages/DetalleCliente.jsx`
- `src/pages/Login.jsx`

## 6. Seguridad de contraseña

### Problema

La vista de detalle del cliente mostraba la contraseña directamente en pantalla.

### Solución

Se eliminó completamente la visualización de la contraseña.

También se mejoró:

- Manejo de errores.
- Confirmación antes de eliminar.
- Validaciones de datos faltantes.

### Verificación

Se comprobó que:

- La contraseña ya no se muestra.
- Los errores de carga se informan.
- Los errores de eliminación se informan.

## 7. Mejora de estilos

Se centralizaron colores, bordes y sombras mediante variables CSS en:

```css
:root
```

También se limpiaron reglas globales de `app.css` para reducir efectos no deseados por cascada.

## 8. Persistencia y seguridad en LocalStorage

Se reforzó el uso de `LocalStorage` utilizando lectura segura y reduciendo la información de sesión almacenada.

Se eliminó el almacenamiento separado del rol.

La sesión se reconstruye utilizando la lista canónica de administradores.

También se agregaron controles de permisos en:

- Interfaz.
- Servicios.
- Operaciones CRUD.

Las pruebas de `testCliente.js` se actualizaron para verificar operaciones permitidas y rechazadas según el rol.

### Uso en este proyecto

Para este prototipo académico, `LocalStorage` es adecuado porque permite simular persistencia sin backend.

Se utiliza para guardar clientes:

```js
localStorage.setItem(
    "clientes",
    JSON.stringify(clientes)
);
```

No debe considerarse una solución segura para producción, ya que el contenido puede modificarse desde el navegador.

## 9. Errores e inconsistencias corregidos

Se corrigieron principalmente:

- Roles escritos de distintas formas.
- Lecturas directas de roles desde `LocalStorage`.
- Selección manual de sector en Login.
- Uso de `admin.nombre` en lugar de `admin.name`.
- Rutas sin protección adecuada.
- Duplicación entre `FormCliente` y `FormularioCliente`.
- Consultas repetidas a FakeStoreAPI.
- Contraseña visible en detalle.
- Contraseña visible o modificable durante edición.
- Eliminación directa contra FakeStoreAPI.
- Falta de baja lógica.
- Inconsistencias posteriores a merges en `develop`.

## 10. Rutas principales

### Públicas

```text
/login
/clientes/nuevo
```

### Privadas

```text
/
/clientes
/clientes/:id
/clientes/editar/:id
```

La edición está permitida a `GERENTE` y `SOPORTE`.

La eliminación solamente está permitida a `GERENTE`.

## 11. Dashboard y listado

El Dashboard muestra:

- Clientes activos.
- Administradores.
- Gerentes.
- Soporte.

La lista muestra solo clientes con:

```js
is_active === true
```

### GERENTE

- Ver detalles.
- Editar.
- Eliminar.

### SOPORTE

- Ver detalles.
- Editar.

## 12. Tecnologías y versiones utilizadas

El frontend utiliza:

- React.
- Vite.
- React Router DOM.
- React Bootstrap.
- Axios.
- JavaScript.
- LocalStorage del navegador.

Para registrar únicamente las versiones realmente instaladas en el proyecto, ejecutar desde la raíz:

```bash
node -v
npm -v
npm list react vite react-router-dom react-bootstrap axios
```

Las versiones obtenidas por esos comandos son las que deben documentarse, evitando utilizar versiones aproximadas o diferentes a las instaladas en el proyecto.

## 13. Prueba local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el proyecto

```bash
npm run dev
```

Vite mostrará una URL local, normalmente similar a:

```text
http://localhost:5173
```

### 3. Pruebas recomendadas

Verificar:

- Inicio de sesión.
- Acceso como `GERENTE`.
- Acceso como `SOPORTE`.
- Creación pública de clientes.
- Listado de clientes activos.
- Visualización del detalle.
- Edición de clientes.
- Baja lógica realizada únicamente por `GERENTE`.
- Ocultamiento de contraseña.
- Persistencia de cambios al recargar la página.
- Funcionamiento de rutas protegidas.

## 14. Integración y estabilización

También se asumió la tarea de revisar errores e inconsistencias después de merges hacia `develop`.

Se revisan:

- Imports.
- Rutas.
- Context.
- Servicios.
- Roles.
- Permisos.
- LocalStorage.
- Navegación.
- Compatibilidad entre cambios.

Ejemplos de commits:

```text
fix: corregir imports después de merge
fix: resolver inconsistencias de roles y permisos
fix: corregir rutas afectadas por integración
fix: estabilizar develop después de integrar cambios
```

## 15. Conclusión

Las mejoras permitieron organizar la gestión de clientes, centralizar permisos, reducir inconsistencias y mejorar la protección de datos sensibles.

La solución es adecuada para el alcance académico actual.

## Firma

**Equipo 11**

ProyectoLyEP2026