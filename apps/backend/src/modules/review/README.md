# Review Module (Backend)

## Qué representa

`Review` modela únicamente la **reseña que un cliente deja después de que
una orden finaliza**: una calificación, un título, un comentario y su
estado. Es dominio puro — solo representa el dato de la opinión, no su
efecto sobre la reputación del proveedor.

Campos representados (sin comportamiento, solo datos):

- `ReviewId`
- `OrderId` (reutilizado de `order`)
- `ProviderId` (reutilizado de `provider`)
- `ReviewerIdentityId` (reutiliza `IdentityId` de `identity`)
- `rating`
- `title`
- `comment`
- `status`
- `createdAt`, `updatedAt`

## Diferencia entre Review y Trust

`Review` es la opinión individual de un cliente sobre una orden concreta.
`Trust` (módulo anterior) es un indicador agregado de reputación de una
`Identity` que, en el futuro, podría alimentarse de muchas `Review` — pero
ese cálculo no vive aquí. `Review` no conoce `Trust` ni viceversa.

## Diferencia entre Review y Order

`Order` es la solicitud de servicio que se ejecuta. `Review` es la opinión
posterior sobre el resultado de esa orden — referencia la orden, pero no
describe el servicio solicitado ni su estado operativo.

## Por qué Review solo referencia IDs

`Review` importa únicamente `OrderId`, `ProviderId` e `IdentityId` — nunca
las entidades `Order`, `Provider` o `Identity` completas. Esto mantiene el
dominio de `Review` desacoplado de los campos internos de esos módulos.

## Cómo permitirá conectar posteriormente Trust Engine, Moderación, Reportes, IA, Ranking, Reputación, Analytics sin modificar este dominio

- **Trust Engine**: consumirá `ReviewId`/`rating` como entrada de solo
  lectura para calcular el `Trust` de un `Provider`, sin que `Review`
  necesite saberlo.
- **Moderación**: un módulo futuro que referenciará `ReviewId` para marcar
  contenido revisado, sin campos de moderación en este dominio.
- **Reportes**: referenciará `ReviewId` para registrar denuncias.
- **IA**: analizará el texto de `comment` como entrada de solo lectura (por
  ejemplo, para detectar sentimiento), sin acoplarse a este módulo.
- **Ranking**: referenciará `ProviderId` y agregará calificaciones de
  múltiples `Review` en su propio dominio.
- **Reputación**: igual que `Trust Engine`, consumirá datos agregados de
  `Review` sin modificarlo.
- **Analytics**: leerá `Review` como fuente de datos de solo lectura.

En todos los casos, `Review` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

Respuestas, likes, reportes, moderación, imágenes, archivos, reputación,
trust score, estadísticas, IA, denuncias, traducciones, filtros, ranking,
APIs, controladores, DTOs, casos de uso, servicios de aplicación,
persistencia.

## Estructura

```
review/
  README.md
  domain/
    entities/
      review.entity.ts
    value-objects/
      review-id.value-object.ts
      review-status.value-object.ts
      review-rating.value-object.ts
    interfaces/
      review-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Review` únicamente referencia `OrderId` (de `order`), `ProviderId` (de
`provider`) e `IdentityId` (de `identity`) — nunca importa esas entidades
completas. Ninguno de esos módulos conoce `Review`.
