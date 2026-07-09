# Service Module (Flutter)

## Qué representa

`service` modela un servicio concreto que un proveedor ofrece dentro de una
categoría: nombre, descripción, precio base, duración estimada, tipo y
estado.

## Diferencia entre Provider y Service

`Provider` es la faceta profesional de una persona. `Service` es cada oferta
concreta que ese proveedor publica — un mismo `Provider` puede tener muchos
`Service`.

## Diferencia entre Category y Service

`Category` es el concepto de catálogo (ej. "Plomería"). `Service` es una
oferta específica dentro de esa categoría.

## Por qué Service solo referencia IDs

`Service` importa únicamente `ProviderId` y `CategoryId` — nunca las
entidades completas `Provider` ni `Category`.

## Cómo permitirá en el futuro conectar Orders, Quotes, Availability, Scheduling, Reviews, Favorites, AI Recommendations sin modificar este dominio

Todos esos módulos futuros referenciarán `ServiceId` (y `ProviderId` cuando
corresponda) desde su propio dominio — `Service` nunca necesita conocerlos ni
cambiar para soportarlos.

## Qué NO contiene

Imágenes, galería, agenda, disponibilidad, horarios, ubicación, reseñas,
calificaciones, favoritos, promociones, descuentos, inventario, materiales,
impuestos, monedas, solicitudes, órdenes, chat, IA, persistencia,
widgets/pantallas.

## Estructura

```
service/
  README.md
  models/
    service_id.dart
    service_status.dart
    service_type.dart
  entities/
    service.dart
```

## Relaciones

`Service` únicamente referencia `ProviderId` (de `provider`) y `CategoryId`
(de `category`). Ni `Provider` ni `Category` conocen `Service`.
