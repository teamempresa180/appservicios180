import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/provider_display.dart';

/// A single recommended provider card: name, simulated rating and
/// simulated services count. Purely visual — no tap behavior yet (see
/// the feature README).
class ProviderCard extends StatelessWidget {
  const ProviderCard({super.key, required this.display});

  final ProviderDisplay display;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: AppCard(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AppAvatar(),
            const SizedBox(height: AppSpacing.space8),
            Text(
              display.name,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.titleSmall,
            ),
            const SizedBox(height: AppSpacing.space4),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.star_outline,
                  size: AppSpacing.space16,
                  color: context.colors.primary,
                ),
                const SizedBox(width: AppSpacing.space4),
                Text(
                  display.rating.toStringAsFixed(1),
                  style: context.textStyles.bodySmall,
                ),
              ],
            ),
            Text(
              '${display.servicesCount} servicios',
              style: context.textStyles.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
