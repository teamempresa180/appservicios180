import 'package:flutter/material.dart';
import '../../../../audit/entities/audit.dart';
import '../../../../audit/models/audit_action_type.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// A single real `Audit` entry: action icon, description (real,
/// passthrough of `Audit.description`) and a formatted timestamp. No
/// color/icon stored anywhere — resolved here from `context.colors.*`.
/// `Audit` has no `status`, so there is no status badge here, unlike
/// `AuthMethodCard`/`CredentialCard`.
class AuditLogEntryCard extends StatelessWidget {
  const AuditLogEntryCard({super.key, required this.entry});

  final Audit entry;

  IconData _iconFor(AuditActionType type) {
    switch (type) {
      case AuditActionType.created:
        return Icons.add_circle_outline;
      case AuditActionType.updated:
        return AppIcons.edit;
      case AuditActionType.deleted:
        return AppIcons.delete;
      case AuditActionType.accessed:
        return Icons.visibility_outlined;
      case AuditActionType.loggedIn:
        return Icons.login_outlined;
      case AuditActionType.loggedOut:
        return Icons.logout_outlined;
      case AuditActionType.other:
        return AppIcons.info;
    }
  }

  String _formatDate(DateTime dateTime) {
    final day = dateTime.day.toString().padLeft(2, '0');
    final month = dateTime.month.toString().padLeft(2, '0');
    final hour = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$day/$month/${dateTime.year} $hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            _iconFor(entry.actionType),
            size: AppSpacing.space20,
            color: context.colors.secondary,
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.description, style: context.textStyles.bodyMedium),
                const SizedBox(height: AppSpacing.space4),
                Text(
                  _formatDate(entry.occurredAt),
                  style: context.textStyles.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
