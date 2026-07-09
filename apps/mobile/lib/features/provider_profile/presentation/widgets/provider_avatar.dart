import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Simulated avatar: a `CircleAvatar` with a generic person Material
/// Icon. No real photo — no official branding/identity exists yet.
class ProviderAvatar extends StatelessWidget {
  const ProviderAvatar({super.key, this.radius = AppSpacing.space32});

  final double radius;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: context.colors.primary,
      child: Icon(
        Icons.person,
        size: radius,
        color: context.colors.onPrimary,
      ),
    );
  }
}
