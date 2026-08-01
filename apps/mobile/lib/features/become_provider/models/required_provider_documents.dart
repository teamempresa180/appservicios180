import '../../../verification/models/verification_type.dart';

/// The seven document types Paso 4 ("Documentación") of the provider
/// wizard requires — one real `Verification` record per type, each
/// with its own real file upload (see `DocumentationStep`). Order here
/// is the order shown in the UI.
const List<VerificationType> requiredProviderDocuments = [
  VerificationType.identityDocument,
  VerificationType.policeRecord,
  VerificationType.procuratorRecord,
  VerificationType.workCertificate,
  VerificationType.educationCertificate,
  VerificationType.license,
  VerificationType.professionalCard,
];

/// Short, user-facing title for a required document's upload card.
String requiredProviderDocumentTitle(VerificationType type) {
  switch (type) {
    case VerificationType.identityDocument:
      return 'Documento de identidad';
    case VerificationType.policeRecord:
      return 'Antecedentes policiales';
    case VerificationType.procuratorRecord:
      return 'Antecedentes de procuraduría';
    case VerificationType.workCertificate:
      return 'Certificado laboral';
    case VerificationType.educationCertificate:
      return 'Certificado de educación';
    case VerificationType.license:
      return 'Licencia profesional';
    case VerificationType.professionalCard:
      return 'Tarjeta profesional';
    default:
      return 'Documento';
  }
}

/// One-line description shown under the title on the upload card.
String requiredProviderDocumentDescription(VerificationType type) {
  switch (type) {
    case VerificationType.identityDocument:
      return 'Cédula o documento de identidad vigente.';
    case VerificationType.policeRecord:
      return 'Certificado de antecedentes de la Policía Nacional.';
    case VerificationType.procuratorRecord:
      return 'Certificado de antecedentes de la Procuraduría.';
    case VerificationType.workCertificate:
      return 'Certificado laboral que respalde tu experiencia.';
    case VerificationType.educationCertificate:
      return 'Diploma o certificado de estudios relacionado.';
    case VerificationType.license:
      return 'Licencia profesional vigente, si tu oficio la requiere.';
    case VerificationType.professionalCard:
      return 'Tarjeta profesional vigente, si tu oficio la requiere.';
    default:
      return 'PDF o imagen, máximo 5 MB.';
  }
}
