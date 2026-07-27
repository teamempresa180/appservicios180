import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Marketplace search field. Controlled: typing filters the results
/// list (see `MarketplacePage`) instead of the browse sections.
class MarketplaceSearchBar extends StatelessWidget {
  const MarketplaceSearchBar({
    super.key,
    required this.controller,
    required this.onChanged,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      controller: controller,
      hint: 'Buscar servicios o profesionales',
      prefixIcon: AppIcons.search,
      onChanged: onChanged,
      suffixIcon: ValueListenableBuilder<TextEditingValue>(
        valueListenable: controller,
        builder: (context, value, _) {
          if (value.text.isEmpty) return const SizedBox.shrink();
          return IconButton(
            icon: const Icon(Icons.close),
            tooltip: 'Limpiar búsqueda',
            onPressed: () {
              controller.clear();
              onChanged('');
            },
          );
        },
      ),
    );
  }
}
