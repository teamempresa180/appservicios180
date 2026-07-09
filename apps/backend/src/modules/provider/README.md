# Provider Module (Backend)

## Qué representa

`Provider` modela la **información profesional** de una persona que ofrece
servicios dentro de la plataforma: su estado como proveedor, tipo, nivel de
experiencia, biografía y años de experiencia. Es dominio puro — solo
representa el dato.

Campos representados (sin comportamiento, solo datos):

- `ProviderId`
- `IdentityId` (reutilizado de `identity`)
- `providerProfileId` (reutiliza `ProfileId` de `profiles`)
- `status`
- `type`
- `experience`
- `biography`
- `yearsOfExperience`
- `createdAt`, `updatedAt`

## Diferencia entre Identity, ProviderProfile y Provider

- **Identity**: quién es la persona legalmente (documento, nombre legal).
- **ProviderProfile** (el `Profile` del módulo `profiles`, reutilizado aquí
  como `providerProfileId`): cómo se presenta públicamente esa persona
  (nombre visible, avatar, biografía social, visibilidad).
- **Provider**: la faceta profesional de esa misma persona — que ofrece
  servicios, con su propio estado, tipo y experiencia. No duplica ningún dato
  de `Identity` ni de `Profile`; solo referencia sus identificadores.

Una `Identity` puede no tener ningún `Provider` (si nunca ofrece servicios), o
tener exactamente un `Provider` que agrupa toda su faceta profesional.

## Cómo permitirá que un proveedor ofrezca múltiples servicios sin modificar Provider

`Provider` no contiene categorías, servicios, agenda, disponibilidad, pagos ni
ubicación. Un futuro módulo `Services` (o `Categories`) referenciará
`ProviderId` para asociar N servicios a un mismo proveedor, sin que `Provider`
necesite cambiar en absoluto — la relación uno-a-muchos vive en el módulo que
la necesita, no aquí.

## Cómo se relacionará en el futuro con Categories, Services, Orders y Reviews

- `Categories` y `Services` referenciarán `ProviderId` para indicar qué
  servicios, de qué categorías, ofrece cada proveedor.
- `Orders` referenciará `ProviderId` (junto con el `ServiceId` solicitado y el
  `IdentityId` del cliente) para registrar una contratación.
- `Reviews` referenciará `ProviderId` (y probablemente `OrderId`) para dejar
  una calificación sobre el servicio prestado.

En todos los casos, `Provider` es referenciado — nunca conoce ni depende de
esos módulos.

## Qué NO contiene

Categorías, servicios, agenda, disponibilidad, pagos, ubicación, APIs,
controladores, DTOs, casos de uso, servicios de aplicación, persistencia,
login, registro, JWT, OAuth, lógica de negocio, algoritmos, IA.

## Estructura

```
provider/
  README.md
  domain/
    entities/
      provider.entity.ts
    value-objects/
      provider-id.value-object.ts
      provider-status.value-object.ts
      provider-type.value-object.ts
      provider-experience.value-object.ts
    interfaces/
      provider-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Provider` referencia `IdentityId` (de `identity`) y `ProfileId` (de
`profiles`, como `providerProfileId`). Ni `Identity` ni `Profile` conocen
`Provider`.
