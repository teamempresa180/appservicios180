import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../mock/mock_home_data.dart';
import '../models/user_role.dart';

/// Greeting shown at the top of the Home screen: an icon-based avatar
/// (no illustration, no photo — just a Material Icon) plus "Hola" and a
/// mock display name for the current [role].
class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key, required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius: AppSpacing.space24,
          backgroundColor: context.colors.primary,
          child: Icon(Icons.person, color: context.colors.onPrimary),
        ),
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
    );
  }
}
