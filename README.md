# Sistema Backoffice de Pedidos B2B

Sistema distribuido de microservicios para la gestión, procesamiento y orquestación de pedidos B2B. Este proyecto implementa una arquitectura orientada a servicios utilizando Node.js, Docker y AWS Lambda, garantizando transacciones ACID, control de concurrencia y operaciones idempotentes.

## Tabla de Contenidos

1.  [Arquitectura y Tecnologías](https://www.google.com/search?q=%23arquitectura-y-tecnolog%C3%ADas)
2.  [Estructura del Proyecto](https://www.google.com/search?q=%23estructura-del-proyecto)
3.  [Requisitos Previos](https://www.google.com/search?q=%23requisitos-previos)
4.  [Configuración y Levantamiento](https://www.google.com/search?q=%23configuraci%C3%B3n-y-levantamiento)
5.  [Ejecución de Pruebas](https://www.google.com/search?q=%23ejecuci%C3%B3n-de-pruebas)
6.  [Variables de Entorno](https://www.google.com/search?q=%23variables-de-entorno)
7.  [Documentación de API](https://www.google.com/search?q=%23documentaci%C3%B3n-de-api)
8.  [Ejemplos de Uso](https://www.google.com/search?q=%23ejemplos-de-uso)

-----

## Arquitectura y Tecnologías

  * **Microservicios (REST):** Node.js v22 + Express.
  * **Orquestador:** AWS Lambda implementado con Serverless Framework V4.
  * **Base de Datos:** MySQL 8.0. Se utilizan transacciones para asegurar la integridad de datos y bloqueo pesimista (`FOR UPDATE`) para gestionar la concurrencia de stock.
  * **Infraestructura Local:** Docker Compose para la orquestación de contenedores y red interna.
  * **Calidad de Código:** Validación de esquemas con Zod, manejo de idempotencia mediante claves únicas y Soft Delete.

-----

## Estructura del Proyecto

El repositorio funciona como un monorepo con la siguiente distribución:

  * `/customers-api`: API para la gestión de clientes (Puerto 3001).
  * `/orders-api`: API para la gestión de pedidos, productos e inventario (Puerto 3002).
  * `/lambda-orchestrator`: Función Lambda que actúa como BFF (Backend for Frontend) para coordinar la creación y confirmación de pedidos.
  * `/db`: Scripts de inicialización de base de datos (Schema y Seed).
  * `/docs`: Documentación adicional y colecciones de Postman.

-----

## Requisitos Previos

Asegúrese de tener instaladas las siguientes herramientas en su entorno local:

  * Docker Desktop (Docker Engine y Docker Compose).
  * Node.js (v18 o superior) y NPM.
  * (Opcional) Cliente REST como Postman o Insomnia.

-----

## Configuración y Levantamiento

### 1\. Configurar Variables de Entorno

Ejecute los siguientes comandos en la raíz del proyecto para generar los archivos de configuración necesarios basándose en los ejemplos proporcionados:

```bash
cp .env.example .env
cp customers-api/.env.example customers-api/.env
cp orders-api/.env.example orders-api/.env
cp lambda-orchestrator/.env.example lambda-orchestrator/.env
```

**Nota:** Asegúrese de que `DB_HOST` en `customers-api/.env` y `orders-api/.env` esté configurado como `mysql_db` para Docker, o `localhost` si ejecuta los servicios localmente fuera de Docker.

### 2\. Levantar Servicios y Base de Datos

Utilice Docker Compose para iniciar la base de datos MySQL y las APIs de Customers y Orders. La base de datos se inicializará automáticamente con el esquema y datos de prueba.

```bash
docker-compose up --build -d
```

### 3\. Iniciar el Orquestador (Lambda Local)

Para simular el entorno de AWS Lambda localmente, utilice `serverless-offline`. Abra una nueva terminal y ejecute:

```bash
cd lambda-orchestrator
npm install
npm run dev
```

El orquestador estará disponible en `http://localhost:3000`.

-----

## Ejecución de Pruebas

El proyecto incluye pruebas de integración para validar la lógica de negocio y las validaciones de entrada.

Para ejecutar las pruebas, asegúrese de que la base de datos esté corriendo (si las pruebas requieren conexión) o simplemente ejecute:

```bash
# Pruebas para Orders API
cd orders-api
npm test

# Pruebas para Customers API
cd ../customers-api
npm test
```

-----

## Variables de Entorno

Las siguientes variables son fundamentales para la comunicación entre servicios:

| Servicio | Variable | Descripción | Valor por Defecto (Docker) |
| :--- | :--- | :--- | :--- |
| **Global** | `MYSQL_ROOT_PASSWORD` | Contraseña root de MySQL | `rootpassword` |
| **Customers** | `SERVICE_TOKEN` | Token JWT para proteger rutas internas | `super_secreto_compartido_123` |
| **Orders** | `CUSTOMERS_API_URL` | URL base del servicio de Clientes | `http://customers_api:3001` |
| **Lambda** | `ORDERS_API_URL` | URL base del servicio de Pedidos | `http://localhost:3002` |
| **Lambda** | `JWT_SECRET` | Secreto para firmar tokens internos | `super_secreto_compartido_123` |

-----

## Documentación de API

### Especificación OpenAPI

Cada microservicio cuenta con su propia documentación bajo el estándar OpenAPI 3.0:

  * **Customers API:** `/customers-api/openapi.yaml`
  * **Orders API:** `/orders-api/openapi.yaml`

Puede visualizar esta documentación accediendo a la ruta `/docs` de cada servicio una vez levantados (ej: `http://localhost:3001/docs`).

### Colección de Postman

Se incluye una colección completa de Postman con todos los flujos configurados (Happy Path y casos de error) en la ruta:
`docs/B2B_Orders_Collection.json`

-----

## Ejemplos de Uso

A continuación se presentan ejemplos utilizando `curl` para interactuar con el sistema.

### 1\. Lambda Orquestador (Puerto 3000)

**Crear y Confirmar Orden (Flujo Completo)**

```bash
curl -X POST http://localhost:3000/dev/orchestrator/create-and-confirm-order \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      { "product_id": 1, "qty": 1 }
    ],
    "idempotency_key": "clave-unica-prueba-001",
    "correlation_id": "req-12345"
  }'
```

-----

### 2\. Customers API (Puerto 3001)

**Health Check**

```bash
curl -X GET http://localhost:3001/health
```

**Crear Cliente**

```bash
curl -X POST http://localhost:3001/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Cliente S.A.",
    "email": "contacto@nuevo.com",
    "phone": "099123456"
  }'
```

**Listar Clientes (Búsqueda)**

```bash
curl -X GET "http://localhost:3001/customers?search=Wagner"
```

**Obtener Cliente por ID**

```bash
curl -X GET http://localhost:3001/customers/1
```

**Actualizar Cliente**

```bash
curl -X PUT http://localhost:3001/customers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "555-9999",
    "name": "Nombre Actualizado"
  }'
```

**Eliminar Cliente (Soft Delete)**

```bash
curl -X DELETE http://localhost:3001/customers/1
```

**Validación Interna (Requiere Token)**

```bash
curl -X GET http://localhost:3001/internal/customers/1 \
  -H "Authorization: Bearer super_secreto_compartido_123"
```

-----

### 3\. Orders API (Puerto 3002)

**Health Check**

```bash
curl -X GET http://localhost:3002/health
```

**Crear Producto**

```bash
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "NEW-PROD-001",
    "name": "Silla Gamer Pro",
    "price_cents": 25000,
    "stock": 50
  }'
```

**Listar Productos**

```bash
curl -X GET http://localhost:3002/products
```

**Obtener Producto por ID**

```bash
curl -X GET http://localhost:3002/products/1
```

**Actualizar Producto (Patch)**

```bash
curl -X PATCH http://localhost:3002/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price_cents": 28000,
    "stock": 45
  }'
```

**Crear Orden (Directo)**

```bash
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      { "product_id": 2, "qty": 5 }
    ]
  }'
```

**Listar Órdenes (Filtros)**

```bash
curl -X GET "http://localhost:3002/orders?status=CREATED"
```

**Obtener Orden por ID**

```bash
curl -X GET http://localhost:3002/orders/1
```

**Confirmar Orden (Idempotente)**

```bash
curl -X POST http://localhost:3002/orders/1/confirm \
  -H "X-Idempotency-Key: unique-key-123"
```

**Cancelar Orden**

```bash
curl -X POST http://localhost:3002/orders/1/cancel
```