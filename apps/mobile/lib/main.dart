import 'dart:async';

import 'package:flutter/material.dart';
import 'core/di/service_locator.dart';
import 'core/navigation/router/app_router.dart';
import 'core/session/provider_availability_controller.dart';
import 'core/session/user_role_controller.dart';
import 'core/theme/theme_mode_controller.dart';
import 'core/ui/theme/app_theme.dart';

void main() {
  setupServiceLocator();
  // Restores the persisted light/dark choice before the first frame, so
  // the app never flashes light mode for a user who picked dark.
  unawaited(locator<ThemeModeController>().load());
  // Restores the persisted Cliente/Prestador role switch (see the App
  // Shell's drawer).
  unawaited(locator<UserRoleController>().load());
  // Restores the persisted Disponible/Ocupado toggle (see `HomeHeader`).
  unawaited(locator<ProviderAvailabilityController>().load());
  runApp(const AppServiciosApp());
}

/// Application root. Wires the theme (reactive to [ThemeModeController])
/// and the base router — no business logic lives here.
class AppServiciosApp extends StatelessWidget {
  const AppServiciosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: locator<ThemeModeController>(),
      builder: (context, _) {
        return MaterialApp.router(
          title: 'SERVICIOS 180°',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.light,
          darkTheme: AppTheme.dark,
          themeMode: locator<ThemeModeController>().mode,
          routerConfig: AppRouter.router,
        );
      },
    );
  }
}
