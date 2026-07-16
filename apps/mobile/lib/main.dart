import 'package:flutter/material.dart';
import 'core/di/service_locator.dart';
import 'core/navigation/router/app_router.dart';
import 'core/ui/theme/app_theme.dart';

void main() {
  setupServiceLocator();
  runApp(const AppServiciosApp());
}

/// Application root. Wires the neutral theme and the base router — no
/// business logic lives here.
class AppServiciosApp extends StatelessWidget {
  const AppServiciosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'AppServicios',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: AppRouter.router,
    );
  }
}
