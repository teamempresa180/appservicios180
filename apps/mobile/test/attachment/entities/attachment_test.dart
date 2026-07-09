import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/attachment/entities/attachment.dart';
import 'package:mobile/attachment/models/attachment_id.dart';
import 'package:mobile/attachment/models/attachment_type.dart';
import 'package:mobile/attachment/models/attachment_status.dart';
import 'package:mobile/message/models/message_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = AttachmentId.create();
    final messageId = MessageId.create();
    final now = DateTime(2026, 1, 1);
    final attachment = Attachment(
      id: id,
      messageId: messageId,
      fileName: 'factura.pdf',
      mimeType: 'application/pdf',
      fileSize: 204800,
      type: AttachmentType.document,
      status: AttachmentStatus.available,
      createdAt: now,
    );

    expect(attachment.id, id);
    expect(attachment.messageId, messageId);
    expect(attachment.fileName, 'factura.pdf');
    expect(attachment.mimeType, 'application/pdf');
    expect(attachment.fileSize, 204800);
    expect(attachment.type, AttachmentType.document);
    expect(attachment.status, AttachmentStatus.available);
  });

  test('is equal to another attachment with the same id', () {
    final id = AttachmentId.create();
    final messageId = MessageId.create();
    final now = DateTime(2026, 1, 1);
    Attachment build() => Attachment(
      id: id,
      messageId: messageId,
      fileName: 'foto.jpg',
      mimeType: 'image/jpeg',
      fileSize: 102400,
      type: AttachmentType.image,
      status: AttachmentStatus.pending,
      createdAt: now,
    );

    expect(build(), equals(build()));
  });
}
