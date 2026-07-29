import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/address_display.dart';
import 'address_actions.dart';
import 'default_address_badge.dart';

/// A single address card: alias (real `label`), full address, city,
/// state, associated contact, default indicator and the edit/delete/
/// select actions.
class AddressCard extends StatelessWidget {
  const AddressCard({super.key, required this.data, this.onEdit, this.onDelete});

  final AddressDisplay data;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    final address = data.address;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.place_outlined, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Text(
                  data.label,
                  style: context.textStyles.titleSmall,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              DefaultAddressBadge(isDefault: data.isDefault),
            ],
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(
            address.fullAddress,
            style: context.textStyles.bodyMedium,
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            '${address.city}, ${address.state}',
            style: context.textStyles.bodySmall,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
          const SizedBox(height: AppSpacing.space8),
          Row(
            children: [
              Icon(
                Icons.phone_outlined,
                size: AppSpacing.space16,
                color: context.colors.secondary,
              ),
              const SizedBox(width: AppSpacing.space4),
              Expanded(
                child: Text(
                  data.contact.value,
                  overflow: TextOverflow.ellipsis,
                  style: context.textStyles.bodySmall,
                ),
              ),
            ],
          ),
          if (data.deliveryInstructions.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space4),
            Text(
              data.deliveryInstructions,
              style: context.textStyles.bodySmall,
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
            ),
          ],
          const SizedBox(height: AppSpacing.space12),
          AddressActions(onEdit: onEdit, onDelete: onDelete),
        ],
      ),
    );
  }
}
