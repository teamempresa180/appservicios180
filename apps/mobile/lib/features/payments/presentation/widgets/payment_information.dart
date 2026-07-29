import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/payment_display.dart';

/// Recap of the service and provider this payment belongs to. Reuses
/// `AppSection`/`AppAvatar` only.
class PaymentInformation extends StatelessWidget {
  const PaymentInformation({super.key, required this.data});

  final PaymentDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Servicio',
      children: [
        Text(
          data.service.name,
          style: context.textStyles.titleSmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: AppSpacing.space4),
        Text(
          data.service.description,
          style: context.textStyles.bodySmall,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: AppSpacing.space16),
        Row(
          children: [
            const AppAvatar(),
            const SizedBox(width: AppSpacing.space12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    data.providerName,
                    style: context.textStyles.titleSmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '${data.provider.yearsOfExperience} años de experiencia',
                    style: context.textStyles.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
