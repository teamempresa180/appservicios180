import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Availability screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class AvailabilityEmptyState extends StatelessWidget {
  const AvailabilityEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin horario configurado',
      description:
          'Configura tu disponibilidad semanal para empezar a '
          'recibir solicitudes.',
      icon: Icons.event_busy_outlined,
    );
  }
}
