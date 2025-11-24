# Sistema Backoffice de Pedidos B2B

Sistema distribuido de microservicios para la gestión, procesamiento y orquestación de pedidos B2B. Este proyecto implementa una arquitectura basada en eventos y transacciones distribuidas utilizando **Node.js**, **Docker** y **AWS Lambda**.

## 📋 Tabla de Contenidos
1. [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Requisitos Previos](#-requisitos-previos)
4. [Configuración y Levantamiento](#-configuración-y-levantamiento)
5. [Variables de Entorno](#-variables-de-entorno)
6. [URLs Base](#-urls-base)
7. [Cómo Invocar (Local vs AWS)](#-cómo-invocar-local-vs-aws)
8. [Ejemplos de Uso (cURL)](#-ejemplos-de-uso-curl)

---

## 🚀 Arquitectura y Tecnologías

* **Microservicios (REST):** Node.js v22 + Express.
* **Orquestador:** AWS Lambda (Serverless Framework V4).
* **Base de Datos:** MySQL 8.0 con Transacciones ACID y bloqueo pesimista (`FOR UPDATE`).
* **Infraestructura:** Docker Compose para orquestación local.
* **Calidad:** Validación con **Zod**, Idempotencia con **Keys**, Arquitectura Modular.

---

## 📂 Estructura del Proyecto

```text
/
├── /customers-api        # API de Gestión de Clientes (Puerto 3001)
│   └── openapi.yaml      # Documentación OpenAPI
├── /orders-api           # API de Pedidos y Productos (Puerto 3002)
│   └── openapi.yaml      # Documentación OpenAPI
├── /lambda-orchestrator  # Función Lambda (BFF)
│   └── serverless.yml    # Configuración IaC
├── /db                   # Scripts SQL (Schema y Seed)
└── docker-compose.yml    # Orquestación de contenedores
````

-----

## 🛠 Requisitos Previos

  * **Docker Desktop** instalado y corriendo.
  * **Node.js** (v18 o superior) y **NPM**.
  * (Opcional) **AWS CLI** configurado si se desea desplegar en la nube.

-----

## ⚙️ Configuración y Levantamiento

### 1\. Configurar Variables de Entorno

Ejecuta estos comandos en la raíz para generar los archivos `.env`:

```bash
cp .env.example .env
cp customers-api/.env.example customers-api/.env
cp orders-api/.env.example orders-api/.env
cp lambda-orchestrator/.env.example lambda-orchestrator/.env
```

### 2\. Levantar Microservicios y Base de Datos

Utiliza Docker Compose para levantar MySQL, Customers API y Orders API. La base de datos se inicializará automáticamente con datos de prueba (`seed.sql`).

```bash
docker-compose up --build -d
```

### 3\. Levantar Orquestador (Local)

En una nueva terminal, inicia el entorno de simulación de Lambda:

```bash
cd lambda-orchestrator
npm install
npm run dev
```

*El orquestador estará disponible en el puerto 3000.*

-----

## 🔐 Variables de Entorno

Las siguientes variables son críticas para el funcionamiento del sistema:

| Servicio | Variable | Descripción | Valor por Defecto (Local) |
| :--- | :--- | :--- | :--- |
| **Global** | `MYSQL_ROOT_PASSWORD` | Contraseña maestra de DB | `rootpassword` |
| **Customers** | `SERVICE_TOKEN` | Token para comunicación interna | `secret123` |
| **Orders** | `CUSTOMERS_API_URL` | URL de la API de Clientes | `http://customers_api:3001` |
| **Lambda** | `ORDERS_API_URL` | URL de la API de Pedidos | `http://localhost:3002` |

-----

## 🌐 URLs Base

| Servicio | Entorno Local | Entorno AWS (Ejemplo) |
| :--- | :--- | :--- |
| **Customers API** | `http://localhost:3001` | `http://<EC2-IP>:3001` |
| **Orders API** | `http://localhost:3002` | `http://<EC2-IP>:3002` |
| **Orquestador** | `http://localhost:3000` | `https://<api-id>.execute-api.us-east-1.amazonaws.com` |

-----

## ☁️ Cómo Invocar (Local vs AWS)

### Opción A: Invocación Local (Serverless Offline)

El proyecto utiliza `serverless-offline` para emular AWS API Gateway en tu máquina.

  * **Comando:** `npm run dev` (dentro de `/lambda-orchestrator`).
  * **Endpoint:** `POST http://localhost:3000/dev/orchestrator/create-and-confirm-order`

### Opción B: Invocación en AWS (Despliegue Real)

Para desplegar el orquestador en la nube de AWS:

1.  **Exponer APIs:** Asegúrate de que `customers-api` y `orders-api` sean accesibles desde internet (ej: desplegadas en EC2, ECS o usando Ngrok), ya que AWS Lambda no puede acceder a tu `localhost`.
2.  **Configurar URLs:** Actualiza el archivo `lambda-orchestrator/.env` con las URLs públicas reales.
3.  **Desplegar:**
    ```bash
    cd lambda-orchestrator
    npx serverless deploy
    ```
4.  **Invocar:** Usa la URL que te devuelva el comando de despliegue (ver tabla de URLs Base).

-----

## 🧪 Ejemplos de Uso (cURL)

### 1\. Flujo Completo: Crear y Confirmar Pedido (Orquestador)

Crea una orden, valida el cliente y confirma la transacción en un solo paso.

```bash
curl -X POST http://localhost:3000/dev/orchestrator/create-and-confirm-order \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [ { "product_id": 1, "qty": 1 } ],
    "idempotency_key": "clave-unica-prueba-1",
    "correlation_id": "req-12345"
  }'
```

### 2\. Crear Producto (Orders API)

```bash
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "NUEVO-PROD-01",
    "name": "Monitor 4K",
    "price_cents": 45000,
    "stock": 10
  }'
```

### 3\. Buscar Clientes (Customers API)

```bash
curl -X GET "http://localhost:3001/customers?search=Wagner"
```

### 4\. Cancelar Orden (Orders API)

Cancela la orden y restaura el stock automáticamente.

```bash
curl -X POST http://localhost:3002/orders/1/cancel \
  -H "Content-Type: application/json"
```