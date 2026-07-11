import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// Generic circular avatar placeholder. Extracted (Sprint 2, Etapa 3)
/// from ten features that each built an identical `CircleAvatar` (bg
/// `context.colors.primary`, icon `Icons.person` sized to match the
/// radius, `onPrimary` icon color) — the de facto "official" look this
/// widget now formalizes.
///
/// Shows [initials] (e.g. "DR") if given, otherwise [icon]. No real
/// photo support — this project has no image storage yet (see the
/// module README).
class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    this.initials,
    this.icon = Icons.person,
    this.radius = AppSpacing.space24,
  });

  final String? initials;
  final IconData icon;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: context.colors.primary,
      child: initials == null
          ? Icon(icon, size: radius, color: context.colors.onPrimary)
          : Text(
              initials!,
              style: context.textStyles.titleMedium?.copyWith(
                color: context.colors.onPrimary,
              ),
            ),
    );
  }
}
