import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../category/models/category_status.dart';
import '../../../category/models/category_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// Fixed, deterministic mock [Category] entities. IDs are stable strings
/// (not `CategoryId.create()`) so [mockServices] can reference them
/// consistently. No backend, no persistence — see the feature README.
final List<Category> mockCategories = [
  Category(
    id: CategoryId.fromString('category-plumbing'),
    name: 'Plomería',
    description: 'Reparación e instalación de tuberías y grifería.',
    icon: 'plumbing',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-electricity'),
    name: 'Electricidad',
    description: 'Instalaciones y reparaciones eléctricas.',
    icon: 'electricity',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-cleaning'),
    name: 'Limpieza',
    description: 'Limpieza profunda de hogares y oficinas.',
    icon: 'cleaning',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-gardening'),
    name: 'Jardinería',
    description: 'Mantenimiento de jardines y áreas verdes.',
    icon: 'gardening',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-painting'),
    name: 'Pintura',
    description: 'Pintura de interiores y exteriores.',
    icon: 'painting',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-pets'),
    name: 'Mascotas',
    description: 'Cuidado, paseo y aseo de mascotas.',
    icon: 'pets',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-technology'),
    name: 'Tecnología',
    description: 'Soporte técnico e instalación de equipos.',
    icon: 'technology',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Category(
    id: CategoryId.fromString('category-beauty'),
    name: 'Belleza',
    description: 'Servicios de belleza y cuidado personal a domicilio.',
    icon: 'beauty',
    color: '#000000',
    status: CategoryStatus.active,
    type: CategoryType.standard,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];
