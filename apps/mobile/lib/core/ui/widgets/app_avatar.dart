import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// Generic circular avatar placeholder: shows [initials] (e.g. "DR")
/// or, if absent, [icon] (default a generic person icon). No real
/// photo support — this project has no image storage yet (see the
/// module README). No domain meaning — purely a shape/color/typography
/// primitive.
class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    this.initials,
    this.icon = Icons.person_outline,
    this.radius = AppSpacing.space24,
  });

  final String? initials;
  final IconData icon;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: context.colors.secondaryContainer,
      foregroundColor: context.colors.onSecondaryContainer,
      child: initials == null
          ? Icon(icon, size: radius)
          : Text(initials!, style: context.textStyles.titleMedium),
    );
  }
}
