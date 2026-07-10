import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../provider_dashboard/presentation/pages/provider_dashboard_page.dart';

/// "Editar perfil", "Panel del proveedor" and "Cerrar sesión" actions.
/// "Panel del proveedor" opens the (visual-only, fixed mock) Provider
/// Dashboard screen — the only change authorized in the Provider
/// Dashboard prompt. The other two remain no-ops: neither opens a real
/// edit form nor signs the user out yet (no authentication exists —
/// see the feature README).
class ProfileActions extends StatelessWidget {
  const ProfileActions({
    super.key,
    this.onEditProfile,
    this.onProviderDashboard,
    this.onLogout,
  });

  final VoidCallback? onEditProfile;
  final VoidCallback? onProviderDashboard;
  final VoidCallback? onLogout;

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

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppButton(
          label: 'Editar perfil',
          onPressed: onEditProfile ?? () {},
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Panel del proveedor',
          onPressed:
              onProviderDashboard ??
              () => _openProviderDashboard(context),
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(label: 'Cerrar sesión', onPressed: onLogout ?? () {}),
      ],
    );
  }
}
