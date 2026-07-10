import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_payment_data.dart';
import '../../models/payment_display.dart';
import '../../repositories/mock_payments_repository.dart';
import '../widgets/payment_actions.dart';
import '../widgets/payment_breakdown.dart';
import '../widgets/payment_empty_state.dart';
import '../widgets/payment_information.dart';
import '../widgets/payment_loading.dart';
import '../widgets/payment_method_card.dart';
import '../widgets/payment_status_badge.dart';
import '../widgets/payment_summary.dart';
import '../widgets/payments_header.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as `SearchPage`/`OrdersPage`, no real async
/// fetch, no state management.
enum PaymentsViewState { loading, empty, information }

/// Payments screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Completely independent: its own repository,
/// its own mock data.
///
/// Shows a single, fixed payment (no id-based lookup yet) — see the
/// feature README.
class PaymentsPage extends StatelessWidget {
  const PaymentsPage({super.key, this.state = PaymentsViewState.information});

  final PaymentsViewState state;

  PaymentDisplay _buildData() {
    final repository = MockPaymentsRepository();

    return PaymentDisplay(
      payment: repository.getPayment(),
      order: repository.getOrder(),
      quote: repository.getQuote(),
      service: repository.getService(),
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      paymentReference: mockPaymentReference,
      receiptNumber: mockPaymentReceiptNumber,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case PaymentsViewState.loading:
        return const PaymentLoading();
      case PaymentsViewState.empty:
        return const PaymentEmptyState();
      case PaymentsViewState.information:
        final data = _buildData();
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
