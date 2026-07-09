# Provider Module (Flutter)

## Qué representa

`provider` modela la información profesional de una persona que ofrece
servicios: estado, tipo, nivel de experiencia, biografía y años de
experiencia.

## Diferencia entre Identity, ProviderProfile y Provider

`Identity` es quién es la persona legalmente. `ProviderProfile` (el `Profile`
de `profiles`, reutilizado aquí como `providerProfileId`) es cómo se presenta
públicamente. `Provider` es su faceta profesional — no duplica ningún dato,
solo referencia sus identificadores.

## Cómo permitirá que un proveedor ofrezca múltiples servicios sin modificar Provider

`Provider` no contiene servicios ni categorías. Un futuro módulo `Services`
referenciará `ProviderId` para asociar N servicios a un mismo proveedor.

## Cómo se relacionará en el futuro con Categories, Services, Orders y Reviews

`Categories`/`Services` referenciarán `ProviderId` para sus servicios,
`Orders` para registrar contrataciones, y `Reviews` para calificaciones —
siempre referenciando, nunca siendo conocidos por `Provider`.

## Qué NO contiene

Categorías, servicios, agenda, disponibilidad, pagos, ubicación, persistencia,
widgets/pantallas.

## Estructura

```
provider/
  README.md
  models/
    provider_id.dart
    provider_status.dart
    provider_type.dart
    provider_experience.dart
  entities/
    provider.dart
```

## Relaciones

`Provider` referencia `IdentityId` (de `identity`) y `ProfileId` (de
`profiles`, como `providerProfileId`). Ni `Identity` ni `Profile` conocen
`Provider`.
