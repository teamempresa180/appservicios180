import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../repositories/payments_repository.dart';
import '../view_models/payments_view_model.dart';
import '../widgets/payment_actions.dart';
import '../widgets/payment_breakdown.dart';
import '../widgets/payment_information.dart';
import '../widgets/payment_loading.dart';
import '../widgets/payment_method_card.dart';
import '../widgets/payment_status_badge.dart';
import '../widgets/payment_summary.dart';
import '../widgets/payments_header.dart';

/// Payments screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Completely independent: its own repository,
/// its own view model, loaded from the real backend via
/// [PaymentsViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
///
/// Shows a single, fixed payment (no id-based lookup yet) — see the
/// feature README.
class PaymentsPage extends StatefulWidget {
  const PaymentsPage({super.key, PaymentsRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final PaymentsRepository? _repository;

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  late final PaymentsViewModel _viewModel = PaymentsViewModel(
    widget._repository ?? locator<PaymentsRepository>(),
  );

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

  Widget _buildBody() {
    switch (_viewModel.status) {
      case PaymentsLoadStatus.loading:
        return const PaymentLoading();
      case PaymentsLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar el pago',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case PaymentsLoadStatus.success:
        final data = _viewModel.data!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            FadeIn(child: PaymentsHeader(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: PaymentInformation(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: PaymentMethodCard(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Align(
              alignment: Alignment.centerLeft,
              child: PaymentStatusBadge(data: data),
            ),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: PaymentSummary(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: PaymentBreakdown(data: data)),
            const SizedBox(height: AppSpacing.space16),
            PaymentActions(data: data),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(child: _buildBody());
  }
}
