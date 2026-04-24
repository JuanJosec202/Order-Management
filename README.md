# Order Management API

API REST para gestion de usuarios, productos, inventario, ordenes y pagos simulados.

Proyecto de portafolio enfocado en mostrar practicas reales de backend con Java y Spring Boot: arquitectura modular, reglas de negocio claras, seguridad con JWT, persistencia relacional, migraciones versionadas y testing automatizado.

El proyecto esta construido como un monolito modular con Spring Boot. La idea es mostrar un backend profesional y mantenible para un sistema de gestion de ordenes e inventario, sin caer en sobreingenieria ni microservicios prematuros.

## Que demuestra este proyecto

- diseno de backend con separacion clara entre dominio, aplicacion, web e infraestructura
- autenticacion y autorizacion stateless con Spring Security + JWT
- modelado de flujos de negocio conectados entre productos, inventario, ordenes y pagos
- persistencia con Spring Data JPA + PostgreSQL
- control del esquema con Flyway
- documentacion de API con OpenAPI / Swagger
- tests unitarios e integration tests para validar comportamiento
- empaquetado y ejecucion con Maven, Docker y Docker Compose

## Estado para portafolio

Hoy el proyecto ya es presentable como backend portfolio project porque:

- compila y empaqueta correctamente con `mvn verify`
- tiene suite automatizada pasando
- expone una API coherente y documentada
- muestra decisiones tecnicas justificables
- cubre casos de uso mas alla de un CRUD simple

Limitaciones actuales conocidas:

- no incluye bootstrap automatico del primer usuario administrador
- el flujo de pago es simulado, no hay integracion con una pasarela real
- faltan mejoras operativas como paginacion, seeds opcionales y reglas mas finas de autorizacion

## Objetivo del sistema

El sistema permite:

- administrar usuarios del sistema
- autenticar usuarios con JWT
- gestionar productos
- gestionar stock por producto
- crear ordenes validando existencia de productos y disponibilidad de inventario
- procesar pagos simulados sobre ordenes existentes
- exponer auditoria basica en entidades clave
- documentar la API con OpenAPI / Swagger

## Stack tecnologico

- Java 17
- Spring Boot 3.4.4
- Spring MVC
- Spring Data JPA
- Spring Security + JWT
- PostgreSQL
- Flyway
- Maven
- OpenAPI / Swagger UI
- JUnit 5 + Mockito
- Docker + Docker Compose
- GitHub Actions

## Validacion tecnica

Validado localmente en este repositorio:

- `mvn test`
- `mvn verify`

La suite actual cubre autenticacion, inventario, ordenes, pagos, productos y usuarios con una combinacion de unit tests e integration tests.

## Arquitectura elegida

El proyecto usa un enfoque de monolito modular.

Cada modulo sigue una separacion interna liviana:

- `web`: controllers, DTOs HTTP y mapeo de entrada/salida
- `application`: casos de uso, servicios de aplicacion y puertos
- `domain`: modelo de dominio y reglas de negocio
- `infrastructure`: persistencia, seguridad y adaptadores tecnicos

La idea es mantener Spring principalmente en `web` e `infrastructure`, y dejar la logica de negocio en el centro del modulo.

## Estructura de modulos

```text
com.example.ordermanagement
+-- auth
+-- users
+-- products
+-- inventory
+-- orders
+-- payments
+-- shared
+-- config
```

Resumen funcional por modulo:

- `auth`: login y emision/validacion de JWT
- `users`: administracion de usuarios, roles y estado activo
- `products`: CRUD base de productos
- `inventory`: gestion separada de stock por producto
- `orders`: creacion y consulta de ordenes con validacion de inventario
- `payments`: procesamiento simulado de pagos
- `shared`: errores globales, piezas transversales y soporte comun
- `config`: configuracion tecnica global

## Requisitos

- Java 17
- Maven 3.9+
- Docker y Docker Compose, si quieres correr Postgres o toda la app en contenedores

## Como correrlo localmente

### Opcion recomendada: app local + Postgres en Docker

1. Levanta solo PostgreSQL:

```bash
docker compose up -d postgres
```

2. Ejecuta la aplicacion:

```bash
mvn spring-boot:run
```

La API quedara disponible en:

- `http://localhost:8080/api`

Variables relevantes con sus defaults actuales:

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_NAME=ordermanagement`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `JWT_SECRET=<valor por defecto definido en application.yml>`
- `JWT_EXPIRATION_MINUTES=60`

## Como correrlo con Docker

Para levantar la aplicacion y PostgreSQL juntos:

```bash
docker compose up --build
```

Servicios expuestos:

- API: `http://localhost:8080/api`
- PostgreSQL: `localhost:5432`

El `docker-compose.yml` ya conecta la app con la base de datos usando las variables esperadas por Spring.

## Como ejecutar tests

Ejecutar toda la suite:

```bash
mvn test
```

Ejecutar build completa con empaquetado:

```bash
mvn verify
```

Cobertura actual con foco en valor:

- unit tests para servicios de autenticacion, productos, inventario, ordenes y pagos
- integration tests para los flujos HTTP criticos

## Swagger / OpenAPI

Documentacion navegable:

- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

La documentacion incluye el esquema Bearer JWT y los endpoints principales del sistema.

## Seguridad y acceso

Autenticacion actual:

- `POST /api/auth/login` es publico
- `GET /api/health` es publico
- Swagger UI y OpenAPI docs son publicos

Autorizacion actual:

- `ADMIN`: `/api/users/**`
- `ADMIN` o `OPERATOR`: `/api/products/**`, `/api/inventory/**`, `/api/orders/**`, `/api/payments/**`

Roles disponibles en el modelo actual:

- `ADMIN`
- `MANAGER`
- `OPERATOR`

Nota importante: hoy el proyecto no incluye seed de usuarios ni bootstrap automatico del primer administrador. Para usar los endpoints protegidos necesitas provisionar manualmente un usuario inicial en la base de datos o extender el proyecto con un mecanismo de bootstrap.

## Ejemplos de endpoints principales

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secret123"
  }'
```

### Crear producto

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "sku": "SKU-001",
    "name": "Mechanical Keyboard",
    "description": "Hot-swappable keyboard",
    "price": 99.90
  }'
```

### Incrementar stock

```bash
curl -X POST http://localhost:8080/api/inventory/1/increase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 10
  }'
```

### Crear orden

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

### Procesar pago simulado aprobado

```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "orderId": 1,
    "approved": true,
    "rejectionReason": null
  }'
```

### Consultar usuarios

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <admin-token>"
```

### Health check

```bash
curl http://localhost:8080/api/health
```

## Decisiones de diseno importantes

- Monolito modular en lugar de microservicios: suficiente para el problema actual y mas facil de mantener.
- Separacion por modulo y por capa interna: evita mezclar responsabilidades sin imponer una Clean Architecture rigida.
- `products` e `inventory` separados: el CRUD del producto no es dueno del stock.
- Ordenes validan inventario al crear: se eligio la opcion simple y coherente de descontar stock en ese momento.
- Pagos simulados: no hay pasarela real ni webhooks; el objetivo es modelar el flujo sin complejidad externa.
- JWT stateless con Spring Security: adecuado para una API REST simple.
- Flyway como fuente de verdad del esquema: no se usa `ddl-auto` para crear estructura.
- Auditoria basica en entidades clave: `User`, `Product` y `Order` exponen `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
- Manejo global de errores: la API responde con un formato consistente para validaciones, conflictos y recursos inexistentes.

## Pipeline CI

El repositorio incluye GitHub Actions para ejecutar build y tests automaticamente en cada `push` y `pull request`.

Workflow:

- `mvn --batch-mode verify`

## Posibles mejoras futuras

- agregar bootstrap controlado del primer usuario administrador
- agregar cancelacion de orden con devolucion de stock
- soportar refresh tokens
- ampliar reglas de autorizacion por rol y permisos finos
- agregar auditoria de eventos de negocio, no solo campos basicos
- incorporar paginacion y filtros en listados
- endurecer concurrencia en inventario para escenarios de alta contencion
- agregar perfiles `dev` y `prod` mas explicitos
- incluir datos demo opcionales para levantar entornos de prueba
- publicar imagen Docker en registry dentro del pipeline CI

## Estado actual

El proyecto ya incluye:

- autenticacion JWT
- CRUD de usuarios
- CRUD de productos
- gestion de inventario
- creacion y consulta de ordenes
- pago simulado
- auditoria basica
- Swagger / OpenAPI
- tests unitarios e integracion
- Docker
- GitHub Actions
