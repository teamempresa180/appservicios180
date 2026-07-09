# Register

Pantalla de creación de cuenta, **completa desde el punto de vista visual
pero sin registro real todavía**. Reutiliza exclusivamente el Design
System existente en `core/ui`. Sin identidad visual propia: sin logo, sin
colores de marca, sin ilustraciones ni assets — solo Material Icons y los
widgets/tokens del tema neutro.

## Arquitectura del feature

```
presentation/
  pages/
    register_page.dart              StatefulWidget: orquesta loading + navegación
  widgets/
    register_form.dart              Form: nombre, correo, contraseña (+ toggle) y botón
    password_confirmation_field.dart AppTextField + toggle, valida contra la contraseña actual
    register_footer.dart            "¿Ya tienes cuenta? Iniciar sesión"
  models/
    register_data.dart              Dato plano {fullName, email, password} ya validado
  validators/
    register_validators.dart        Reglas de validación locales, sin paquetes externos
```

- `RegisterPage` mantiene un único estado local: `_isLoading` (bool). No
  hay gestión de estado global (Provider/Riverpod/Bloc/Cubit/ViewModels).
- `RegisterForm` valida con un `Form` + `GlobalKey<FormState>` estándar de
  Flutter. Solo cuando `validate()` pasa, llama a
  `onSubmit(RegisterData(...))`.
- Al recibir un submit válido, `RegisterPage` reemplaza el contenido del
  `AppCard` por `AppLoading` durante
  `RegisterPage.simulatedRegisterDelay` (~1 segundo) y luego navega a
  `/select-role` con `context.go`. No hay ninguna llamada de red real —
  es una simulación.

## Qué partes son simuladas actualmente

- **No se crea ninguna cuenta real.** Cualquier nombre no vacío, correo
  con formato válido, contraseña de 8+ caracteres y confirmación
  coincidente pasa el formulario y navega a `/select-role`.
- El delay de "Creando cuenta..." es un `Future.delayed` fijo, no una
  respuesta real de Identity/Credentials/Authentication.
- "Iniciar sesión" navega a `/login` (ya funcional visualmente, ver el
  README de ese feature).

## Cómo conectar posteriormente con Identity

El backend expone `Identity` (`apps/backend/src/modules/identity/`) como
el Aggregate Root que representa la cuenta de usuario en sí. La creación
real de cuenta implicaría: al recibir `RegisterData` en
`_handleValidSubmit` (`pages/register_page.dart`), invocar el Use Case de
creación de `Identity` correspondiente (hoy lanza
`Error("Not implemented yet")` en `application/use_cases/`), pasándole el
`fullName`/`email` ya validados localmente.

## Cómo conectar con Credentials

`Credentials` (`apps/backend/src/modules/credentials/`) modela el
almacenamiento/verificación de la contraseña como su propio Aggregate
Root, separado de `Identity`. El registro real enviaría la contraseña en
texto plano solo hasta el borde de la red (HTTPS) — el hashing y
almacenamiento seguro son responsabilidad exclusiva del backend; el
feature Register en Flutter nunca debe intentar hashear ni almacenar la
contraseña localmente.

## Cómo conectar con Authentication

`Authentication` (`apps/backend/src/modules/authentication/`) es quien
orquesta `Identity` + `Credentials` para emitir una sesión (JWT u otro
mecanismo, aún no decidido). Tras un registro real exitoso, lo natural es
que el backend autentique automáticamente a la cuenta recién creada y
devuelva ese resultado, para que Flutter no tenga que pedir login
inmediatamente después de registrarse.

## Cómo conectar con Contact y Address

`Contact` (`apps/backend/src/modules/contact/`) y `Address`
(`apps/backend/src/modules/address/`) son Aggregates independientes de
`Identity` — un teléfono/dirección se asocia por `IdentityId`, nunca se
anida dentro de `Identity`. Esta pantalla de Registro **no** captura
contacto ni dirección: esos datos, si se necesitan, deberían pedirse en
un paso posterior (p. ej. al completar el perfil de Proveedor), no aquí.

## Por qué Cliente/Proveedor quedó separado del Registro

La selección de rol vive en su propio feature (`features/select_role/`)
y no como un campo más del formulario de Registro por tres razones:

1. **Cohesión**: el Registro solo captura identidad + credenciales
   (datos que existirán sin importar el rol); la selección de rol es una
   decisión de producto distinta que puede evolucionar de forma
   independiente (p. ej. permitir más de un rol por cuenta a futuro).
2. **Reutilización**: si en el futuro se agrega login social o
   invitaciones, esos flujos también necesitarán preguntar el rol sin
   pasar por el formulario de Registro completo.
3. **Simplicidad del formulario**: mantener Registro enfocado solo en
   validación de datos de cuenta evita mezclar esa lógica con la lógica
   de selección de rol (que hoy es trivial, pero podría crecer con
   validaciones propias de Proveedor a futuro).

## Qué falta para un Registro real

- Conexión HTTP real al backend (`apps/backend`).
- Gestión de estado para exponer loading/éxito/error más allá de un
  booleano local.
- Persistencia de sesión tras el registro (JWT, almacenamiento local) —
  explícitamente fuera de alcance por ahora.
- Manejo de errores de red y de correo ya registrado (hoy todo submit
  válido localmente "tiene éxito").
- Captura real de datos de Contact/Address cuando el flujo de producto
  lo requiera.
