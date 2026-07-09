import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../models/register_data.dart';
import '../widgets/register_footer.dart';
import '../widgets/register_form.dart';

/// Visually complete Register screen. Does NOT create a real account yet:
/// on a valid submit it only simulates a short loading state and
/// navigates to role selection. See the feature README for how this
/// connects to Identity/Credentials/Authentication later.
class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  static const Duration simulatedRegisterDelay = Duration(seconds: 1);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool _isLoading = false;

  Future<void> _handleValidSubmit(RegisterData data) async {
    setState(() => _isLoading = true);
    await Future<void>.delayed(RegisterPage.simulatedRegisterDelay);
    if (!mounted) return;
    context.go(AppRoutes.selectRole);
  }

  void _goToLogin() => context.go(AppRoutes.login);

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
                  child: const AppSectionTitle(title: 'Crear cuenta'),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.space16),
                  child: Text(
                    'Completa la información para comenzar.',
                    style: context.textStyles.bodyMedium,
                  ),
                ),
                AppCard(
                  child: _isLoading
                      ? const AppLoading(message: 'Creando cuenta...')
                      : RegisterForm(
                          onSubmit: _handleValidSubmit,
                          isSubmitting: _isLoading,
                        ),
                ),
                const AppDivider(),
                RegisterFooter(onLogin: _goToLogin),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
