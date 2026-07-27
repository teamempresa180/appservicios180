import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/provider_service_display.dart';
import 'service_card.dart';

/// Vertical list of `ServiceCard`s, entering with a staggered
/// fade+slide (see `staggerDelayFor`).
class ServicesList extends StatelessWidget {
  const ServicesList({
    super.key,
    required this.services,
    this.onEdit,
    this.onPause,
    this.onDelete,
  });

  final List<ProviderServiceDisplay> services;
  final ValueChanged<ProviderServiceDisplay>? onEdit;
  final ValueChanged<ProviderServiceDisplay>? onPause;
  final ValueChanged<ProviderServiceDisplay>? onDelete;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final (index, service) in services.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(
              child: ServiceCard(
                data: service,
                onEdit: onEdit == null ? null : () => onEdit!(service),
                onPause: onPause == null ? null : () => onPause!(service),
                onDelete: onDelete == null ? null : () => onDelete!(service),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
