import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/provider_service_display.dart';
import 'service_card.dart';

/// Vertical list of `ServiceCard`s.
class ServicesList extends StatelessWidget {
  const ServicesList({super.key, required this.services});

  final List<ProviderServiceDisplay> services;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final service in services) ...[
          ServiceCard(data: service),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
