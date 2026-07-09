# Review Module (Flutter)

## Qué representa

`review` modela únicamente la reseña que un cliente deja después de que una
orden finaliza: una calificación, un título, un comentario y su estado.

## Diferencia entre Review y Trust

`Review` es la opinión individual sobre una orden concreta. `Trust` es un
indicador agregado de reputación que en el futuro podría alimentarse de
muchas `Review` — pero ese cálculo no vive aquí.

## Diferencia entre Review y Order

`Order` es la solicitud de servicio ejecutada. `Review` es la opinión
posterior sobre el resultado de esa orden.

## Por qué Review solo referencia IDs

`Review` importa únicamente `OrderId`, `ProviderId` e `IdentityId` — nunca
las entidades completas.

## Cómo permitirá conectar posteriormente Trust Engine, Moderación, Reportes, IA, Ranking, Reputación, Analytics sin modificar este dominio

Todos esos módulos futuros consumirán o referenciarán `Review`/`ReviewId`
como entrada de solo lectura desde su propio dominio — `Review` nunca
necesita conocerlos ni cambiar para soportarlos.

## Qué NO contiene

Respuestas, likes, reportes, moderación, imágenes, archivos, reputación,
trust score, estadísticas, IA, denuncias, traducciones, filtros, ranking,
persistencia, widgets/pantallas.

## Estructura

```
review/
  README.md
  models/
    review_id.dart
    review_status.dart
    review_rating.dart
  entities/
    review.dart
```

## Relaciones

`Review` únicamente referencia `OrderId` (de `order`), `ProviderId` (de
`provider`) e `IdentityId` (de `identity`). Ninguno de esos módulos conoce
`Review`.
