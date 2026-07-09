# Category Module (Flutter)

## Qué representa

`category` modela únicamente el concepto de categoría de servicios: nombre,
descripción, icono, color, tipo y estado. No representa proveedores,
servicios, subcategorías ni búsquedas.

## Diferencia entre Category y Provider

`Provider` representa la faceta profesional de una `Identity`. `Category` no
tiene relación con personas: es una entidad de catálogo, independiente.

## Por qué Provider NO conoce Category

La relación entre proveedores y categorías vivirá en un módulo futuro
(`ProviderCategory`) que referencie ambos `ProviderId` y `CategoryId`. Ni
`Provider` ni `Category` se conocen entre sí.

## Cómo se relacionará en el futuro sin modificar este dominio

`Services` referenciará `CategoryId`; `ProviderCategory` referenciará
`ProviderId` y `CategoryId`; `Search` consultará por `CategoryId`/`status`/
`type`; `Marketplace` compondrá todo a nivel de aplicación — sin modificar
este módulo.

## Qué NO contiene

Jerarquía de categorías, proveedores, servicios, órdenes, reseñas,
estadísticas, popularidad, SEO, slug, posición, prioridad, persistencia,
widgets/pantallas.

## Estructura

```
category/
  README.md
  models/
    category_id.dart
    category_status.dart
    category_type.dart
  entities/
    category.dart
```

## Relaciones

`Category` no referencia ningún otro módulo. Ningún módulo existente la
referencia todavía.
