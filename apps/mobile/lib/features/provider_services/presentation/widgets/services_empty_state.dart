import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Provider Services screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ServicesEmptyState extends StatelessWidget {
  const ServicesEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin servicios publicados',
      description: 'Agrega tu primer servicio para empezar a recibir '
          'solicitudes.',
      icon: Icons.design_services_outlined,
    );
  }
}
