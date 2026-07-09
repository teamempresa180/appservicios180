import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/service_display.dart';
import 'service_card.dart';

/// Horizontally scrollable row of featured `Service` cards. Purely
/// visual — see the feature README.
class FeaturedServices extends StatelessWidget {
  const FeaturedServices({super.key, required this.services});

  final List<ServiceDisplay> services;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppSectionTitle(title: 'Servicios destacados'),
        SizedBox(
          height: 152,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: services.length,
            separatorBuilder: (context, index) =>
                const SizedBox(width: AppSpacing.space12),
            itemBuilder: (context, index) =>
                ServiceCard(display: services[index]),
          ),
        ),
      ],
    );
  }
}
