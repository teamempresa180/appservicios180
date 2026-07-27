/**
 * What aspect of an Identity is being verified.
 */
export enum VerificationType {
  Document = 'DOCUMENT',
  Facial = 'FACIAL',
  Address = 'ADDRESS',
  Phone = 'PHONE',
  Email = 'EMAIL',
  Other = 'OTHER',
  /** Criminal-record background check required from providers at registration. */
  CriminalRecord = 'CRIMINAL_RECORD',
  /** Certification/degree document required from providers at registration. */
  Certification = 'CERTIFICATION',
}
