import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Address Management screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class AddressesEmptyState extends StatelessWidget {
  const AddressesEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin direcciones guardadas',
      description: 'Agrega una dirección para solicitar servicios más '
          'rápido.',
      icon: Icons.location_off_outlined,
    );
  }
}
