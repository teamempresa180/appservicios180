import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';

/// Simulated avatar: a `CircleAvatar` with a generic person Material
/// Icon. No real photo — no official branding/identity exists yet.
/// Same approach as `ProviderAvatar` in `provider_profile`.
class ProfileAvatar extends StatelessWidget {
  const ProfileAvatar({super.key, this.radius = 32});

  final double radius;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: context.colors.primary,
      child: Icon(Icons.person, size: radius, color: context.colors.onPrimary),
    );
  }
}
