# Login

Pantalla de inicio de sesión, **completa desde el punto de vista visual
pero sin autenticación real todavía**. Reutiliza exclusivamente el Design
System existente en `core/ui`. Sin identidad visual propia: sin logo, sin
colores de marca, sin ilustraciones ni assets — solo Material Icons y los
widgets/tokens del tema neutro.

## Arquitectura del feature

```
presentation/
  pages/
    login_page.dart        StatefulWidget: orquesta loading + navegación
  widgets/
    login_form.dart         Form con email + password + botón "Continuar"
    password_field.dart     AppTextField + toggle mostrar/ocultar (Material Icons)
    login_footer.dart       "¿Olvidaste tu contraseña?" y "Crear cuenta"
  models/
    login_credentials.dart  Dato plano {email, password} ya validado
  validators/
    login_validators.dart   Reglas de validación locales, sin paquetes externos
```

- `LoginPage` mantiene un único estado local: `_isLoading` (bool). No hay
  gestión de estado global (Provider/Riverpod/Bloc/Cubit/ViewModels).
- `LoginForm` valida con un `Form` + `GlobalKey<FormState>` estándar de
  Flutter. Solo cuando `validate()` pasa, llama a
  `onSubmit(LoginCredentials(...))`.
- Al recibir un submit válido, `LoginPage` reemplaza el contenido del
  `AppCard` por `AppLoading` durante `LoginPage.simulatedLoginDelay`
  (~1 segundo) y luego navega a `/home` con `context.go`. No hay ninguna
  llamada de red real en este paso — es una simulación.

## Qué partes son simuladas actualmente

- **No se valida contra el Backend.** Cualquier correo con formato válido
  y cualquier contraseña de 8+ caracteres pasa el formulario y navega a
  `/home`, sin importar si esas credenciales existen.
- El delay de "Ingresando..." es un `Future.delayed` fijo, no una
  respuesta real de Authentication.
- "¿Olvidaste tu contraseña?" y "Crear cuenta" navegan ambos a
  `/register` (placeholder), porque todavía no existe una pantalla de
  recuperación de contraseña.

## Cómo conectar posteriormente con Authentication

El backend ya expone el Bounded Context **Identity & Access** con el
módulo `Authentication` (`apps/backend/src/authentication/`), con sus
Use Cases en `application/use_cases/` (hoy lanzan
`Error("Not implemented yet")`). Cuando se implemente la lógica real:

1. Sustituir el `Future.delayed` en `_handleValidSubmit`
   (`pages/login_page.dart`) por una llamada real (repositorio/servicio
   HTTP) que reciba el `LoginCredentials` ya validado.
2. Ese punto es también donde deberá introducirse la gestión de estado
   (Provider/Riverpod/Bloc — a decidir) para exponer el resultado
   (éxito, credenciales inválidas, error de red) sin acoplarlo a
   `LoginForm` ni a `PasswordField`, que deben seguir siendo widgets
   puros de presentación.
3. El guard de navegación (`core/navigation/guards/app_route_guard.dart`)
   es el punto de extensión ya preparado para bloquear rutas según el
   resultado real de autenticación (hoy siempre permite el paso).

## Cómo conectar con Credentials

El módulo `Credentials` (`apps/backend/src/credentials/`) modela el
almacenamiento/verificación de credenciales como su propio Aggregate
Root, independiente de `Authentication`. La conexión real desde Login
implicaría: `Authentication` orquestando la verificación contra
`Credentials` vía sus propios Use Cases — el feature Login en Flutter
solo necesita conocer el resultado final (éxito/fracaso), nunca debe
importar entidades de `Credentials` directamente.

## Qué falta para un Login real

- Conexión HTTP real al backend (`apps/backend`).
- Gestión de estado para exponer loading/éxito/error más allá de un
  booleano local.
- Persistencia de sesión (JWT, almacenamiento local) — explícitamente
  fuera de alcance por ahora.
- Manejo de errores de red y de credenciales inválidas (hoy todo submit
  válido localmente "tiene éxito").
- Pantalla real de recuperación de contraseña (hoy apunta a Register).
- Remember Me, biometría, login con Google/Apple — no planeados todavía.
