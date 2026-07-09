# Address Module (Flutter)

## Qué representa

`address` modela una dirección física asociada a una `Identity`: alias,
dirección completa, ciudad, departamento/estado, país, código postal, tipo y
estado.

## Diferencia entre Identity y Address

`Identity` es quién es la persona. `Address` es dónde está asociada esa
persona — un dato independiente que solo referencia su `IdentityId`.

## Por qué una persona puede tener múltiples direcciones

Una `Identity` puede tener dirección de casa, de trabajo, de facturación,
etc. — cada una es un registro `Address` independiente.

## Cómo permitirá integrar Google Maps en el futuro sin modificar el dominio

Los campos de texto (`fullAddress`, `city`, `state`, `country`,
`postalCode`) son suficientes para que una capa futura (fuera de este módulo)
geocodifique la dirección contra un proveedor de mapas, guardando
coordenadas en su propia estructura y referenciando `AddressId`. Este módulo
nunca tuvo campos de latitud/longitud que romper.

## Qué NO contiene

Google Maps, coordenadas GPS, rutas, navegación, validaciones de formato,
persistencia, widgets/pantallas.

## Estructura

```
address/
  README.md
  models/
    address_id.dart
    address_type.dart
    address_status.dart
  entities/
    address.dart
```

## Relaciones

`Address` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Address`.
