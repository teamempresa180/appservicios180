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
  /** Antecedentes de policía, required from providers at registration. */
  PoliceRecord = 'POLICE_RECORD',
  /** Antecedentes de Procuraduría, required from providers at registration. */
  ProcuratorRecord = 'PROCURATOR_RECORD',
  /** Certificado laboral required from providers at registration. */
  WorkCertificate = 'WORK_CERTIFICATE',
  /** Licencia (e.g. driving/operating license) required from providers at registration. */
  License = 'LICENSE',
  /** Tarjeta profesional required from providers at registration. */
  ProfessionalCard = 'PROFESSIONAL_CARD',
}
