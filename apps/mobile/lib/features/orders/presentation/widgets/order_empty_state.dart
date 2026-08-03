import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Empty state for the Orders screen. Reuses `AppEmptyState` — no new
/// Core UI widget. [title]/[description] are overridable so a tab that
/// happens to be empty while other tabs have orders can say so
/// precisely, instead of claiming the client has no orders at all.
class OrderEmptyState extends StatelessWidget {
  const OrderEmptyState({super.key, this.title, this.description});

  final String? title;
  final String? description;

  @override
  Widget build(BuildContext context) {
    return AppEmptyState(
      title: title ?? 'Sin órdenes todavía',
      description:
          description ??
          'Cuando solicites un servicio, tus órdenes aparecerán aquí.',
      icon: Icons.receipt_long_outlined,
    );
  }
}
