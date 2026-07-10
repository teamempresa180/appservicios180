import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/payment_display.dart';

/// Recap of the service and provider this payment belongs to. Reuses
/// `AppCard`/`AppSectionTitle` only.
class PaymentInformation extends StatelessWidget {
  const PaymentInformation({super.key, required this.data});

  final PaymentDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Servicio'),
          Text(data.service.name, style: context.textStyles.titleSmall),
          const SizedBox(height: AppSpacing.space4),
          Text(data.service.description, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space16),
          Row(
            children: [
              CircleAvatar(
                radius: AppSpacing.space24,
                backgroundColor: context.colors.primary,
                child: Icon(Icons.person, color: context.colors.onPrimary),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.providerName,
                      style: context.textStyles.titleSmall,
                    ),
                    Text(
                      '${data.provider.yearsOfExperience} años de experiencia',
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
