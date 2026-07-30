import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/session/user_role.dart';

/// Compact greeting card floating over [HomeMapBackground] — the
/// map-layout replacement for [HomeHeader], which needed a solid
/// background to read as a full-width row and doesn't work floating
/// over map tiles.
///
/// Deliberately a generic "Hola" with no name: the backend's
/// `GET /authentications/me` (`CurrentUser`, see `core/session`) only
/// returns `id`/`role` today — there is no real display name to show
/// here yet, so this no longer invents one (it used to always read
/// "Hola, María" regardless of who was actually logged in).
class HomeMapGreetingPill extends StatelessWidget {
  const HomeMapGreetingPill({super.key, required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space12,
        vertical: AppSpacing.space8,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: BorderRadius.circular(AppRadius.radiusPill),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 12,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const AppAvatar(radius: 16),
          const SizedBox(width: AppSpacing.space8),
          Flexible(
            child: Text(
              'Hola',
              style: context.textStyles.labelLarge,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
