import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../widgets/role_option_card.dart';

/// Asks the freshly-registered user how they intend to use the app:
/// Cliente or Proveedor. Both options currently navigate to the same
/// Home placeholder — separate Home experiences per role don't exist
/// yet. See the feature README for why this step is separate from
/// Register.
class SelectRolePage extends StatelessWidget {
  const SelectRolePage({super.key});

  void _continueAsAnyRole(BuildContext context) => context.go(AppRoutes.home);

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FadeIn(
                  child: const AppSectionTitle(
                    title: '¿Cómo deseas usar AppServicios?',
                  ),
                ),
                const SizedBox(height: AppSpacing.space16),
                ScaleIn(
                  child: RoleOptionCard(
                    icon: Icons.person_outline,
                    title: 'Cliente',
                    description:
                        'Busca y contrata profesionales para tus servicios.',
                    buttonLabel: 'Continuar como Cliente',
                    onPressed: () => _continueAsAnyRole(context),
                  ),
                ),
                const SizedBox(height: AppSpacing.space16),
                ScaleIn(
                  child: RoleOptionCard(
                    icon: Icons.home_repair_service_outlined,
                    title: 'Proveedor',
                    description:
                        'Ofrece tus servicios y administra tus solicitudes.',
                    buttonLabel: 'Continuar como Proveedor',
                    onPressed: () => _continueAsAnyRole(context),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
