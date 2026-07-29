import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import 'provider_requests_header.dart';

/// Visual-only empty state for the provider's "Servicios" screen —
/// message depends on which tab is empty (see `ProviderRequestsTab`).
/// Reuses `AppEmptyState` — no new Core UI widget.
class ProviderRequestsEmptyState extends StatelessWidget {
  const ProviderRequestsEmptyState({
    super.key,
    this.tab = ProviderRequestsTab.active,
  });

  final ProviderRequestsTab tab;

  @override
  Widget build(BuildContext context) {
    return AppEmptyState(
      title: tab == ProviderRequestsTab.active
          ? 'Sin solicitudes por ahora'
          : 'Sin historial todavía',
      description: tab == ProviderRequestsTab.active
          ? 'Cuando un cliente pida uno de tus servicios, o publique una '
                'solicitud en tu categoría, aparecerá aquí para que envíes '
                'tu cotización.'
          : 'Aquí verás tus servicios finalizados, cancelados o '
                'rechazados.',
      icon: Icons.design_services_outlined,
    );
  }
}
