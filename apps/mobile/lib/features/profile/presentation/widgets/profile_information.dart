import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import 'profile_avatar.dart';

import '../../models/profile_display.dart';

/// Identity recap: avatar, display name, bio and member-since. Reuses
/// `AppCard`/`AppSectionTitle`/`ProfileAvatar` only.
class ProfileInformation extends StatelessWidget {
  const ProfileInformation({super.key, required this.data, this.onAvatarTap});

  final ProfileDisplay data;

  /// Opens the photo picker when tapped — omitted (no edit badge shown)
  /// if `null`.
  final VoidCallback? onAvatarTap;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Información personal'),
          Row(
            children: [
              ProfileAvatar(
                radius: 28,
                avatarUrl: data.profile.avatarUrl,
                onEditTap: onAvatarTap,
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.displayName,
                      style: context.textStyles.titleSmall,
                    ),
                    Text(
                      'Miembro desde ${data.memberSince}',
                      style: context.textStyles.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (data.profile.bio != null) ...[
            const SizedBox(height: AppSpacing.space8),
            Text(data.profile.bio!, style: context.textStyles.bodyMedium),
          ],
        ],
      ),
    );
  }
}
