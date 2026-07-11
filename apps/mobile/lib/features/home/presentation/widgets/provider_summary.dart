import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import 'stat_card.dart';

/// Quick-glance grid of mock stats for the Proveedor Home: pending
/// orders, published services, rating and availability. Purely visual —
/// real numbers will come once `Order`/`Service`/`Review`/`Availability`
/// are wired up (see the feature README).
class ProviderSummary extends StatelessWidget {
  const ProviderSummary({
    super.key,
    required this.pendingOrders,
    required this.publishedServices,
    required this.rating,
    required this.isAvailable,
  });

  final int pendingOrders;
  final int publishedServices;
  final double rating;
  final bool isAvailable;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Resumen rápido'),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: AppSpacing.space12,
          mainAxisSpacing: AppSpacing.space12,
          childAspectRatio: 1.0,
          children: [
            StatCard(
              icon: Icons.pending_actions_outlined,
              value: '$pendingOrders',
              label: 'Órdenes pendientes',
            ),
            StatCard(
              icon: Icons.design_services_outlined,
              value: '$publishedServices',
              label: 'Servicios publicados',
            ),
            StatCard(
              icon: Icons.star_outline,
              value: rating.toStringAsFixed(1),
              label: 'Calificación',
            ),
            StatCard(
              icon: isAvailable ? AppIcons.success : Icons.cancel_outlined,
              value: isAvailable ? 'Disponible' : 'No disponible',
              label: 'Disponibilidad',
            ),
          ],
        ),
      ],
    );
  }
}
