import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// List of mock recent services (Cliente Home only). Purely visual — no
/// tap behavior yet, real data will come once `Order`/`Service` are
/// wired up (see the feature README).
class RecentServices extends StatelessWidget {
  const RecentServices({super.key, required this.services});

  final List<String> services;

  @override
  Widget build(BuildContext context) {
    if (services.isEmpty) {
      return const AppEmptyState(
        title: 'Sin servicios recientes',
        description: 'Aquí aparecerán tus solicitudes más recientes.',
        icon: Icons.history,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Servicios recientes'),
        for (final service in services)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.space8),
            child: AppCard(
              child: Row(
                children: [
                  const Icon(Icons.history),
                  const SizedBox(width: AppSpacing.space12),
                  Expanded(child: Text(service)),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
