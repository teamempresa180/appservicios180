import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../trust/models/trust_level.dart';
import '../../models/trust_display.dart';

/// The trust score, level badge, status and last-updated date. All
/// **real** domain data (`Trust.score`/`level`/`status`/`updatedAt`) —
/// see `TrustDisplay`'s class doc. No `Color` is stored anywhere —
/// resolved here from `context.colors.*`, same rule already applied in
/// `OrderStatusBadge`/`VerificationStatusCard`.
class TrustScoreCard extends StatelessWidget {
  const TrustScoreCard({super.key, required this.data});

  final TrustDisplay data;

  Color _colorFor(BuildContext context, TrustLevel level) {
    switch (level) {
      case TrustLevel.low:
        return context.colors.error;
      case TrustLevel.medium:
        return context.colors.secondary;
      case TrustLevel.high:
      case TrustLevel.veryHigh:
        return context.colors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _colorFor(context, data.trust.level);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Puntaje de confianza'),
          Text(
            data.scoreValue.toString(),
            style: context.textStyles.titleLarge,
          ),
          const SizedBox(height: AppSpacing.space8),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.space12,
              vertical: AppSpacing.space4,
            ),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.radius8),
            ),
            child: Text(
              'Nivel ${data.levelText}',
              style: context.textStyles.bodySmall?.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(
            'Estado: ${data.statusText}',
            style: context.textStyles.bodySmall,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            'Última actualización: ${data.lastUpdated.day}/'
            '${data.lastUpdated.month}/${data.lastUpdated.year}',
            style: context.textStyles.bodySmall,
          ),
        ],
      ),
    );
  }
}
