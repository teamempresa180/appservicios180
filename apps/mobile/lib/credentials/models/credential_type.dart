/// The kind of secret material a credential record refers to.
/// This module never stores the secret itself — only labels the kind of
/// credential that exists for an Identity.
enum CredentialType { password, recoveryCode, securityKey, other }
