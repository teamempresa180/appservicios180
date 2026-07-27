import '../../../../identity/models/document_type.dart';

/// Plain data captured by the Register form once local validation
/// passes — matches exactly what the backend's `POST /identities`,
/// `POST /credentials` and `POST /authentications` need to create a
/// real account (see `RegisterRepository.register`).
class RegisterData {
  const RegisterData({
    required this.fullName,
    required this.documentType,
    required this.documentNumber,
    required this.birthDate,
    required this.password,
  });

  final String fullName;
  final DocumentType documentType;
  final String documentNumber;
  final DateTime birthDate;
  final String password;
}
