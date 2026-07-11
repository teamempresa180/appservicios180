import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/security_display.dart';
import 'audit_log_entry_card.dart';

/// Lists every real `Audit` entry (see `SecurityDisplay` and the
/// feature README) via `AuditLogEntryCard`, most-recent-first. Added
/// as a **planned extension** of this feature, not a new one — same
/// pattern already used for `CredentialsSection`.
class AuditLogSection extends StatelessWidget {
  const AuditLogSection({super.key, required this.data});

  final SecurityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Actividad reciente',
      children: [
        for (final entry in data.sortedAuditLog)
          AuditLogEntryCard(entry: entry),
      ],
    );
  }
}
