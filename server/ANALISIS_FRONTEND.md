# Análisis del frontend

## Operaciones requeridas

### Clientes

- Obtener listado de clientes.
- Obtener cliente por ID.
- Crear cliente.
- Actualizar cliente.
- Realizar baja lógica.
- Consultar únicamente clientes activos para los listados normales.

## Datos requeridos

Cada cliente utiliza:

- id
- email
- username
- password
- name.firstname
- name.lastname
- phone
- address.city
- address.street
- address.number
- address.zipcode
- is_active
- tipo

## Integración prevista

El frontend reemplazará la fuente de datos actual por la API REST propia:

GET /api/clientes
GET /api/clientes/:id
POST /api/clientes
PUT /api/clientes/:id
DELETE /api/clientes/:id