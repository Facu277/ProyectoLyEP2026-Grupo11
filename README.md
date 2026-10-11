# Proyecto LyEP 2026 - Grupo 11

[COMPLETAR: descripción de 2 o 3 líneas. Qué es el sistema, para quién y qué problema resuelve. Por los archivos del frontend parece un sistema de gestión de clientes.]

## Tecnologías

- **Frontend:** React + Vite (puerto 5173)
- **Backend:** Node.js + Express 5 (puerto 3001), `dotenv` para variables de entorno, `nodemon` en desarrollo
- **Persistencia:** MongoDB, con el driver oficial `mongodb`
- **Control de versiones:** Git + GitHub (ramas `feature/`, PR hacia `develop`)

## Estructura del proyecto

```
proyectoLyEP/
├── client/            # Frontend (Vite)
│   ├── models/
│   ├── shared/
│   └── src/
└── server/            # Backend (Express)
    ├── config/        # Configuración (conexión a MongoDB)
    ├── controllers/   # Lógica de cada recurso (clientes)
    ├── middleware/
    ├── models/        # Modelos de datos
    ├── routes/        # Definición de rutas
    ├── .env.example   # Plantilla de variables de entorno
    └── server.js      # Punto de entrada
```

## Requisitos previos

- Node.js [COMPLETAR: versión, ej. 18 o superior]
- npm
- Una base de datos MongoDB (local o en la nube) [COMPLETAR: Atlas / local]

## Instalación

# 1. Clonar el repositorio
git clone https://github.com/Facu277/ProyectoLyEP2026-Grupo11.git
cd ProyectoLyEP2026-Grupo11

# 2. Backend
cd server
npm install
cp .env.example .env     # completar con los valores reales
npm run dev              # desarrollo, con recarga automática (nodemon)
# npm start              # producción (node server.js)

# 3. Frontend (en otra terminal)
cd client
npm install
npm run dev
```

Una vez levantados:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Variables de entorno

Las credenciales **no se suben al repositorio**. Se copia `server/.env.example` a `server/.env` y se completan los valores.

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto en el que escucha el servidor (por defecto 3001) |
| `MONGODB_URI` | Cadena de conexión a MongoDB (local o Atlas) |

Ejemplo de `server/.env`:

```dotenv
PORT=3001
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>
```

## Funcionalidades implementadas

- Servidor base con Express funcionando en su puerto.
- Cliente (Vite) funcionando en su puerto.
- Conexión del servidor a MongoDB.
- Controlador de clientes con lecturas (GET).
- Operaciones CRUD de clientes: alta, edición y baja.
- Middleware de validación de datos de cliente en las rutas de escritura.
- Endpoints reales conectados al controlador, reemplazando las respuestas provisorias (501).
- Documentación de las operaciones que requiere el frontend.
- [COMPLETAR: login, dashboard, listado, detalle y formulario de clientes, según lo que ya esté conectado]

## Endpoints

Recurso **clientes** (`server/routes/clientes.routes.js`). Prefijo base: `/api/clientes` (ej. `GET http://localhost:3001/api/clientes`). Además, `GET /` devuelve un mensaje de estado del servidor.

| Método | Ruta | Validación | Descripción |
|--------|------|------------|-------------|
| GET | `/` | No | Lista todos los clientes |
| GET | `/:id` | No | Obtiene un cliente por ID |
| POST | `/` | Sí | Crea un cliente (alta) |
| PUT | `/:id` | Sí | Reemplaza/edita un cliente |
| PATCH | `/:id` | Sí | Edita parcialmente un cliente |
| DELETE | `/:id` | No | Elimina un cliente (baja) |

Las rutas de escritura pasan por el middleware `validarDatosCliente` (`server/middleware/validateCliente.js`).

### Ejemplo de request/response

[COMPLETAR: un ejemplo de body para POST y la respuesta esperada]

## Integrantes y aportes

| Integrante | Aporte |
|------------|--------|
| Facundo Alfaro | Inicialización del proyecto, estructura y servidor base con Express, configuración de entorno, documentación de operaciones requeridas por el frontend |
| Flor | Dependencias y conexión del servidor con MongoDB, exclusión de credenciales del repositorio |
| Erick Mamani | Controlador de clientes (lecturas GET), funciones CRUD de alta, edición y baja, conexión de controladores reales a los endpoints |
| [COMPLETAR] | Testing, deploy y documentación |

## Testing

[PENDIENTE: cómo correr las pruebas y qué cubren.]

## Deploy

[PENDIENTE: servicios elegidos, links y pasos.]

## Uso de IA

[PENDIENTE: por integrante. Herramienta, tipo de asistencia y cómo se evaluó el resultado.]
