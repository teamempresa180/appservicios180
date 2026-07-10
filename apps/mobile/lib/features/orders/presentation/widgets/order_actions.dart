import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../order/models/order_status.dart';
import '../../../payments/presentation/pages/payments_page.dart';
import '../../../reviews/presentation/pages/reviews_page.dart';
import '../../models/order_display.dart';

/// The order's main action button — its label depends on
/// `Order.status`. Purely visual — [onPressed] is a no-op by default,
/// **except** for:
/// - `accepted`/`inProgress` ("Ver detalle"), which opens the
///   (visual-only, fixed mock) Payments screen — the only change
///   authorized in the Payments prompt. Viewing an in-progress order's
///   detail is where checking/making its payment would naturally live.
/// - `completed` ("Calificar"), which opens the (visual-only, fixed
///   mock) Reviews screen — the only change authorized in the Reviews
///   prompt, explicitly specified there.
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
          body: const SafeArea(child: PaymentsPage()),
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

    return AppButton(label: _label, onPressed: onPressed ?? defaultOnPressed);
  }
}
