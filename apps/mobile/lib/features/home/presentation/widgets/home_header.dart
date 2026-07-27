import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../mock/mock_home_data.dart';
import '../../../../core/session/user_role.dart';
import 'availability_toggle.dart';

/// Greeting shown at the top of the Home screen: an icon-based avatar
/// (no illustration, no photo — just a Material Icon) plus "Hola" and a
/// mock display name for the current [role]. For the provider role,
/// also shows the [AvailabilityToggle] ("Disponible"/"Ocupado") right
/// below the greeting — a provider isn't always able to take new
/// requests.
class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key, required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const AppAvatar(),
            const SizedBox(width: AppSpacing.space12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Hola', style: context.textStyles.titleLarge),
                Text(
                  MockHomeData.displayName(role),
                  style: context.textStyles.bodyMedium,
                ),
              ],
            ),
          ],
        ),
        if (role == UserRole.provider) ...[
          const SizedBox(height: AppSpacing.space12),
          const AvailabilityToggle(),
        ],
      ],
    );
  }
}
