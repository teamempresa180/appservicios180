import 'package:flutter/material.dart';
import '../tokens/app_spacing.dart';

/// Wraps 2-3 `AppButton`s with the same `spacing`/`runSpacing` used by
/// every `*_actions.dart` widget across features (`AddressActions`,
/// `AuthMethodActions`, `VerificationActions`, `ContactActions`,
/// `AvailabilityActions`, `ServiceActions`, `QuickActions`). Callers
/// keep full control of which buttons/variants to pass — this only
/// removes the repeated `Wrap` boilerplate around them.
class AppActionRow extends StatelessWidget {
  const AppActionRow({super.key, required this.actions});

  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: actions,
    );
  }
}
