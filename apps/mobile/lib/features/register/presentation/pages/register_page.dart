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
import '../../repositories/register_repository.dart';
import '../models/register_data.dart';
import '../widgets/register_footer.dart';
import '../widgets/register_form.dart';

/// Register screen, connected to the real backend via
/// [RegisterRepository] (resolved from the service locator — see
/// `core/di/service_locator.dart`). On a valid submit it creates a
/// real Identity/Credential/Authentication, logs the new account in
/// via [SessionManager], then navigates to role selection. On failure
/// it shows the backend's error message in an `AppSnackBar`.
class RegisterPage extends StatefulWidget {
  const RegisterPage({
    super.key,
    RegisterRepository? repository,
    SessionManager? sessionManager,
  }) : _repository = repository,
       _sessionManager = sessionManager;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository/session manager from the service locator.
  final RegisterRepository? _repository;
  final SessionManager? _sessionManager;

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool _isLoading = false;

  Future<void> _handleValidSubmit(RegisterData data) async {
    setState(() => _isLoading = true);
    try {
      final repository = widget._repository ?? locator<RegisterRepository>();
      final sessionManager =
          widget._sessionManager ?? locator<SessionManager>();
      await repository.register(
        fullName: data.fullName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        birthDate: data.birthDate,
        password: data.password,
      );

      // The account now exists on the backend. If the follow-up
      // auto-login fails, this is emphatically *not* a failed
      // registration — but the old code reported it as one and left
      // the user on the Register form, where retrying could only ever
      // fail with "document number already registered". A dead end
      // that costs the pilot user their account. Send them to Login,
      // which is the one action that can actually succeed.
      try {
        await sessionManager.login(
          documentNumber: data.documentNumber,
          password: data.password,
        );
      } catch (_) {
        if (!mounted) return;
        setState(() => _isLoading = false);
        AppSnackBar.show(
          context,
          'Tu cuenta fue creada. Inicia sesión para continuar.',
          type: AppSnackBarType.info,
        );
        context.go(AppRoutes.login);
        return;
      }

      if (!mounted) return;
      context.go(AppRoutes.selectRole);
    } on HttpException catch (exception) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      AppSnackBar.show(
        context,
        _messageFor(exception),
        type: AppSnackBarType.error,
      );
    } catch (_) {
      // Non-`HttpException` failures would otherwise leave the card
      // stuck on "Creando cuenta..." with no error and no way back.
      if (!mounted) return;
      setState(() => _isLoading = false);
      AppSnackBar.show(
        context,
        'No pudimos crear tu cuenta. Inténtalo de nuevo.',
        type: AppSnackBarType.error,
      );
    }
  }

  /// A lost-connectivity failure (no internet, DNS failure, timeout —
  /// see `HttpException.isConnectivityIssue`) never got a response
  /// from the server, so its `message` is Dio's raw, English,
  /// technical exception text — not something to show verbatim in a
  /// Spanish-language app. A `5xx` is likewise the backend's internal
  /// wording, meaningless to a pilot user. Everything else here is a
  /// `400`/`422` validation error, whose message is written for the
  /// end user and names the offending field.
  String _messageFor(HttpException exception) {
    if (exception.isConnectivityIssue) {
      return 'No hay conexión a internet. Verifica tu conexión e intenta de nuevo.';
    }
    if (exception is ServerHttpException) {
      return exception.statusCode == 429
          ? 'Demasiados intentos. Espera un minuto antes de volver a intentar.'
          : 'Tuvimos un problema al crear tu cuenta. Inténtalo de nuevo en unos minutos.';
    }
    return exception.message;
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
                const FadeIn(child: AppSectionTitle(title: 'Crear cuenta')),
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
