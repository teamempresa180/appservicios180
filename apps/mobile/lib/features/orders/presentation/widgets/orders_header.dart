import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Orders screen title. No new Core UI widget — reuses
/// `AppSectionTitle`.
class OrdersHeader extends StatelessWidget {
  const OrdersHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Mis órdenes',
      subtitle: 'Historial de servicios solicitados',
    );
  }
}
