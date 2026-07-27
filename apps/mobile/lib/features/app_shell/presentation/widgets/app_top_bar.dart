import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/user_role_controller.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Top bar shared by every screen hosted inside the App Shell. Shows the
/// 180° logo mark inline (transparent PNG — no card/box behind it, so it
/// reads as part of the bar rather than a pasted-in image) instead of a
/// text title, plus a small "Modo Proveedor"/"Modo Cliente" badge that
/// reflects [UserRoleController]'s current role — so which role is
/// active is visible from anywhere in the app, not just the drawer.
///
/// Purely informational — no actions. The drawer (Perfil, Notificaciones,
/// Configuración, etc.) opens from the "Menú" destination in the bottom
/// navigation/rail instead of a hamburger icon here, so
/// [automaticallyImplyLeading] is off to suppress Flutter's automatic
/// drawer-opening icon.
class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  const AppTopBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            'assets/icon/app_icon_source.png',
            height: 34,
            filterQuality: FilterQuality.high,
          ),
          const SizedBox(width: AppSpacing.space8),
          ListenableBuilder(
            listenable: locator<UserRoleController>(),
            builder: (context, _) {
              final isProvider = locator<UserRoleController>().isProvider;
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.space8,
                  vertical: AppSpacing.space4,
                ),
                decoration: BoxDecoration(
                  color: context.colors.primary,
                  borderRadius: BorderRadius.circular(AppRadius.radiusPill),
                ),
                child: Text(
                  isProvider ? 'Modo Proveedor' : 'Modo Cliente',
                  style: context.textStyles.labelSmall?.copyWith(
                    color: context.colors.onPrimary,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
