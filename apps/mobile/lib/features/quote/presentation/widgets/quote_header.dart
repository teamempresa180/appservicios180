import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/models/order_status.dart';

/// Order title + a subtitle describing what this screen is waiting on
/// or showing: "Esperando cotizaciones" for a still-`Pending` order
/// with no quotes yet, "N cotizaciones recibidas" once at least one
/// exists, or the plain status label for anything past `Pending`.
class QuoteHeader extends StatelessWidget {
  const QuoteHeader({super.key, required this.order, required this.quoteCount});

  final Order order;
  final int quoteCount;

  String get _subtitle {
    if (order.status != OrderStatus.pending) {
      return 'Cotización aceptada';
    }
    if (quoteCount == 0) return 'Esperando cotizaciones...';
    return quoteCount == 1 ? '1 cotización recibida' : '$quoteCount cotizaciones recibidas';
  }

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(title: order.title, subtitle: _subtitle);
  }
}
