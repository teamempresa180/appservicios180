import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the provider's "Servicios" screen.
/// Reuses `AppEmptyState` — no new Core UI widget.
class ProviderRequestsEmptyState extends StatelessWidget {
  const ProviderRequestsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin solicitudes por ahora',
      description:
          'Cuando un cliente pida uno de tus servicios, aparecerá aquí '
          'para que lo aceptes o lo rechaces.',
      icon: Icons.design_services_outlined,
    );
  }
}
