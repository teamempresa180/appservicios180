/**
 * The general nature of an attached file. A plain label — no storage
 * provider, no thumbnails, no OCR.
 */
export enum AttachmentType {
  Image = 'IMAGE',
  Document = 'DOCUMENT',
  Audio = 'AUDIO',
  Video = 'VIDEO',
  Other = 'OTHER',
}
