import '../models/user_role.dart';

/// Single switch point for which role's Home layout is shown. There is
/// no authentication yet, so the role can't come from a real session —
/// change [current] to preview the other role's screen.
///
/// To test the Cliente layout: `current = UserRole.client`.
/// To test the Proveedor layout: `current = UserRole.provider`.
abstract final class MockUserRole {
  static const UserRole current = UserRole.client;
}
