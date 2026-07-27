import 'package:flutter/material.dart';
import '../../../../core/network/api_config.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';

/// Thin wrapper over `AppAvatar` showing the account's real
/// `Profile.avatarUrl` (resolved to an absolute URL via
/// `ApiConfig.resolveUploadUrl`), if set. When [onEditTap] is given, an
/// edit-photo badge is overlaid in the bottom-right corner — used on
/// the Profile screen; omitted elsewhere (e.g. `ProviderAvatar`'s
/// read-only display of someone else's photo).
class ProfileAvatar extends StatelessWidget {
  const ProfileAvatar({
    super.key,
    this.radius = AppSpacing.space32,
    this.avatarUrl,
    this.onEditTap,
  });

  final double radius;
  final String? avatarUrl;
  final VoidCallback? onEditTap;

  @override
  Widget build(BuildContext context) {
    final avatar = AppAvatar(
      radius: radius,
      imageUrl: avatarUrl == null
          ? null
          : ApiConfig.resolveUploadUrl(avatarUrl!),
    );
    if (onEditTap == null) return avatar;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        avatar,
        Positioned(
          right: -4,
          bottom: -4,
          child: Material(
            color: context.colors.primary,
            shape: const CircleBorder(),
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: onEditTap,
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.space4),
                child: Icon(
                  Icons.camera_alt_outlined,
                  size: AppSpacing.space16,
                  color: context.colors.onPrimary,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
