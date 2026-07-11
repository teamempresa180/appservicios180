import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';

/// Simulated avatar — thin wrapper over `AppAvatar`, same approach as
/// `ProviderAvatar` in `provider_profile`. No real photo — no official
/// branding/identity exists yet.
class ProfileAvatar extends StatelessWidget {
  const ProfileAvatar({super.key, this.radius = AppSpacing.space32});

  final double radius;

  @override
  Widget build(BuildContext context) {
    return AppAvatar(radius: radius);
  }
}
