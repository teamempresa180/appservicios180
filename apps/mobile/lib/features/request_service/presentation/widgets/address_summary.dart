import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_service_data.dart';

/// Recap of the real `Address` domain entity plus a simulated location
/// label standing in for a map pin (no maps/geolocation integration
/// exists — see the feature README).
class AddressSummary extends StatelessWidget {
  const AddressSummary({super.key, required this.data});

  final RequestServiceData data;

  @override
  Widget build(BuildContext context) {
    final address = data.address;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Dirección'),
          Row(
            children: [
              Icon(Icons.place_outlined, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(address.alias, style: context.textStyles.titleSmall),
                    Text(
                      '${address.fullAddress}, ${address.city}',
                      style: context.textStyles.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(
            data.simulatedLocationLabel,
            style: context.textStyles.bodySmall,
          ),
        ],
      ),
    );
  }
}
