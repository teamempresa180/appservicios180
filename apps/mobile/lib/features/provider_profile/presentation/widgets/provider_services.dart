import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../service/entities/service.dart';

/// The provider's published services (real `Service` entities). Purely
/// visual — no tap behavior yet.
class ProviderServices extends StatelessWidget {
  const ProviderServices({super.key, required this.services});

  final List<Service> services;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Servicios publicados'),
          for (final service in services) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    service.name,
                    style: context.textStyles.bodyMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: AppSpacing.space8),
                Text(
                  '\$${service.basePrice}',
                  style: context.textStyles.titleSmall,
                ),
              ],
            ),
            if (service != services.last) const AppDivider(),
          ],
        ],
      ),
    );
  }
}
