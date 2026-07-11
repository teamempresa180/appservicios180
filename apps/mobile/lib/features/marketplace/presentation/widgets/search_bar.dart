import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Purely visual search field — no controller, no `onChanged`, no real
/// search logic. Reuses `AppTextField`'s `prefixIcon` support.
class MarketplaceSearchBar extends StatelessWidget {
  const MarketplaceSearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppTextField(
      hint: 'Buscar servicios o profesionales',
      prefixIcon: AppIcons.search,
    );
  }
}
