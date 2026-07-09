import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_display.dart';
import 'provider_card.dart';

/// Horizontally scrollable row of recommended `Provider` cards. Purely
/// visual — see the feature README.
class RecommendedProviders extends StatelessWidget {
  const RecommendedProviders({super.key, required this.providers});

  final List<ProviderDisplay> providers;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Proveedores recomendados'),
        SizedBox(
          height: 168,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: providers.length,
            separatorBuilder: (context, index) =>
                const SizedBox(width: AppSpacing.space12),
            itemBuilder: (context, index) =>
                ProviderCard(display: providers[index]),
          ),
        ),
      ],
    );
  }
}
