import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../order/models/order_status.dart';
import '../../../payments/presentation/pages/payments_page.dart';
import '../../../reviews/presentation/pages/reviews_page.dart';
import '../../../tracking/presentation/pages/order_tracking_page.dart';
import '../../models/order_display.dart';

/// The order's main action button — its label depends on
/// `Order.status`. Purely visual — [onPressed] is a no-op by default,
/// **except** for:
/// - `accepted`/`inProgress` ("Ver detalle"), which opens Payments for
///   this order's own real payment (not a fixed mock preview), plus a
///   secondary "Rastrear" button opening the live-tracking screen (see
///   `OrderTrackingPage` — simulated movement today, no live-location
///   backend yet).
/// - `completed` ("Calificar"), which opens the Reviews screen.
///
/// No other status navigates anywhere yet (see the feature README).
class OrderActions extends StatelessWidget {
  const OrderActions({super.key, required this.data, this.onPressed});

  final OrderDisplay data;
  final VoidCallback? onPressed;

  String get _label {
    switch (data.order.status) {
      case OrderStatus.pending:
        return 'Ver cotización';
      case OrderStatus.accepted:
      case OrderStatus.inProgress:
        return 'Ver detalle';
      case OrderStatus.completed:
        return 'Calificar';
      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return 'Ver información';
    }
  }

  void _openPayments(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Pago')),
          body: SafeArea(child: PaymentsPage(order: data.order)),
        ),
      ),
    );
  }

  void _openReviews(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Reseñas')),
          body: const SafeArea(child: ReviewsPage()),
        ),
      ),
    );
  }

  /// `OrderDisplay` always joins the *provider's* profile regardless of
  /// which role is viewing the card (see `HttpOrdersRepository.getProfileFor`
  /// — it's built from `getProviderFor`, not the client's identity), so
  /// a real name for "the other party" is only available when the
  /// current account is the client. When the current account is the
  /// provider, there is no client name joined into this display model
  /// yet — a generic label is used instead of fabricating one.
  void _openTracking(BuildContext context) {
    final isProvider = locator<SessionManager>().currentRole == 'PROVIDER';
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => OrderTrackingPage(
          order: data.order,
          otherPartyLabel: isProvider ? 'Tu cliente' : 'Tu proveedor',
          otherPartyName: isProvider ? 'Cliente' : data.providerName,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDetail =
        data.order.status == OrderStatus.accepted ||
        data.order.status == OrderStatus.inProgress;
    final isCompleted = data.order.status == OrderStatus.completed;

    VoidCallback? defaultOnPressed;
    if (isDetail) {
      defaultOnPressed = () => _openPayments(context);
    } else if (isCompleted) {
      defaultOnPressed = () => _openReviews(context);
    } else {
      defaultOnPressed = () {};
    }

    final primaryButton = AppButton(
      label: _label,
      onPressed: onPressed ?? defaultOnPressed,
    );
    if (!isDetail) return primaryButton;

    return Row(
      children: [
        Expanded(
          child: AppButton(
            label: 'Rastrear',
            variant: AppButtonVariant.outlined,
            onPressed: () => _openTracking(context),
          ),
        ),
        const SizedBox(width: AppSpacing.space12),
        Expanded(child: primaryButton),
      ],
    );
  }
}
