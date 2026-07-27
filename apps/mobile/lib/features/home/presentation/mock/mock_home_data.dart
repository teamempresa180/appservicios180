import '../../../../core/session/user_role.dart';

/// Static mock content for the Home screen. No backend, no persistence —
/// purely illustrative placeholder data until Provider/Service/Category/
/// Order/Notification are wired up for real (see the feature README).
abstract final class MockHomeData {
  static String displayName(UserRole role) => switch (role) {
    UserRole.client => 'María',
    UserRole.provider => 'Carlos',
  };

  static const List<String> quickCategories = [
    'Plomería',
    'Electricidad',
    'Limpieza',
    'Jardinería',
    'Pintura',
  ];

  static const List<String> recentServices = [
    'Reparación de fuga de agua',
    'Instalación de lámparas',
    'Limpieza profunda de hogar',
  ];

  static const int pendingOrders = 3;
  static const int publishedServices = 5;
  static const double rating = 4.8;
  static const bool isAvailable = true;
}
