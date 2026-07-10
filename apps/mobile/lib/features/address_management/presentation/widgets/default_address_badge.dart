import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Badge shown when `AddressDisplay.isDefault` is true. Resolves its
/// color from `context.colors` — never a hardcoded `Color` literal,
/// same rule already applied in `OrderStatusBadge`/`PaymentStatusBadge`.
/// Renders nothing when the address isn't the default one.
class DefaultAddressBadge extends StatelessWidget {
  const DefaultAddressBadge({super.key, required this.isDefault});

  final bool isDefault;

  @override
  Widget build(BuildContext context) {
    if (!isDefault) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space12,
        vertical: AppSpacing.space4,
      ),
      decoration: BoxDecoration(
        color: context.colors.primary.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.radius8),
      ),
      child: Text(
        'Principal',
        style: context.textStyles.bodySmall?.copyWith(
          color: context.colors.primary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
