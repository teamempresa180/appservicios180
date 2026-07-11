import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_badge.dart';

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

    return AppBadge(label: 'Principal', color: context.colors.primary);
  }
}
