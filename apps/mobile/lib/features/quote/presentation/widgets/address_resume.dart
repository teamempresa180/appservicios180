import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Recap of the real `Address` domain entity where the service will be
/// rendered.
class AddressResume extends StatelessWidget {
  const AddressResume({super.key, required this.data});

  final QuoteData data;

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
        ],
      ),
    );
  }
}
