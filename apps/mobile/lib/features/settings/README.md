# Settings

Menú de configuración de la cuenta. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile`, `request_service`, `quote`, `orders`, `payments`,
`chat`, `notifications`, `reviews` y `profile`: su propio repositorio,
sus propios datos mock, sin ninguna importación cruzada entre features
(solo `profile` importa la **página** de este feature para poder
abrirla, y este feature importa la página de `address_management` para
poder abrir esa, ver más abajo). No tiene `Scaffold` propio. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia
— solo Material Icons.

Este feature se construyó como **Prompt 39**, insertado antes que
`address_management` (Prompt 40) porque ese prompt asumía la existencia
de una pantalla de Settings con una opción "Direcciones" que aún no
existía en el repositorio — confirmado con el usuario antes de
proceder.

## Arquitectura

```
settings/
├── README.md
├── mock/
│   └── mock_settings_data.dart      Seed: Profile real + lista de opciones simulada
├── models/
│   ├── settings_display.dart        Profile + List<SettingsOptionId>
│   └── settings_option.dart         Enum de opciones + labels (UI)
├── repositories/
│   ├── settings_repository.dart       Contrato: Profile, List<SettingsOptionId>
│   └── mock_settings_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── settings_page.dart
    └── widgets/
        ├── settings_header.dart
        ├── settings_option_tile.dart
        ├── settings_loading.dart
        └── settings_empty_state.dart

test/features/settings/ (smoke test de la página)
```

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `profile` | Entidad **real** del dominio (`profiles/`), servida por el repositorio **mock**. |
| `options` (`SettingsOptionId`) | **Totalmente simulado**: "Configuración de la app" no es uno de los 22 módulos de negocio del dominio — es un menú de UI puro (Direcciones, Notificaciones, Privacidad, Ayuda, Cerrar sesión). |

**Sin colores ni iconos en el modelo**: `SettingsDisplay` no almacena
ningún `Color` ni `IconData`. `SettingsOptionTile` resuelve el icono de
cada fila desde `SettingsOptionId` + `context.colors.*`.

## Estados visuales

`SettingsPage` acepta un parámetro fijo `state` (`SettingsViewState`:
`loading`/`empty`/`information`) — mismo patrón que el resto de los
features desde `search`.

## Navegación

- **Entrada**: `ProfileHeader` (en `profile`) incluye un ícono de
  engranaje que abre `SettingsPage` — el único cambio autorizado en
  `profile` para este prompt.
- **Salida**: tocar "Direcciones" navega a `AddressManagementPage` (del
  feature `address_management`, Prompt 40) — el cambio de navegación
  que el Prompt 40 pedía explícitamente. El resto de las opciones
  ("Notificaciones"/"Privacidad"/"Ayuda"/"Cerrar sesión") son no-op.

## Cómo conectar posteriormente con Backend

No existe ningún endpoint de configuración todavía. Cuando exista,
`SettingsRepository` seguiría el mismo patrón que el resto de
repositorios del proyecto: `ApiSettingsRepository implements
SettingsRepository`, sustituyendo `MockSettingsRepository()` en
`SettingsPage`, sin tocar ningún widget.

## Qué NO existe todavía (a propósito)

Backend, HTTP, Firebase, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, autenticación
real, cierre de sesión real, preferencias de notificaciones reales,
privacidad real, centro de ayuda real. Todas las opciones salvo
"Direcciones" son no-op documentados.
