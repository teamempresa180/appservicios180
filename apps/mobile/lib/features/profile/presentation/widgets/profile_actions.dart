import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../provider_dashboard/presentation/pages/provider_dashboard_page.dart';

/// "Editar perfil", "Panel del proveedor" and "Cerrar sesión" actions —
/// icon-tile rows (matching `SettingsOptionTile`'s look) instead of
/// three stacked full-width buttons. "Cerrar sesión" is visually
/// distinct (error color) since it's the one destructive/high-stakes
/// action in the group.
class ProfileActions extends StatelessWidget {
  const ProfileActions({
    super.key,
    this.onEditProfile,
    this.onProviderDashboard,
    this.onLogout,
    this.showBecomeProvider = false,
    this.onBecomeProvider,
  });

  final VoidCallback? onEditProfile;
  final VoidCallback? onProviderDashboard;
  final VoidCallback? onLogout;

  /// Shown only for accounts that aren't a Provider yet (see
  /// `SessionManager.currentRole` — `ProfilePage` decides this).
  final bool showBecomeProvider;
  final VoidCallback? onBecomeProvider;

  void _openProviderDashboard(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Panel del proveedor')),
          body: const SafeArea(child: ProviderDashboardPage()),
        ),
      ),
    );
  }

  Widget _tile(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Color? color,
  }) {
    final tileColor = color ?? context.colors.primary;
    return AppCard(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, color: tileColor),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Text(
              label,
              style: context.textStyles.bodyMedium?.copyWith(color: color),
            ),
          ),
          Icon(AppIcons.chevronRight, color: context.colors.secondary),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _tile(
          context,
          icon: Icons.edit_outlined,
          label: 'Editar perfil',
          onTap: onEditProfile ?? () {},
        ),
        const SizedBox(height: AppSpacing.space8),
        _tile(
          context,
          icon: Icons.dashboard_outlined,
          label: 'Panel del proveedor',
          onTap: onProviderDashboard ?? () => _openProviderDashboard(context),
        ),
        const SizedBox(height: AppSpacing.space8),
        if (showBecomeProvider) ...[
          _tile(
            context,
            icon: Icons.work_outline,
            label: 'Quiero convertirme en proveedor',
            onTap: onBecomeProvider ?? () {},
          ),
          const SizedBox(height: AppSpacing.space8),
        ],
        _tile(
          context,
          icon: Icons.logout,
          label: 'Cerrar sesión',
          color: context.colors.error,
          onTap: onLogout ?? () {},
        ),
      ],
    );
  }
}
