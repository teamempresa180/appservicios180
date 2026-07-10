import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Settings screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class SettingsEmptyState extends StatelessWidget {
  const SettingsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin opciones disponibles',
      description: 'No pudimos cargar la configuración de tu cuenta.',
      icon: Icons.settings_outlined,
    );
  }
}
