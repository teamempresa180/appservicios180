/**
 * The kind of method an Identity can use to authenticate.
 * This only labels the method — it implements no login flow, no token
 * issuance, no third-party integration.
 */
export enum AuthMethodType {
  Password = 'PASSWORD',
  Biometric = 'BIOMETRIC',
  OneTimeCode = 'ONE_TIME_CODE',
  ThirdParty = 'THIRD_PARTY',
  Other = 'OTHER',
}
