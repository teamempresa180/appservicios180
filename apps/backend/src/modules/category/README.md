# Category Module (Backend)

## Qué representa

`Category` modela únicamente el concepto de **categoría de servicios**: un
nombre, descripción, icono, color, tipo y estado. No representa proveedores,
servicios, subcategorías ni búsquedas — solo el catálogo de categorías en sí.

Campos representados (sin comportamiento, solo datos):

- `CategoryId`
- `name`
- `description`
- `icon`
- `color`
- `status`
- `type`
- `createdAt`, `updatedAt`

## Diferencia entre Category y Provider

`Provider` (módulo anterior) representa la faceta profesional de una
`Identity` — quién ofrece servicios. `Category` no tiene ninguna relación con
personas: es una entidad de catálogo, independiente de cualquier `Identity`
o `Provider`. No comparte identificadores con ellos.

## Por qué Provider NO conoce Category

Siguiendo el mismo principio de dependencia usado en todo el proyecto (los
módulos dependientes referencian, nunca al revés), la relación entre
proveedores y categorías vivirá en un módulo futuro (`ProviderCategory`) que
referencie ambos `ProviderId` y `CategoryId`. Ni `Provider` ni `Category`
necesitan conocerse entre sí — cada uno permanece independiente y reutilizable.

## Cómo se relacionará en el futuro sin modificar este dominio

- **Services**: referenciará `CategoryId` para indicar a qué categoría
  pertenece cada servicio.
- **ProviderCategory**: un módulo de asociación que referenciará `ProviderId`
  y `CategoryId` para indicar en qué categorías opera cada proveedor.
- **Search**: consultará categorías por `CategoryId`/`status`/`type` sin
  requerir cambios en este módulo.
- **Marketplace**: compondrá `Category`, `Service` y `Provider` a nivel de
  aplicación/presentación, sin que ninguno de los tres dominios se modifique.

En todos los casos, `Category` es referenciada — nunca depende de esos
módulos.

## Qué NO contiene

Jerarquía de categorías (parent/children), proveedores, servicios, órdenes,
reseñas, estadísticas, popularidad, SEO, slug, posición, prioridad, APIs,
controladores, DTOs, casos de uso, servicios de aplicación, persistencia,
filtros, búsquedas, permisos, autenticación.

## Estructura

```
category/
  README.md
  domain/
    entities/
      category.entity.ts
    value-objects/
      category-id.value-object.ts
      category-status.value-object.ts
      category-type.value-object.ts
    interfaces/
      category-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Category` no referencia ningún otro módulo. Ningún módulo existente la
referencia todavía — quedará disponible para que módulos futuros
(`Services`, `ProviderCategory`) la consuman.
