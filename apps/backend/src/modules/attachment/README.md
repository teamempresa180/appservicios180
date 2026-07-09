# Attachment Module (Backend)

## Qué representa

`Attachment` modela únicamente el **archivo adjunto asociado a un
mensaje**: su nombre, tipo MIME, tamaño, tipo general y estado. Es dominio
puro — solo representa el dato descriptivo del archivo, no su
almacenamiento ni transferencia.

Campos representados (sin comportamiento, solo datos):

- `AttachmentId`
- `MessageId` (reutilizado de `message`)
- `fileName`
- `mimeType`
- `fileSize`
- `type`
- `status`
- `createdAt`

A diferencia de otros módulos, `Attachment` no tiene `updatedAt`: representa
un archivo adjuntado en un momento dado, no una entidad que se edite.

## Diferencia entre Attachment y Message

`Message` es el contenido textual/comunicativo dentro de un `Chat`.
`Attachment` es un archivo adjunto a ese mensaje — información
complementaria, no el mensaje en sí. Un `Message` puede tener cero o más
`Attachment`.

## Por qué Attachment solo referencia MessageId

`Attachment` importa únicamente `MessageId` — nunca la entidad `Message`
completa. Esto mantiene el dominio de `Attachment` desacoplado de los campos
internos de `message`.

## Cómo permitirá conectar posteriormente Firebase Storage, Amazon S3, Cloudinary, MinIO, OCR, IA, Antivirus, Miniaturas sin modificar este dominio

- **Firebase Storage / Amazon S3 / Cloudinary / MinIO**: un módulo de
  infraestructura futuro almacenará el archivo real y asociará su ubicación
  (bucket, key, URL) a este `AttachmentId`, sin que este dominio conozca
  ningún proveedor de almacenamiento.
- **OCR**: podrá procesar el archivo referenciado por `AttachmentId` como
  entrada de solo lectura para extraer texto.
- **IA**: podrá analizar el contenido del archivo (por ejemplo,
  clasificación de imágenes) referenciando `AttachmentId`.
- **Antivirus**: un escaneo futuro podrá referenciar `AttachmentId` para
  registrar su resultado, sin campos de escaneo en este dominio.
- **Miniaturas**: un módulo futuro podrá generar y asociar miniaturas a
  `AttachmentId`, sin que `Attachment` tenga campos de miniatura.

En todos los casos, `Attachment` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

URL pública, storage, bucket, Firebase, Amazon S3, Cloudinary, miniaturas,
OCR, IA, antivirus, versionado, descargas, compresión, encriptación, APIs,
controladores, DTOs, casos de uso, servicios de aplicación, persistencia.

## Estructura

```
attachment/
  README.md
  domain/
    entities/
      attachment.entity.ts
    value-objects/
      attachment-id.value-object.ts
      attachment-status.value-object.ts
      attachment-type.value-object.ts
    interfaces/
      attachment-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Attachment` únicamente referencia `MessageId` (de `message`) — nunca
importa esa entidad completa. `Message` no conoce `Attachment`.
