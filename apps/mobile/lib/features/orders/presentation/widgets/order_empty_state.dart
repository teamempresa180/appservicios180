import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Orders screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class OrderEmptyState extends StatelessWidget {
  const OrderEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin órdenes todavía',
      description: 'Cuando solicites un servicio, tus órdenes aparecerán '
          'aquí.',
      icon: Icons.receipt_long_outlined,
    );
  }
}
