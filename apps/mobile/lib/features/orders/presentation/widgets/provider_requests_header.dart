import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Provider "Servicios" screen title. No new Core UI widget — reuses
/// `AppSectionTitle` (same pattern as `OrdersHeader`).
class ProviderRequestsHeader extends StatelessWidget {
  const ProviderRequestsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Servicios',
      subtitle: 'Solicitudes de clientes por aceptar o rechazar',
    );
  }
}
