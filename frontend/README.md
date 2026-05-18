# OrderManagement Frontend

Frontend administrativo en Angular 21 para consumir la API `OrderManagement`.

## Stack

- Angular 21
- Standalone components
- Angular Material
- Reactive Forms
- Signals + RxJS
- Proxy local hacia `http://localhost:8080/api`

## Estructura

```text
src/app
  core/
  shared/
  features/
    auth/
    dashboard/
    products/
    inventory/
    orders/
    payments/
    users/
```

## Funcionalidades incluidas

- login con JWT
- layout privado con navegación lateral
- dashboard inicial
- productos: listar, crear, editar
- inventario: consultar y ajustar stock
- órdenes: listar, crear y ver detalle
- pagos: listar, procesar y ver detalle
- usuarios: listar, crear y editar

## Requisitos

- Node 22+
- npm 10+
- backend Spring Boot corriendo en `http://localhost:8080`

## Ejecutar en desarrollo

1. Backend:

```powershell
cd "C:\Portafolio backend developer\OderManagement"
mvn spring-boot:run
```

2. Frontend:

```powershell
cd "C:\Portafolio backend developer\OderManagement\frontend"
npm.cmd install
npm.cmd start
```

La aplicación queda en:

- `http://localhost:4200`

El proxy de Angular redirige `/api/*` al backend local.

## Build

```powershell
npm.cmd run build
```

Salida:

- `dist/frontend`

## Credenciales de validación local

Si mantienes la base local usada en esta sesión:

- email: `admin@example.com`
- password: `Password123`

## Validación realizada

Se validó end-to-end:

- `POST /api/auth/login`
- `POST /api/products`
- `POST /api/inventory/{productId}/increase`
- `POST /api/orders`
- `POST /api/payments`
- `GET /api/users`

También se verificó desde el frontend:

- `GET http://localhost:4200`
- `GET /api/health` vía proxy
- `POST /api/auth/login` vía proxy

## Notas

- El frontend asume que existe al menos un usuario en la tabla `users`.
- La autorización real sigue estando en el backend.
- El inventario se construye a partir del catálogo de productos, porque la API no expone un listado agregado independiente de stock.
