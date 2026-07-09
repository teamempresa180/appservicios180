import '../../core/base/entity.dart';
import '../../provider/models/provider_id.dart';
import '../../category/models/category_id.dart';
import '../models/service_id.dart';
import '../models/service_status.dart';
import '../models/service_type.dart';

/// Represents a service that a Provider offers within a Category.
/// Pure data holder — no availability, no scheduling, no pricing rules, no
/// reviews, no location, no persistence, no business rules.
class Service extends Entity<ServiceId> {
  const Service({
    required ServiceId id,
    required this.providerId,
    required this.categoryId,
    required this.name,
    required this.description,
    required this.basePrice,
    required this.estimatedDuration,
    required this.status,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final ProviderId providerId;
  final CategoryId categoryId;
  final String name;
  final String description;
  final num basePrice;
  final int estimatedDuration;
  final ServiceStatus status;
  final ServiceType type;
  final DateTime createdAt;
  final DateTime updatedAt;
}
