# Select Role

Pantalla muy simple que se muestra justo después de un Registro exitoso
(`/select-role`), preguntando cómo el usuario piensa usar la app:
**Cliente** o **Proveedor**. Reutiliza exclusivamente el Design System
existente: `AppScaffold`, `AppSectionTitle`, `AppCard`, `AppButton` y
Material Icons. Sin identidad visual propia.

## Arquitectura del feature

```
presentation/
  pages/
    select_role_page.dart   StatelessWidget con las dos tarjetas
  widgets/
    role_option_card.dart   AppCard + Icon + AppButton, reutilizable para cada rol
```

No hay modelos ni validadores porque esta pantalla no captura ningún
dato: solo dispara una navegación al elegir una tarjeta.

## Comportamiento actual

Al presionar el botón de **cualquiera** de las dos tarjetas
(`Continuar como Cliente` / `Continuar como Proveedor`), la app navega a
`/home` — el mismo Home placeholder para ambos roles. **No se guarda el
rol elegido en ningún lado todavía** (ni localmente ni en el backend).

## Por qué esta pantalla está separada del Registro

Ver la sección correspondiente en
`../register/README.md#por-qué-clienteproveedor-quedó-separado-del-registro`.
En resumen: Registro captura identidad/credenciales (independiente del
rol), mientras que la selección de rol es una decisión de producto que
puede evolucionar por separado (múltiples roles por cuenta, invitaciones,
login social, etc.).

## Qué falta para que esto sea real

- Persistir el rol elegido (backend, y probablemente el módulo
  `Provider` de `apps/backend/src/modules/provider/` para el caso
  Proveedor — hoy solo dominio puro, sin lógica).
- Construir Home diferenciado por rol (hoy ambos caminos llevan al mismo
  placeholder).
- Decidir si un usuario puede tener ambos roles simultáneamente o debe
  elegir uno solo.
