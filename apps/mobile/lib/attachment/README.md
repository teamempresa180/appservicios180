# Attachment Module (Flutter)

## Qué representa

`attachment` modela únicamente el archivo adjunto asociado a un mensaje: su
nombre, tipo MIME, tamaño, tipo general y estado. No tiene `updatedAt`.

## Diferencia entre Attachment y Message

`Message` es el contenido comunicativo dentro de un `Chat`. `Attachment` es
un archivo adjunto a ese mensaje.

## Por qué Attachment solo referencia MessageId

`Attachment` importa únicamente `MessageId` — nunca la entidad completa.

## Cómo permitirá conectar posteriormente Firebase Storage, Amazon S3, Cloudinary, MinIO, OCR, IA, Antivirus, Miniaturas sin modificar este dominio

Todos esos módulos futuros almacenarán o procesarán el archivo real
referenciando `AttachmentId` desde su propio dominio — `Attachment` nunca
necesita conocerlos ni cambiar.

## Qué NO contiene

URL pública, storage, bucket, Firebase, Amazon S3, Cloudinary, miniaturas,
OCR, IA, antivirus, versionado, descargas, compresión, encriptación,
persistencia, widgets/pantallas.

## Estructura

```
attachment/
  README.md
  models/
    attachment_id.dart
    attachment_status.dart
    attachment_type.dart
  entities/
    attachment.dart
```

## Relaciones

`Attachment` únicamente referencia `MessageId` (de `message`). `Message` no
conoce `Attachment`.
