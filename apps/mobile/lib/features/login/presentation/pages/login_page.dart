import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../models/login_credentials.dart';
import '../widgets/login_footer.dart';
import '../widgets/login_form.dart';

/// Login screen, connected to the real backend via
/// [SessionManager] (resolved from the service locator — see
/// `core/di/service_locator.dart`). On a valid submit it calls
/// `SessionManager.login`; on success it navigates to Home, on
/// failure it shows the backend's error message in an `AppSnackBar`.
///
/// [LoginCredentials.email] is passed through as the backend's
/// `documentNumber` login identifier — the form's field is still
/// labeled/validated as an email (no aesthetic changes in this
/// prompt), a naming mismatch to reconcile in a later UI-focused
/// prompt.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key, SessionManager? sessionManager})
    : _sessionManager = sessionManager;

  /// Overridable for tests only — production call sites always resolve
  /// the real session manager from the service locator.
  final SessionManager? _sessionManager;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isLoading = false;

  Future<void> _handleValidSubmit(LoginCredentials credentials) async {
    setState(() => _isLoading = true);
    try {
      final sessionManager = widget._sessionManager ?? locator<SessionManager>();
      await sessionManager.login(
        documentNumber: credentials.email,
        password: credentials.password,
      );
      if (!mounted) return;
      context.go(AppRoutes.home);
    } on HttpException catch (exception) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      AppSnackBar.show(context, exception.message, type: AppSnackBarType.error);
    }
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
                FadeIn(child: const AppSectionTitle(title: 'Iniciar sesión')),
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
