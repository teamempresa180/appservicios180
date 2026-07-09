# Service Module (Backend)

## Qué representa

`Service` modela un **servicio concreto que un proveedor ofrece** dentro de
una categoría: nombre, descripción, precio base, duración estimada, tipo y
estado. Es dominio puro — solo representa el dato.

Campos representados (sin comportamiento, solo datos):

- `ServiceId`
- `ProviderId` (reutilizado de `provider`)
- `CategoryId` (reutilizado de `category`)
- `name`
- `description`
- `basePrice`
- `estimatedDuration`
- `status`
- `type`
- `createdAt`, `updatedAt`

## Diferencia entre Provider y Service

`Provider` es la faceta profesional de una persona (quién ofrece servicios).
`Service` es cada oferta concreta que ese proveedor publica — un mismo
`Provider` puede tener muchos `Service` independientes.

## Diferencia entre Category y Service

`Category` es el concepto de catálogo (ej. "Plomería"). `Service` es una
oferta específica dentro de esa categoría (ej. "Destape de tubería"). Muchos
`Service` de distintos proveedores pueden compartir la misma `CategoryId`.

## Por qué Service solo referencia IDs

Siguiendo el mismo principio usado en todo el proyecto, `Service` importa
únicamente `ProviderId` y `CategoryId` — nunca las entidades completas
`Provider` ni `Category`. Esto evita acoplar el dominio de `Service` a los
campos internos de esos módulos y les permite evolucionar de forma
independiente.

## Cómo permitirá en el futuro conectar Orders, Quotes, Availability, Scheduling, Reviews, Favorites, AI Recommendations sin modificar este dominio

- **Orders**: referenciará `ServiceId` para registrar una contratación.
- **Quotes**: referenciará `ServiceId` para cotizar un servicio específico.
- **Availability/Scheduling**: módulos futuros que referenciarán `ServiceId`
  (y `ProviderId`) para definir horarios y agenda, sin que `Service` necesite
  campos de disponibilidad.
- **Reviews**: referenciará `ServiceId` (y probablemente `OrderId`) para
  calificar la experiencia.
- **Favorites**: referenciará `ServiceId` para que un usuario lo marque como
  favorito.
- **AI Recommendations**: consumirá los datos de `Service` (nombre,
  categoría, precio) como entrada de solo lectura, sin que este módulo
  necesite saber que existen recomendaciones.

En todos los casos, `Service` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

Imágenes, galería, agenda, disponibilidad, horarios, ubicación, reseñas,
calificaciones, favoritos, promociones, descuentos, inventario, materiales,
impuestos, monedas, solicitudes, órdenes, chat, IA, APIs, controladores,
DTOs, casos de uso, servicios de aplicación, repositorios concretos,
persistencia.

## Estructura

```
service/
  README.md
  domain/
    entities/
      service.entity.ts
    value-objects/
      service-id.value-object.ts
      service-status.value-object.ts
      service-type.value-object.ts
    interfaces/
      service-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Service` únicamente referencia `ProviderId` (de `provider`) y `CategoryId`
(de `category`) — nunca importa esas entidades completas. Ni `Provider` ni
`Category` conocen `Service`.
