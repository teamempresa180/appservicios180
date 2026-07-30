import 'package:flutter/material.dart';
import '../../../../authentication/entities/authentication.dart';
import '../../../../authentication/models/authentication_status.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_dialog.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../repositories/security_repository.dart';
import '../view_models/security_view_model.dart';
import '../widgets/add_auth_method_button.dart';
import '../widgets/audit_log_section.dart';
import '../widgets/auth_method_card.dart';
import '../widgets/auth_method_type_sheet.dart';
import '../widgets/credentials_section.dart';
import '../widgets/security_empty_state.dart';
import '../widgets/security_header.dart';
import '../widgets/security_loading.dart';
import '../widgets/security_statistics.dart';

/// Security screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Settings`).
/// Loads from the real backend via [SecurityViewModel] (resolved from
/// the service locator — see `core/di/service_locator.dart`).
///
/// "Agregar método"/"Desactivar"/"Eliminar" all call through to the
/// real `SecurityRepository` CRUD methods for `Authentication`
/// records — see `HttpSecurityRepository`'s class doc for the
/// documented limitation on how far that migration currently goes.
class SecurityPage extends StatefulWidget {
  const SecurityPage({super.key, SecurityRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final SecurityRepository? _repository;

  @override
  State<SecurityPage> createState() => _SecurityPageState();
}

class _SecurityPageState extends State<SecurityPage> {
  late final SecurityRepository _repository =
      widget._repository ?? locator<SecurityRepository>();
  late final SecurityViewModel _viewModel = SecurityViewModel(_repository);

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    super.dispose();
  }

  Future<void> _addAuthMethod() async {
    final methodType = await AuthMethodTypeSheet.show(context);
    if (methodType == null || !mounted) return;
    final identity = _viewModel.data!.identity;
    await _repository.createAuthMethod(
      identity: identity,
      methodType: methodType,
    );
    if (!mounted) return;
    AppSnackBar.show(
      context,
      'Método de autenticación agregado.',
      type: AppSnackBarType.success,
    );
    await _viewModel.load();
  }

  Future<void> _toggleStatus(Authentication authMethod) async {
    final isActive = authMethod.status == AuthenticationStatus.active;
    await _repository.updateAuthMethodStatus(
      authMethod,
      isActive ? AuthenticationStatus.inactive : AuthenticationStatus.active,
    );
    if (!mounted) return;
    AppSnackBar.show(
      context,
      isActive ? 'Método desactivado.' : 'Método activado.',
      type: AppSnackBarType.info,
    );
    await _viewModel.load();
  }

  Future<void> _deleteAuthMethod(Authentication authMethod) async {
    final confirmed = await AppDialog.show<bool>(
      context,
      title: 'Eliminar método',
      content: const Text(
        '¿Eliminar este método de autenticación? Esta acción no se puede deshacer.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: const Text('Eliminar'),
        ),
      ],
    );
    if (confirmed != true || !mounted) return;
    await _repository.deleteAuthMethod(authMethod);
    if (!mounted) return;
    AppSnackBar.show(context, 'Método eliminado.', type: AppSnackBarType.info);
    await _viewModel.load();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case SecurityLoadStatus.loading:
        return const SecurityLoading();
      case SecurityLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la seguridad de tu cuenta',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case SecurityLoadStatus.success:
        final data = _viewModel.data!;
        if (data.authMethods.isEmpty) return const SecurityEmptyState();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: SecurityStatistics(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Column(
              children: [
                for (final (index, authMethod) in data.authMethods.indexed) ...[
                  FadeIn(
                    delay: staggerDelayFor(index),
                    child: SlideIn(
                      child: AuthMethodCard(
                        authMethod: authMethod,
                        onDisable: () => _toggleStatus(authMethod),
                        onDelete: () => _deleteAuthMethod(authMethod),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space12),
                ],
              ],
            ),
            AddAuthMethodButton(onPressed: _addAuthMethod),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: CredentialsSection(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: AuditLogSection(data: data)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: _viewModel.status == SecurityLoadStatus.success
          ? SecurityHeader(data: _viewModel.data!)
          : const SizedBox.shrink(),
      body: _buildBody(),
    );
  }
}
