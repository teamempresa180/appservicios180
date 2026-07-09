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
import '../models/login_credentials.dart';
import '../widgets/login_footer.dart';
import '../widgets/login_form.dart';

/// Visually complete Login screen. Does NOT authenticate yet: on a valid
/// submit it only simulates a short loading state and navigates to Home.
/// See the feature README for how this connects to Authentication later.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  static const Duration simulatedLoginDelay = Duration(seconds: 1);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isLoading = false;

  Future<void> _handleValidSubmit(LoginCredentials credentials) async {
    setState(() => _isLoading = true);
    await Future<void>.delayed(LoginPage.simulatedLoginDelay);
    if (!mounted) return;
    context.go(AppRoutes.home);
  }

  void _goToRegister() => context.go(AppRoutes.register);

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
                  child: const AppSectionTitle(title: 'Iniciar sesión'),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.space16),
                  child: Text(
                    'Ingresa tus datos para continuar.',
                    style: context.textStyles.bodyMedium,
                  ),
                ),
                AppCard(
                  child: _isLoading
                      ? const AppLoading(message: 'Ingresando...')
                      : LoginForm(
                          onSubmit: _handleValidSubmit,
                          isSubmitting: _isLoading,
                        ),
                ),
                const AppDivider(),
                LoginFooter(
                  onForgotPassword: _goToRegister,
                  onCreateAccount: _goToRegister,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
