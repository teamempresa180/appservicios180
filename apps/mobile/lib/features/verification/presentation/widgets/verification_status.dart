import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/verification_display.dart';
import '../../models/verification_status_display.dart';

/// The verification status badge + estimated review time + rejection
/// reason (when applicable). `VerificationDisplay.verificationStatus`
/// is **fully simulated** — see the feature README. No `Color` is
/// stored anywhere — resolved here from `context.colors.*`.
class VerificationStatusCard extends StatelessWidget {
  const VerificationStatusCard({super.key, required this.data});

  final VerificationDisplay data;

  Color _colorFor(BuildContext context, VerificationStatusDisplay status) {
    switch (status) {
      case VerificationStatusDisplay.pending:
        return context.colors.secondary;
      case VerificationStatusDisplay.approved:
        return context.colors.primary;
      case VerificationStatusDisplay.rejected:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _colorFor(context, data.verificationStatus);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Estado de verificación'),
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
              data.verificationStatus.label,
              style: context.textStyles.bodySmall?.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(
            'Tiempo estimado de revisión: ${data.estimatedReviewTime}',
            style: context.textStyles.bodySmall,
          ),
          if (data.verificationStatus == VerificationStatusDisplay.rejected &&
              data.rejectedReason != null) ...[
            const SizedBox(height: AppSpacing.space8),
            Text(
              data.rejectedReason!,
              style: context.textStyles.bodySmall?.copyWith(
                color: context.colors.error,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
