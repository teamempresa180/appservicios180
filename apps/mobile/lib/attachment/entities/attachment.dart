import '../../core/base/entity.dart';
import '../../message/models/message_id.dart';
import '../models/attachment_id.dart';
import '../models/attachment_type.dart';
import '../models/attachment_status.dart';

/// Represents a file attached to a Message.
/// Pure data holder — no storage provider, no upload/download, no
/// compression, no OCR, no AI, no antivirus, no persistence, no business rules.
class Attachment extends Entity<AttachmentId> {
  const Attachment({
    required AttachmentId id,
    required this.messageId,
    required this.fileName,
    required this.mimeType,
    required this.fileSize,
    required this.type,
    required this.status,
    required this.createdAt,
  }) : super(id);

  final MessageId messageId;
  final String fileName;
  final String mimeType;
  final int fileSize;
  final AttachmentType type;
  final AttachmentStatus status;
  final DateTime createdAt;
}
