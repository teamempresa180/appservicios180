import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Provider Dashboard screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class DashboardEmptyState extends StatelessWidget {
  const DashboardEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin información del panel',
      description:
          'No pudimos cargar la información de tu cuenta de '
          'proveedor.',
      icon: Icons.dashboard_outlined,
    );
  }
}
