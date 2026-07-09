# Address Module (Backend)

## Qué representa

`Address` modela una **dirección física** asociada a una `Identity`: alias,
dirección completa, ciudad, departamento/estado, país, código postal, tipo y
estado. Es dominio puro — solo representa el dato, no lo valida ni lo ubica
en un mapa.

Campos representados (sin comportamiento, solo datos):

- `AddressId`
- `IdentityId` (reutilizado de `identity`)
- `alias` (Casa, Oficina, etc.)
- `fullAddress`
- `city`
- `state` (departamento/estado)
- `country`
- `postalCode`
- `type`
- `status`
- `createdAt`, `updatedAt`

## Diferencia entre Identity y Address

`Identity` es quién es la persona (documento, nombre legal). `Address` es
dónde está asociada esa persona — un dato completamente independiente que
solo referencia su `IdentityId`.

## Por qué una persona puede tener múltiples direcciones

Una `Identity` puede tener una dirección de casa, una de trabajo, una de
facturación, etc. — cada una es un registro `Address` independiente,
diferenciado por `type`.

## Cómo permitirá integrar Google Maps en el futuro sin modificar el dominio

`fullAddress`, `city`, `state`, `country` y `postalCode` son texto plano
suficiente para que una capa de infraestructura futura (fuera de este módulo)
geocodifique la dirección contra un proveedor de mapas y guarde
coordenadas/rutas en su propia tabla o servicio, referenciando `AddressId`.
El dominio de `Address` no necesita cambiar: nunca tuvo campos de
latitud/longitud que romper ni acoplamiento a un proveedor específico.

## Qué NO contiene

Google Maps, coordenadas GPS, latitud/longitud, rutas, navegación,
validaciones de formato, APIs, persistencia, base de datos, login, registro,
JWT, DTOs, casos de uso, servicios, controladores.

## Estructura

```
address/
  README.md
  domain/
    value-objects/
      address-id.value-object.ts
      address-type.value-object.ts
      address-status.value-object.ts
    entities/
      address.entity.ts
    interfaces/
      address-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Address` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Address`.
