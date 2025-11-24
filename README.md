# Sistema Backoffice de Pedidos B2B (Arquitectura Microservicios + Serverless)

Este repositorio contiene la solución a la prueba técnica para el rol de Senior Backend Developer. Es un sistema distribuido diseñado para gestionar, procesar y orquestar pedidos B2B, implementando patrones de arquitectura robustos como **Microservicios**, **Transacciones Distribuidas (Saga/Orquestación)** e **Idempotencia**.



[Image of microservices architecture diagram with lambda orchestrator]


## 📋 Tabla de Contenidos
1. [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
2. [Estructura del Monorepo](#-estructura-del-monorepo)
3. [Requisitos Previos](#-requisitos-previos)
4. [Guía de Instalación y Despliegue](#-guía-de-instalación-y-despliegue)
5. [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
6. [Documentación de API (Endpoints)](#-documentación-de-api)
7. [Pruebas E2E (Ejemplos de Uso)](#-pruebas-e2e-ejemplos-de-uso)
8. [Decisiones Técnicas (Why?)](#-decisiones-técnicas)

---

## 🚀 Arquitectura y Tecnologías

El sistema se compone de dos microservicios contenerizados y una función Lambda que actúa como orquestador (BFF - Backend for Frontend).

* **Runtime:** Node.js v22 (Compatible con ES6+).
* **Base de Datos:** MySQL 8.0 (Persistencia relacional con Transacciones ACID).
* **Infraestructura:** Docker & Docker Compose (Orquestación de contenedores).
* **Serverless:** Serverless Framework V4 (AWS Lambda simulado con `serverless-offline`).
* **Comunicación:** REST (Axios) con Tokens de Servicio para seguridad interna.
* **Calidad de Código:** Arquitectura Hexagonal/Modular, Validaciones con **Zod**, Linter.

---

## 📂 Estructura del Monorepo

```text
/
├── /customers-api        # Microservicio: Gestión de Clientes (Puerto 3001)
│   ├── /src              # Arquitectura modular (controllers, routes, schemas)
│   └── openapi.yaml      # Spec OpenAPI 3.0
├── /orders-api           # Microservicio: Pedidos, Stock y Productos (Puerto 3002)
│   ├── /src              # Lógica de negocio compleja (Transacciones, Idempotencia)
│   └── openapi.yaml      # Spec OpenAPI 3.0
├── /lambda-orchestrator  # Función AWS Lambda (Puerto 3000)
│   ├── /src              # Lógica del orquestador
│   └── serverless.yml    # Infraestructura como Código (IaC)
├── /db                   # Scripts de inicialización de BD
│   ├── schema.sql        # DDL: Tablas y Relaciones
│   └── seed.sql          # DML: Datos de prueba iniciales
├── docker-compose.yml    # Orquestación de infraestructura local
└── README.md             # Documentación principal
````

-----

## 🛠 Requisitos Previos

  * **Docker Desktop** (corriendo y con soporte Linux/WSL2 activado).
  * **Node.js** (v18 o superior recomendado para herramientas locales).
  * **NPM** o **Yarn**.

-----

## ⚙️ Guía de Instalación y Despliegue

### 1\. Clonar y Configurar Entorno

Ejecuta estos comandos en la raíz para generar los archivos `.env` necesarios a partir de las plantillas:

```bash
# Copiar .env raíz (Configuración de puertos Docker)
cp .env.example .env

# Copiar .env de Microservicios
cp customers-api/.env.example customers-api/.env
cp orders-api/.env.example orders-api/.env

# Copiar .env del Orquestador
cp lambda-orchestrator/.env.example lambda-orchestrator/.env
```

### 2\. Levantar Infraestructura (Docker)

Esto iniciará MySQL, Customers API y Orders API en segundo plano. La base de datos se autogenerará con el esquema y datos semilla.

```bash
docker-compose up --build -d
```

*Verificar:*

  * Customers API: `http://localhost:3001/health`
  * Orders API: `http://localhost:3002/health`

### 3\. Levantar Orquestador (Lambda Local)

En una **nueva terminal**, navega al directorio del Lambda e inícialo en modo offline:

```bash
cd lambda-orchestrator
npm install
npm run dev
```

*El orquestador estará escuchando en: `http://localhost:3000`*

-----

## 🔐 Configuración de Variables de Entorno

El sistema utiliza archivos `.env` independientes para simular un entorno de microservicios real y desacoplado.

| Archivo | Variables Clave | Descripción |
| :--- | :--- | :--- |
| **`/.env`** | `MYSQL_ROOT_PASSWORD`, `HOST_PORT_...` | Credenciales maestras y mapeo de puertos Docker host. |
| **`/customers-api/.env`** | `DB_HOST`, `SERVICE_TOKEN` | Conexión DB interna y Token para llamadas S2S. |
| **`/orders-api/.env`** | `CUSTOMERS_API_URL` | URL para comunicar con el servicio de clientes. |
| **`/lambda.../.env`** | `ORDERS_API_URL`, `OFFLINE_HTTP_PORT` | Endpoints de los servicios a orquestar. |

-----

## 📖 Documentación de API

Cada servicio cuenta con su especificación **OpenAPI 3.0** (`openapi.yaml`) en su respectiva carpeta. A continuación, los endpoints principales:

### 🟢 Orquestador (Lambda)

Es el punto de entrada principal para el flujo de negocio completo.

  * **POST** `/dev/orchestrator/create-and-confirm-order`
      * *Flujo:* Valida cliente -\> Crea Orden (Pendiente) -\> Confirma Orden (Idempotente).

### 🔵 Orders API (Puerto 3002)

  * **POST** `/orders`: Crea orden con validación de stock y transacción atómica.
  * **POST** `/orders/:id/confirm`: Confirma orden (Requiere `X-Idempotency-Key`).
  * **POST** `/orders/:id/cancel`: Cancela orden y **restaura stock** (Regla de negocio: \<10 min si está confirmada).
  * **GET** `/orders/:id`: Obtiene detalle completo con items (SQL JOIN).
  * **Gestión Productos:** `POST /products`, `GET /products`, `PATCH /products/:id`.

### 🟠 Customers API (Puerto 3001)

  * **GET** `/internal/customers/:id`: Endpoint protegido para uso exclusivo de otros microservicios.
  * **POST** `/customers`: Registro de clientes.

-----