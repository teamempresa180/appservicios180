import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/session/user_role_controller.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../legal/legal_content.dart';
import '../../../legal/presentation/pages/static_info_page.dart';
import '../../../notifications/presentation/pages/notifications_page.dart';
import '../../../profile/presentation/pages/profile_page.dart';
import '../../../settings/presentation/pages/settings_page.dart';

/// Side drawer for everything that doesn't fit the 5-item bottom
/// navigation: Perfil, Notificaciones, the InDrive-style "cambiar a
/// prestador de servicios" role switch, Configuración and the static
/// Legal/Help/About screens, plus Cerrar sesión. Opened from the "Menú"
/// destination in the bottom navigation/rail (see `AppShellPage`), not
/// a hamburger icon.
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  void _push(BuildContext context, Widget page) {
    Navigator.of(context).pop(); // Close the drawer first.
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => page));
  }

  void _openProfile(BuildContext context) => _push(
    context,
    Scaffold(
      appBar: AppBar(title: const Text('Perfil')),
      body: const SafeArea(child: ProfilePage()),
    ),
  );

  void _openNotifications(BuildContext context) => _push(
    context,
    Scaffold(
      appBar: AppBar(title: const Text('Notificaciones')),
      body: const SafeArea(child: NotificationsPage()),
    ),
  );

  void _openSettings(BuildContext context) => _push(
    context,
    Scaffold(
      appBar: AppBar(title: const Text('Configuración')),
      body: const SafeArea(child: SettingsPage()),
    ),
  );

  Future<void> _logout(BuildContext context) async {
    Navigator.of(context).pop();
    await locator<SessionManager>().logout();
    // No explicit navigation: `AppRouteGuard` (wired to `SessionManager`
    // via `GoRouter.refreshListenable`) redirects to Login on its own
    // the moment the session clears.
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: context.colors.surface,
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.space20,
                AppSpacing.space24,
                AppSpacing.space20,
                AppSpacing.space16,
              ),
              child: Row(
                children: [
                  const AppAvatar(radius: 28),
                  const SizedBox(width: AppSpacing.space12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'SERVICIOS 180°',
                          style: context.textStyles.titleMedium,
                        ),
                        Text(
                          'Tu cuenta',
                          style: context.textStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Perfil'),
              onTap: () => _openProfile(context),
            ),
            ListTile(
              leading: const Icon(Icons.notifications_outlined),
              title: const Text('Notificaciones'),
              onTap: () => _openNotifications(context),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.space16,
              ),
              child: _RoleSwitchCard(
                controller: locator<UserRoleController>(),
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(vertical: AppSpacing.space12),
              child: Divider(height: 1),
            ),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Configuración'),
              onTap: () => _openSettings(context),
            ),
            ListTile(
              leading: const Icon(Icons.description_outlined),
              title: const Text('Términos y condiciones'),
              onTap: () => _push(
                context,
                const StaticInfoPage(
                  title: LegalContent.termsTitle,
                  body: LegalContent.terms,
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.privacy_tip_outlined),
              title: const Text('Política de privacidad'),
              onTap: () => _push(
                context,
                const StaticInfoPage(
                  title: LegalContent.privacyTitle,
                  body: LegalContent.privacy,
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.help_outline),
              title: const Text('Ayuda y soporte'),
              onTap: () => _push(
                context,
                const StaticInfoPage(
                  title: LegalContent.helpTitle,
                  body: LegalContent.help,
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.info_outline),
              title: const Text('Acerca de'),
              onTap: () => _push(
                context,
                const StaticInfoPage(
                  title: LegalContent.aboutTitle,
                  body: LegalContent.aboutBody,
                ),
              ),
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.logout, color: context.colors.error),
              title: Text(
                'Cerrar sesión',
                style: TextStyle(color: context.colors.error),
              ),
              onTap: () => _logout(context),
            ),
          ],
        ),
      ),
    );
  }
}

/// InDrive-style "cambiar a conductor" card — here, "Cambiar a
/// prestador de servicios" / "Cambiar a cliente". Deliberately its own
/// card (not a plain `ListTile`) so it reads as the one prominent,
/// distinct action in the drawer instead of blending into the list.
class _RoleSwitchCard extends StatelessWidget {
  const _RoleSwitchCard({required this.controller});

  final UserRoleController controller;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: controller,
      builder: (context, _) {
        final isProvider = controller.isProvider;
        return Material(
          color: context.colors.primaryContainer,
          borderRadius: BorderRadius.circular(AppRadius.radius16),
          child: InkWell(
            borderRadius: BorderRadius.circular(AppRadius.radius16),
            onTap: controller.toggle,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.space16),
              child: Row(
                children: [
                  Icon(
                    isProvider
                        ? Icons.person_outline
                        : Icons.storefront_outlined,
                    color: context.colors.onPrimaryContainer,
                  ),
                  const SizedBox(width: AppSpacing.space12),
                  Expanded(
                    child: Text(
                      isProvider
                          ? 'Cambiar a cliente'
                          : 'Cambiar a prestador de servicios',
                      style: context.textStyles.labelLarge?.copyWith(
                        color: context.colors.onPrimaryContainer,
                      ),
                    ),
                  ),
                  Icon(
                    Icons.swap_horiz,
                    color: context.colors.onPrimaryContainer,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
