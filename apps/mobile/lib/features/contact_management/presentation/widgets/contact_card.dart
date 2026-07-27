import 'package:flutter/material.dart';
import '../../../../contact/entities/contact.dart';
import '../../../../contact/models/contact_status.dart';
import '../../../../contact/models/contact_type.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';
import 'contact_actions.dart';

/// A single real `Contact`: type icon, value and status badge. No
/// color/icon stored anywhere — resolved here from `context.colors.*`,
/// same rule already applied in `OrderStatusBadge`/`ScheduleBlockCard`.
class ContactCard extends StatelessWidget {
  const ContactCard({
    super.key,
    required this.contact,
    this.onEdit,
    this.onDelete,
  });

  final Contact contact;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  IconData _iconFor(ContactType type) {
    switch (type) {
      case ContactType.email:
        return Icons.email_outlined;
      case ContactType.phone:
        return Icons.phone_outlined;
      case ContactType.other:
        return Icons.alternate_email_outlined;
    }
  }

  String _statusLabel(ContactStatus status) {
    switch (status) {
      case ContactStatus.active:
        return 'Activo';
      case ContactStatus.inactive:
        return 'Inactivo';
      case ContactStatus.archived:
        return 'Archivado';
    }
  }

  Color _statusColor(BuildContext context, ContactStatus status) {
    switch (status) {
      case ContactStatus.active:
        return context.colors.primary;
      case ContactStatus.inactive:
        return context.colors.secondary;
      case ContactStatus.archived:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _statusColor(context, contact.status);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppIconRow(
            icon: _iconFor(contact.type),
            iconColor: context.colors.primary,
            iconSize: null,
            padded: false,
            title: contact.value,
            trailing: AppBadge(
              label: _statusLabel(contact.status),
              color: color,
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
          ContactActions(onEdit: onEdit, onDelete: onDelete),
        ],
      ),
    );
  }
}
