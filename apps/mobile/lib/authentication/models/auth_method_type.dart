/// The kind of method an Identity can use to authenticate.
/// This only labels the method — it implements no login flow, no token
/// issuance, no third-party integration.
enum AuthMethodType { password, biometric, oneTimeCode, thirdParty, other }
