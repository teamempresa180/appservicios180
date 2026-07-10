import 'package:flutter/material.dart';
import '../../../../attachment/entities/attachment.dart';
import '../../../../attachment/models/attachment_status.dart';
import '../../../../attachment/models/attachment_type.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// A single real `Attachment` on a message: type icon, file name, size
/// (formatted from the real `fileSize` in bytes) and status badge. No
/// color/icon stored anywhere — resolved here from `context.colors.*`,
/// same rule already applied in `OrderStatusBadge`/`AuditLogEntryCard`.
class AttachmentPreview extends StatelessWidget {
  const AttachmentPreview({
    super.key,
    required this.attachment,
    required this.onSurfaceColor,
  });

  final Attachment attachment;

  /// The bubble's text/icon color, passed down from `MessageBubble` so
  /// this preview stays legible against either bubble background.
  final Color onSurfaceColor;

  IconData _iconFor(AttachmentType type) {
    switch (type) {
      case AttachmentType.image:
        return Icons.image_outlined;
      case AttachmentType.document:
        return Icons.description_outlined;
      case AttachmentType.audio:
        return Icons.mic_outlined;
      case AttachmentType.video:
        return Icons.videocam_outlined;
      case AttachmentType.other:
        return Icons.attach_file_outlined;
    }
  }

  String _statusLabel(AttachmentStatus status) {
    switch (status) {
      case AttachmentStatus.pending:
        return 'Subiendo…';
      case AttachmentStatus.available:
        return 'Disponible';
      case AttachmentStatus.failed:
        return 'Falló';
      case AttachmentStatus.removed:
        return 'Eliminado';
    }
  }

  String _formatSize(int bytes) {
    final kb = bytes / 1024;
    if (kb < 1024) return '${kb.toStringAsFixed(0)} KB';
    return '${(kb / 1024).toStringAsFixed(1)} MB';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: AppSpacing.space4),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space8,
        vertical: AppSpacing.space4,
      ),
      decoration: BoxDecoration(
        border: Border.all(color: onSurfaceColor.withValues(alpha: 0.3)),
        borderRadius: BorderRadius.circular(AppRadius.radius8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _iconFor(attachment.type),
                size: AppSpacing.space16,
                color: onSurfaceColor,
              ),
              const SizedBox(width: AppSpacing.space4),
              Flexible(
                child: Text(
                  attachment.fileName,
                  overflow: TextOverflow.ellipsis,
                  style: context.textStyles.bodySmall?.copyWith(
                    color: onSurfaceColor,
                  ),
                ),
              ),
            ],
          ),
          Text(
            '${_formatSize(attachment.fileSize)} · '
            '${_statusLabel(attachment.status)}',
            style: context.textStyles.bodySmall?.copyWith(
              color: onSurfaceColor.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }
}
