# Onboarding

Flujo de bienvenida mostrado justo después del Splash (`/onboarding`).
Presenta 3 páginas deslizables que explican brevemente qué ofrece la app,
reutilizando exclusivamente el Design System existente en `core/ui`. No
tiene identidad visual propia: sin logo, sin colores de marca, sin
ilustraciones ni assets — solo Material Icons y los widgets/tokens del
tema neutro.

## Cómo funciona

- `presentation/pages/onboarding_page.dart` es un `StatefulWidget` que
  contiene un `PageView.builder` sobre la lista estática
  `OnboardingPage.slides`.
- Cada slide se renderiza con `OnboardingSlideView`
  (`presentation/widgets/`), que muestra el ícono dentro de un `AppCard`,
  el título con `AppSectionTitle` y la descripción con `Text`, animados con
  `FadeIn`/`ScaleIn` (ya existentes en `core/ui/animations`).
- Debajo del `PageView` se muestra `OnboardingPageIndicator`, un punto por
  slide que resalta la página activa, y un `AppButton` que dice
  **"Siguiente"** en las páginas 1 y 2, y **"Comenzar"** en la última.
- Al presionar **"Comenzar"** se navega a `/login` mediante
  `context.go(AppRoutes.login)` (GoRouter, ya configurado en
  `core/navigation`).
- No hay persistencia: el onboarding se muestra siempre que se navega a
  `/onboarding`. Recordar si el usuario ya lo vio (p. ej. con
  `SharedPreferences`) queda para un prompt futuro.
- No hay gestión de estado (Provider/Riverpod/Bloc/Cubit): el único estado
  es la página actual del `PageController`, manejado con `setState` local
  a la página.

## Cómo agregar una nueva página

Editar la lista `OnboardingPage.slides` en
`presentation/pages/onboarding_page.dart` y agregar un nuevo
`OnboardingSlide(icon: ..., title: ..., description: ...)` en la posición
deseada. No es necesario tocar ningún otro archivo: el `PageView`, el
indicador de páginas y el botón "Siguiente"/"Comenzar" se ajustan
automáticamente a la cantidad de slides.

## Cómo modificar los textos

Cambiar los valores `title` y `description` de la entrada correspondiente
en `OnboardingPage.slides`. No hay strings de textos sueltos en otro
archivo.

## Cómo cambiar los íconos

Cambiar el valor `icon` de la entrada correspondiente en
`OnboardingPage.slides`, usando cualquier `IconData` de `Icons.*`
(Material Icons). No se debe crear ni referenciar ningún asset de imagen
o icono personalizado.
